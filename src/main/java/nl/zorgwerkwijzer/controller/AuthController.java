package nl.zorgwerkwijzer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.config.FrontendProperties;
import nl.zorgwerkwijzer.dto.AuthResponse;
import nl.zorgwerkwijzer.dto.EmployerRegistrationRequest;
import nl.zorgwerkwijzer.dto.ForgotPasswordRequest;
import nl.zorgwerkwijzer.dto.LoginRequest;
import nl.zorgwerkwijzer.dto.RegisterRequest;
import nl.zorgwerkwijzer.dto.ResetPasswordRequest;
import nl.zorgwerkwijzer.dto.TwoFactorLoginRequest;
import nl.zorgwerkwijzer.dto.UserDto;
import nl.zorgwerkwijzer.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Registration and login endpoints")
public class AuthController {

    private final AuthService        authService;
    private final FrontendProperties frontendProperties;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
        summary = "Register a new user",
        description = "Creates a new account. Role is always set to ROLE_USER by the server regardless of input."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "User registered successfully"),
        @ApiResponse(responseCode = "400", description = "Validation failed"),
        @ApiResponse(responseCode = "409", description = "Email already registered")
    })
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/register-employer")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
        summary = "Register a new employer",
        description = "Creates a new employer account with ROLE_EMPLOYER. Automatically creates Employer and User records and returns a JWT token."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Employer registered successfully"),
        @ApiResponse(responseCode = "400", description = "Validation failed"),
        @ApiResponse(responseCode = "409", description = "Email already registered")
    })
    public ResponseEntity<AuthResponse> registerEmployer(@Valid @RequestBody EmployerRegistrationRequest request) {
        AuthResponse response = authService.registerEmployer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticates user and returns a JWT access token")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "400", description = "Validation failed"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    @Operation(
        summary = "Request a password-reset email",
        description = "Sends a password-reset link to the given email address. " +
                      "Always returns HTTP 200 to prevent email-address enumeration."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Request accepted (email sent if address is registered)"),
        @ApiResponse(responseCode = "400", description = "Validation failed — invalid email format")
    })
    public ResponseEntity<Map<String, String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request,
            HttpServletRequest httpRequest) {
        String frontendUrl = determineFrontendUrl(httpRequest);
        authService.forgotPassword(request, frontendUrl);
        return ResponseEntity.ok(Map.of("message",
                "Als uw e-mailadres bij ons bekend is, ontvangt u een resetlink."));
    }

    @PostMapping("/reset-password")
    @Operation(
        summary = "Reset password using a valid token",
        description = "Validates the token and updates the password. Token is single-use and valid for 1 hour."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Password updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid, expired or already-used token"),
        @ApiResponse(responseCode = "422", description = "Password does not meet requirements")
    })
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Uw wachtwoord is succesvol gewijzigd. U kunt nu inloggen."));
    }

    @GetMapping("/verify-email")
    @Operation(summary = "Verifieer e-mailadres", description = "Activeert het account via het verificatietoken uit de e-mail.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "E-mailadres geverifieerd"),
        @ApiResponse(responseCode = "400", description = "Ongeldig of verlopen token")
    })
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(Map.of("message", "Uw e-mailadres is bevestigd. U kunt nu inloggen."));
    }

    @PostMapping("/resend-verification")
    @Operation(summary = "Verificatiemail opnieuw versturen", description = "Verstuurt een nieuwe verificatiemail naar het opgegeven e-mailadres.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Verificatiemail verstuurd"),
        @ApiResponse(responseCode = "400", description = "E-mailadres al geverifieerd of niet gevonden")
    })
    public ResponseEntity<Map<String, String>> resendVerification(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        authService.resendVerificationEmail(email);
        return ResponseEntity.ok(Map.of("message", "Verificatiemail opnieuw verstuurd."));
    }

    @GetMapping("/me")
    @Operation(summary = "Haal actuele gebruikersinfo op", description = "Retourneert de actuele user-state inclusief twoFactorEnabled. Vereist een geldig JWT-token.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Gebruikersinfo opgehaald"),
        @ApiResponse(responseCode = "401", description = "Niet geauthenticeerd")
    })
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        UserDto dto = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/2fa/verify-login")
    @Operation(
        summary = "Voltooi admin 2FA login",
        description = "Tweede stap van de admin login-flow. Valideert het tempToken en de TOTP-code en geeft een volledige JWT terug."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "2FA verificatie geslaagd, JWT teruggegeven"),
        @ApiResponse(responseCode = "400", description = "Ongeldige of verlopen code"),
        @ApiResponse(responseCode = "401", description = "Onjuiste TOTP-code")
    })
    public ResponseEntity<AuthResponse> verifyTwoFactorLogin(@Valid @RequestBody TwoFactorLoginRequest request) {
        AuthResponse response = authService.verifyTwoFactorLogin(request.getTempToken(), request.getCode());
        return ResponseEntity.ok(response);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Helper
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Determines the frontend base URL.
     * Falls back to the configured value from FrontendProperties so the email
     * link always points to the correct environment.
     */
    private String determineFrontendUrl(HttpServletRequest request) {
        return frontendProperties.getUrl();
    }
}
