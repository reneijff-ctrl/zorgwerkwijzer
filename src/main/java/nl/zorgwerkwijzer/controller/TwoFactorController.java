package nl.zorgwerkwijzer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.exception.ResourceNotFoundException;
import nl.zorgwerkwijzer.model.User;
import nl.zorgwerkwijzer.model.UserRole;
import nl.zorgwerkwijzer.repository.UserRepository;
import nl.zorgwerkwijzer.service.TotpService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/2fa")
@RequiredArgsConstructor
@Tag(name = "Admin 2FA", description = "Two-Factor Authentication setup en verificatie voor admins")
public class TwoFactorController {

    private final TotpService totpService;
    private final UserRepository userRepository;

    private static final int RECOVERY_CODE_COUNT  = 8;
    private static final int RECOVERY_CODE_LENGTH = 10;
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Stap 1: Genereer een nieuw TOTP-secret en QR-code voor de ingelogde admin.
     * De admin scant de QR-code met Google Authenticator / Authy / Microsoft Authenticator.
     */
    @GetMapping("/setup")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Start 2FA setup", description = "Genereert een nieuw TOTP-secret en QR-code voor de admin.")
    public ResponseEntity<Map<String, String>> setup(@AuthenticationPrincipal UserDetails userDetails) {
        User user = resolveAdmin(userDetails);

        String secret = totpService.generateSecret();
        String otpAuthUri = totpService.generateOtpAuthUri(secret, user.getEmail());
        String qrCodeDataUri = totpService.generateQrCodeDataUri(otpAuthUri);

        // Sla het secret tijdelijk op (nog niet geactiveerd — twoFactorEnabled blijft false)
        user.setTwoFactorSecret(secret);
        userRepository.save(user);

        log.info("[2FA] Setup gestart voor admin {}", user.getEmail());

        return ResponseEntity.ok(Map.of(
                "secret", secret,
                "qrCode", qrCodeDataUri,
                "otpAuthUri", otpAuthUri
        ));
    }

    /**
     * Stap 2: Bevestig de 2FA setup door een geldige TOTP-code in te voeren.
     * Na bevestiging wordt twoFactorEnabled = true gezet.
     */
    @PostMapping("/setup/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Bevestig 2FA setup", description = "Activeert 2FA na verificatie van de eerste TOTP-code.")
    public ResponseEntity<Map<String, Object>> confirmSetup(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {

        User user = resolveAdmin(userDetails);
        String code = body.get("code");

        if (user.getTwoFactorSecret() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Start eerst de 2FA setup via GET /api/v1/admin/2fa/setup"));
        }

        if (!totpService.verifyCode(user.getTwoFactorSecret(), code)) {
            log.warn("[2FA] Ongeldige bevestigingscode voor admin {}", user.getEmail());
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Ongeldige code. Controleer uw authenticator app en probeer opnieuw."));
        }

        // Genereer recovery codes
        List<String> recoveryCodes = generateRecoveryCodes();
        user.setTwoFactorRecoveryCodes(String.join(",", recoveryCodes));
        user.setTwoFactorEnabled(true);
        userRepository.save(user);

        log.info("[2FA] 2FA succesvol geactiveerd voor admin {}", user.getEmail());
        return ResponseEntity.ok(Map.of(
                "message", "Two-Factor Authentication is succesvol geactiveerd.",
                "recoveryCodes", recoveryCodes
        ));
    }

    /**
     * Verifieer een TOTP-code tijdens het inlogproces.
     * Wordt aangeroepen na succesvolle wachtwoord-verificatie.
     */
    @PostMapping("/verify")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Verifieer TOTP-code", description = "Verifieert de 6-cijferige TOTP-code tijdens het inloggen.")
    public ResponseEntity<Map<String, String>> verify(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {

        User user = resolveAdmin(userDetails);
        String code = body.get("code");

        if (!user.isTwoFactorEnabled() || user.getTwoFactorSecret() == null) {
            return ResponseEntity.ok(Map.of("message", "2FA is niet ingeschakeld voor dit account."));
        }

        if (!totpService.verifyCode(user.getTwoFactorSecret(), code)) {
            log.warn("[2FA] Ongeldige TOTP-code voor admin {}", user.getEmail());
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Ongeldige verificatiecode. Probeer opnieuw."));
        }

        log.info("[2FA] TOTP verificatie geslaagd voor admin {}", user.getEmail());
        return ResponseEntity.ok(Map.of("message", "Verificatie geslaagd."));
    }

    /**
     * Schakel 2FA uit voor de ingelogde admin (vereist geldige TOTP-code als bevestiging).
     */
    @PostMapping("/disable")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Schakel 2FA uit", description = "Deactiveert 2FA na verificatie van een geldige TOTP-code.")
    public ResponseEntity<Map<String, String>> disable(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {

        User user = resolveAdmin(userDetails);
        String code = body.get("code");

        if (!user.isTwoFactorEnabled()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "2FA is niet ingeschakeld voor dit account."));
        }

        if (!totpService.verifyCode(user.getTwoFactorSecret(), code)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Ongeldige code. 2FA is niet uitgeschakeld."));
        }

        user.setTwoFactorEnabled(false);
        user.setTwoFactorSecret(null);
        user.setTwoFactorRecoveryCodes(null);
        user.setTwoFactorFailedAttempts(0);
        user.setTwoFactorLockedUntil(null);
        userRepository.save(user);

        log.info("[2FA] 2FA uitgeschakeld voor admin {}", user.getEmail());
        return ResponseEntity.ok(Map.of("message", "Two-Factor Authentication is uitgeschakeld."));
    }

    /**
     * Geeft de huidige 2FA-status terug voor de ingelogde admin.
     */
    @GetMapping("/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "2FA status", description = "Geeft terug of 2FA ingeschakeld is voor de ingelogde admin.")
    public ResponseEntity<Map<String, Object>> status(@AuthenticationPrincipal UserDetails userDetails) {
        User user = resolveAdmin(userDetails);
        return ResponseEntity.ok(Map.of(
                "twoFactorEnabled", user.isTwoFactorEnabled(),
                "email", user.getEmail()
        ));
    }

    /**
     * Geeft de recovery codes terug voor de ingelogde admin (eenmalig tonen na setup).
     */
    @GetMapping("/recovery-codes")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Recovery codes ophalen", description = "Geeft de huidige recovery codes terug. Bewaar deze op een veilige plek.")
    public ResponseEntity<Map<String, Object>> getRecoveryCodes(@AuthenticationPrincipal UserDetails userDetails) {
        User user = resolveAdmin(userDetails);
        String stored = user.getTwoFactorRecoveryCodes();
        List<String> codes = (stored != null && !stored.isBlank())
                ? List.of(stored.split(","))
                : List.of();
        return ResponseEntity.ok(Map.of("recoveryCodes", codes));
    }

    private List<String> generateRecoveryCodes() {
        List<String> codes = new ArrayList<>();
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (int i = 0; i < RECOVERY_CODE_COUNT; i++) {
            StringBuilder sb = new StringBuilder("RECOVERY-");
            for (int j = 0; j < RECOVERY_CODE_LENGTH; j++) {
                sb.append(chars.charAt(secureRandom.nextInt(chars.length())));
            }
            codes.add(sb.toString());
        }
        return codes;
    }

    private User resolveAdmin(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Admin gebruiker niet gevonden"));
        if (user.getRole() != UserRole.ROLE_ADMIN) {
            throw new SecurityException("Alleen admins hebben toegang tot 2FA beheer");
        }
        return user;
    }
}
