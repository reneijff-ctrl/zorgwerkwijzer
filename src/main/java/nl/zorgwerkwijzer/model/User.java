package nl.zorgwerkwijzer.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private UserRole role;

    @Column(name = "employer_id")
    private Long employerId;

    @Column(name = "failed_login_attempts", nullable = false)
    @Builder.Default
    private int failedLoginAttempts = 0;

    @Column(name = "locked_until")
    private java.time.LocalDateTime lockedUntil;

    @Column(name = "email_verified", nullable = false)
    @Builder.Default
    private boolean emailVerified = false;

    @Column(name = "verification_token", length = 255)
    private String verificationToken;

    @Column(name = "verification_token_expiry")
    private java.time.LocalDateTime verificationTokenExpiry;

    // ─── Admin Two-Factor Authentication (TOTP) ───────────────────────────────

    @Column(name = "two_factor_enabled", nullable = false)
    @Builder.Default
    private boolean twoFactorEnabled = false;

    @Column(name = "two_factor_secret", length = 64)
    private String twoFactorSecret;

    @Column(name = "two_factor_failed_attempts", nullable = false)
    @Builder.Default
    private int twoFactorFailedAttempts = 0;

    @Column(name = "two_factor_locked_until")
    private java.time.LocalDateTime twoFactorLockedUntil;

    @Column(name = "two_factor_recovery_codes", length = 1024)
    private String twoFactorRecoveryCodes;
}
