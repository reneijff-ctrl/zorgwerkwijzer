package nl.zorgwerkwijzer.security;

import nl.zorgwerkwijzer.config.JwtProperties;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThatNoException;

/**
 * C3: JWT Secret Validation Tests
 *
 * Verifies that:
 * 1. Application refuses to start with a null or blank secret
 * 2. Application refuses to start with a secret shorter than 256 bits
 * 3. Application refuses to start with an invalid Base64 value
 * 4. Application starts correctly with a valid 512-bit secret
 */
@DisplayName("C3 - JWT Secret Validation Tests")
class JwtPropertiesTest {

    private JwtProperties buildProperties(String secret) {
        JwtProperties props = new JwtProperties();
        props.setSecret(secret);
        return props;
    }

    @Test
    @DisplayName("Null secret causes IllegalStateException at startup")
    void validateSecret_NullSecret_ThrowsIllegalStateException() {
        JwtProperties props = buildProperties(null);

        assertThatThrownBy(props::validateSecret)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("app.jwt.secret is not configured");
    }

    @Test
    @DisplayName("Blank secret causes IllegalStateException at startup")
    void validateSecret_BlankSecret_ThrowsIllegalStateException() {
        JwtProperties props = buildProperties("   ");

        assertThatThrownBy(props::validateSecret)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("app.jwt.secret is not configured");
    }

    @Test
    @DisplayName("Invalid Base64 secret causes IllegalStateException at startup")
    void validateSecret_InvalidBase64_ThrowsIllegalStateException() {
        JwtProperties props = buildProperties("not-valid-base64!!!");

        assertThatThrownBy(props::validateSecret)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("not valid Base64");
    }

    @Test
    @DisplayName("Secret with fewer than 256 bits causes IllegalStateException at startup")
    void validateSecret_TooShortSecret_ThrowsIllegalStateException() {
        // 16 bytes = 128 bits — too weak
        String weakSecret = java.util.Base64.getEncoder().encodeToString(new byte[16]);
        JwtProperties props = buildProperties(weakSecret);

        assertThatThrownBy(props::validateSecret)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("too weak")
                .hasMessageContaining("128 bits")
                .hasMessageContaining("256 bits");
    }

    @Test
    @DisplayName("Secret with exactly 256 bits is accepted")
    void validateSecret_Exactly256Bits_Succeeds() {
        // 32 bytes = 256 bits — minimum acceptable
        String validSecret = java.util.Base64.getEncoder().encodeToString(new byte[32]);
        JwtProperties props = buildProperties(validSecret);

        assertThatNoException().isThrownBy(props::validateSecret);
    }

    @Test
    @DisplayName("Secret with 512 bits (production-strength) is accepted")
    void validateSecret_512Bits_Succeeds() {
        // 64 bytes = 512 bits — production-strength
        String strongSecret = java.util.Base64.getEncoder().encodeToString(new byte[64]);
        JwtProperties props = buildProperties(strongSecret);

        assertThatNoException().isThrownBy(props::validateSecret);
    }

    @Test
    @DisplayName("Local test secret from application-local.yaml is accepted")
    void validateSecret_LocalTestSecret_Succeeds() {
        String localSecret = "dGVzdFNlY3JldEZvckxvY2FsRGV2ZWxvcG1lbnRPbmx5Tm90Rm9yUHJvZHVjdGlvblVzZU9ubHlUZXN0aW5nUHVycG9zZXM=";
        JwtProperties props = buildProperties(localSecret);

        assertThatNoException().isThrownBy(props::validateSecret);
    }
}
