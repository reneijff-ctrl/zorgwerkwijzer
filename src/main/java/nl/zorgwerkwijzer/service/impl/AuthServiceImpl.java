package nl.zorgwerkwijzer.service.impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.config.FrontendProperties;
import nl.zorgwerkwijzer.config.JwtProperties;
import nl.zorgwerkwijzer.dto.AuthResponse;
import nl.zorgwerkwijzer.dto.EmployerRegistrationRequest;
import nl.zorgwerkwijzer.dto.ForgotPasswordRequest;
import nl.zorgwerkwijzer.dto.LoginRequest;
import nl.zorgwerkwijzer.dto.RegisterRequest;
import nl.zorgwerkwijzer.dto.ResetPasswordRequest;
import nl.zorgwerkwijzer.dto.UserDto;
import nl.zorgwerkwijzer.exception.ResourceNotFoundException;
import nl.zorgwerkwijzer.model.AuditAction;
import nl.zorgwerkwijzer.model.Employer;
import nl.zorgwerkwijzer.model.PasswordResetToken;
import nl.zorgwerkwijzer.model.Profile;
import nl.zorgwerkwijzer.model.User;
import nl.zorgwerkwijzer.model.UserRole;
import nl.zorgwerkwijzer.repository.EmployerRepository;
import nl.zorgwerkwijzer.repository.PasswordResetTokenRepository;
import nl.zorgwerkwijzer.repository.ProfileRepository;
import nl.zorgwerkwijzer.repository.UserRepository;
import nl.zorgwerkwijzer.security.JwtTokenProvider;
import nl.zorgwerkwijzer.service.AdminAuditLogService;
import nl.zorgwerkwijzer.service.AuditService;
import nl.zorgwerkwijzer.service.AuthService;
import nl.zorgwerkwijzer.service.EmailService;
import nl.zorgwerkwijzer.service.TempTokenService;
import nl.zorgwerkwijzer.service.TotpService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.security.SecureRandom;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final int TOKEN_EXPIRY_HOURS = 1;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtProperties jwtProperties;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final FrontendProperties frontendProperties;
    private final AuthenticationManager authenticationManager;
    private final EmployerRepository employerRepository;
    private final ProfileRepository profileRepository;
    private final AuditService auditService;
    private final AdminAuditLogService adminAuditLogService;
    private final TotpService totpService;
    private final TempTokenService tempTokenService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email address is already registered: " + request.getEmail());
        }

        String verificationToken = generateSecureToken();

        // C1: Role is ALWAYS forced to ROLE_USER — never taken from request
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.ROLE_USER)
                .emailVerified(false)
                .verificationToken(verificationToken)
                .verificationTokenExpiry(LocalDateTime.now().plusHours(24))
                .build();

        User savedUser = userRepository.save(user);

        // Automatically create a linked Profile so the user can apply to vacancies immediately
        Profile profile = new Profile();
        profile.setEmail(savedUser.getEmail());
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setPhoneNumber(request.getPhoneNumber());
        profile.setIsSearching(Boolean.TRUE);
        profileRepository.save(profile);

        auditService.logRegister(savedUser.getEmail(), "ROLE_USER", resolveClientIp());

        // Stuur verificatiemail — geen JWT teruggeven tot e-mail bevestigd is
        emailService.sendEmailVerificationEmail(savedUser.getEmail(), verificationToken,
                frontendProperties.getUrl());

        return AuthResponse.builder()
                .accessToken(null)
                .tokenType("Bearer")
                .expiresIn(0L)
                .user(toUserDto(savedUser))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException | DisabledException ex) {
            auditService.logLoginFailed(request.getEmail(), resolveClientIp(), ex.getClass().getSimpleName());
            throw ex;
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Blokkeer login voor niet-geverifieerde gebruikers (kandidaten én werkgevers)
        if ((user.getRole() == UserRole.ROLE_USER || user.getRole() == UserRole.ROLE_EMPLOYER)
                && !user.isEmailVerified()) {
            throw new DisabledException("E-mailadres nog niet geverifieerd. Controleer uw inbox.");
        }

        // Admin 2FA enforcement: geen JWT uitgeven, retourneer tempToken
        if (user.getRole() == UserRole.ROLE_ADMIN && user.isTwoFactorEnabled()) {
            String tempToken = tempTokenService.generateTempToken(user.getId());
            log.info("[2FA] Admin {} vereist TOTP verificatie", user.getEmail());
            return AuthResponse.builder()
                    .requiresTwoFactor(true)
                    .tempToken(tempToken)
                    .tokenType("Bearer")
                    .expiresIn(0L)
                    .build();
        }

        String token = jwtTokenProvider.generateToken(authentication);

        auditService.logLoginSuccess(user.getEmail(), resolveClientIp());

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(jwtProperties.getExpiration())
                .user(toUserDto(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse verifyTwoFactorLogin(String tempToken, String totpCode) {
        // 1. Valideer tempToken
        Long userId = tempTokenService.validateTempToken(tempToken);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 2. Controleer lockout
        if (user.getTwoFactorLockedUntil() != null
                && user.getTwoFactorLockedUntil().isAfter(LocalDateTime.now())) {
            throw new DisabledException("Account tijdelijk geblokkeerd vanwege te veel mislukte 2FA-pogingen. Probeer het later opnieuw.");
        }

        // 3. Controleer recovery code
        boolean usedRecovery = false;
        if (totpCode != null && totpCode.startsWith("RECOVERY-")) {
            usedRecovery = validateAndConsumeRecoveryCode(user, totpCode);
            if (!usedRecovery) {
                registerTwoFactorFailure(user);
                throw new BadCredentialsException("Ongeldige recovery code.");
            }
        } else {
            // 4. Valideer TOTP code
            if (!totpService.verifyCode(user.getTwoFactorSecret(), totpCode)) {
                registerTwoFactorFailure(user);
                throw new BadCredentialsException("Ongeldige 2FA-code. Probeer opnieuw.");
            }
        }

        // 5. Reset pogingen bij succes
        user.setTwoFactorFailedAttempts(0);
        user.setTwoFactorLockedUntil(null);
        userRepository.save(user);

        // 6. Invalideer tempToken (single-use)
        tempTokenService.invalidateTempToken(tempToken);

        // 7. Genereer volledige JWT
        org.springframework.security.core.userdetails.UserDetails userDetails =
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        user.getPassword(),
                        List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(user.getRole().name()))
                );
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        String jwt = jwtTokenProvider.generateToken(auth);

        auditService.logLoginSuccess(user.getEmail(), resolveClientIp());
        log.info("[2FA] Admin {} succesvol ingelogd via TOTP{}", user.getEmail(), usedRecovery ? " (recovery code)" : "");

        return AuthResponse.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .expiresIn(jwtProperties.getExpiration())
                .user(toUserDto(user))
                .build();
    }

    private void registerTwoFactorFailure(User user) {
        int attempts = user.getTwoFactorFailedAttempts() + 1;
        user.setTwoFactorFailedAttempts(attempts);
        if (attempts >= 5) {
            user.setTwoFactorLockedUntil(LocalDateTime.now().plusMinutes(15));
            log.warn("[2FA] Admin {} geblokkeerd na {} mislukte pogingen", user.getEmail(), attempts);
        }
        userRepository.save(user);
    }

    private boolean validateAndConsumeRecoveryCode(User user, String inputCode) {
        String stored = user.getTwoFactorRecoveryCodes();
        if (stored == null || stored.isBlank()) return false;
        List<String> codes = new ArrayList<>(List.of(stored.split(",")));
        boolean found = codes.remove(inputCode.trim());
        if (found) {
            user.setTwoFactorRecoveryCodes(String.join(",", codes));
            userRepository.save(user);
        }
        return found;
    }

    @Override
    @Transactional
    public AuthResponse registerEmployer(EmployerRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email address is already registered: " + request.getEmail());
        }
        if (employerRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email address is already registered: " + request.getEmail());
        }

        String verificationToken = generateSecureToken();

        // Create Employer record
        Employer employer = new Employer();
        employer.setName(request.getCompanyName());
        employer.setEmail(request.getEmail());
        employer.setPhoneNumber(request.getPhoneNumber());
        employer.setWebsiteUrl(request.getWebsite());
        employer.setIsPremium(Boolean.FALSE);
        employer.setKvkNumber(request.getKvkNumber());
        employer.setSlug(generateUniqueSlug(request.getCompanyName()));
        Employer savedEmployer = employerRepository.save(employer);

        // Create User record with ROLE_EMPLOYER
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.ROLE_EMPLOYER)
                .employerId(savedEmployer.getId())
                .emailVerified(false)
                .verificationToken(verificationToken)
                .verificationTokenExpiry(LocalDateTime.now().plusHours(24))
                .build();
        User savedUser = userRepository.save(user);

        auditService.logRegister(savedUser.getEmail(), "ROLE_EMPLOYER", resolveClientIp());

        // Stuur verificatiemail — geen JWT teruggeven tot e-mail bevestigd is
        emailService.sendEmailVerificationEmail(savedUser.getEmail(), verificationToken,
                frontendProperties.getUrl());

        return AuthResponse.builder()
                .accessToken(null)
                .tokenType("Bearer")
                .expiresIn(0L)
                .user(toUserDto(savedUser))
                .build();
    }

    private String generateUniqueSlug(String companyName) {
        String base = Normalizer.normalize(companyName, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        String slug = base;
        int counter = 1;
        while (employerRepository.existsBySlug(slug)) {
            slug = base + "-" + counter++;
        }
        return slug;
    }

    @Override
    @Transactional
    public UserDto updateRole(Long userId, UserRole newRole) {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Ingelogde gebruiker niet gevonden"));
        if (currentUser.getId().equals(userId)) {
            throw new IllegalArgumentException("Je kunt je eigen rol niet wijzigen");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        String oldRole = user.getRole().name();
        user.setRole(newRole);
        User updatedUser = userRepository.save(user);
        adminAuditLogService.logAction(
                currentUser.getId(),
                currentEmail,
                AuditAction.USER_ROLE_CHANGED,
                "USER",
                userId,
                user.getEmail(),
                oldRole,
                newRole.name()
        );
        return toUserDto(updatedUser);
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request, String frontendUrl) {
        // Altijd succesvol antwoorden — e-mail-adressen niet lekken
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            String rawToken = generateSecureToken();
            PasswordResetToken token = PasswordResetToken.builder()
                    .email(request.getEmail())
                    .token(rawToken)
                    .expiresAt(LocalDateTime.now().plusHours(TOKEN_EXPIRY_HOURS))
                    .used(false)
                    .build();
            passwordResetTokenRepository.save(token);
            emailService.sendPasswordResetEmail(request.getEmail(), rawToken, frontendUrl);
        });
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Ongeldig of verlopen reset-token"));

        if (resetToken.isUsed()) {
            throw new IllegalArgumentException("Dit reset-token is al gebruikt");
        }
        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Dit reset-token is verlopen. Vraag een nieuw token aan.");
        }

        User user = userRepository.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Gebruiker niet gevonden"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.markUsed();
        passwordResetTokenRepository.save(resetToken);
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Ongeldig verificatietoken"));

        if (user.getVerificationTokenExpiry() == null ||
                user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Verificatietoken is verlopen. Vraag een nieuwe verificatiemail aan.");
        }

        if (user.isEmailVerified()) {
            return; // Al geverifieerd — idempotent
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Gebruiker niet gevonden"));

        if (user.isEmailVerified()) {
            throw new IllegalArgumentException("E-mailadres is al geverifieerd");
        }

        String newToken = generateSecureToken();
        user.setVerificationToken(newToken);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        emailService.sendEmailVerificationEmail(email, newToken, frontendProperties.getUrl());
    }

    private String generateSecureToken() {
        byte[] randomBytes = new byte[48];
        new SecureRandom().nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    private String resolveClientIp() {
        try {
            ServletRequestAttributes attrs =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs == null) return "unknown";
            HttpServletRequest req = attrs.getRequest();
            String forwarded = req.getHeader("X-Forwarded-For");
            if (forwarded != null && !forwarded.isBlank()) {
                return forwarded.split(",")[0].trim();
            }
            String realIp = req.getHeader("X-Real-IP");
            return (realIp != null && !realIp.isBlank()) ? realIp.trim() : req.getRemoteAddr();
        } catch (Exception e) {
            return "unknown";
        }
    }

    @Override
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Gebruiker niet gevonden"));
        return toUserDto(user);
    }

    private UserDto toUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .employerId(user.getEmployerId())
                .createdAt(user.getCreatedAt())
                .twoFactorEnabled(user.isTwoFactorEnabled())
                .build();
    }
}
