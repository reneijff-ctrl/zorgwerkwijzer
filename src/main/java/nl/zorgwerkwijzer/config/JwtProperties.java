package nl.zorgwerkwijzer.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import java.util.Base64;

@Configuration
@ConfigurationProperties(prefix = "app.jwt")
@Validated
@Getter
@Setter
public class JwtProperties {

    /**
     * Base64-encoded secret, minimum 256 bits (32 bytes = 44 Base64 chars).
     * Generate with: openssl rand -base64 64
     */
    private String secret;

    /** Access token lifetime in milliseconds (default: 15 minutes). */
    private long expiration = 900_000L;

    /** Refresh token lifetime in milliseconds (default: 7 days). */
    private long refreshExpiration = 604_800_000L;

    /** Token issuer claim. */
    private String issuer = "zorgwerkwijzer.nl";

    @PostConstruct
    public void validateSecret() {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException(
                "[SECURITY] app.jwt.secret is not configured. " +
                "Set the JWT_SECRET environment variable. " +
                "Generate a strong secret with: openssl rand -base64 64"
            );
        }

        byte[] decoded;
        try {
            decoded = Base64.getDecoder().decode(secret.trim());
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException(
                "[SECURITY] app.jwt.secret is not valid Base64. " +
                "Generate a strong secret with: openssl rand -base64 64"
            );
        }

        if (decoded.length < 32) {
            throw new IllegalStateException(
                "[SECURITY] app.jwt.secret is too weak: " + (decoded.length * 8) + " bits provided, " +
                "minimum 256 bits (32 bytes) required. " +
                "Generate a strong secret with: openssl rand -base64 64"
            );
        }
    }
}
