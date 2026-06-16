package nl.zorgwerkwijzer.security;

import nl.zorgwerkwijzer.config.CorsProperties;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThatNoException;

/**
 * C2: CORS Hardening Tests
 *
 * Verifies that:
 * 1. Application refuses to start with empty allowed origins
 * 2. Application refuses to start with wildcard '*' as an origin
 * 3. Application starts correctly with explicit origins
 */
@DisplayName("C2 - CORS Hardening Security Tests")
class CorsPropertiesTest {

    private CorsProperties buildProperties(List<String> origins) {
        CorsProperties props = new CorsProperties();
        props.setAllowedOrigins(origins);
        return props;
    }

    @Test
    @DisplayName("Null allowed origins causes IllegalStateException at startup")
    void validate_NullOrigins_ThrowsIllegalStateException() {
        CorsProperties props = buildProperties(null);

        assertThatThrownBy(props::validate)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("app.cors.allowed-origins is not configured");
    }

    @Test
    @DisplayName("Empty allowed origins list causes IllegalStateException at startup")
    void validate_EmptyOrigins_ThrowsIllegalStateException() {
        CorsProperties props = buildProperties(Collections.emptyList());

        assertThatThrownBy(props::validate)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("app.cors.allowed-origins is not configured");
    }

    @Test
    @DisplayName("Wildcard '*' as origin causes IllegalStateException at startup")
    void validate_WildcardOrigin_ThrowsIllegalStateException() {
        CorsProperties props = buildProperties(List.of("*"));

        assertThatThrownBy(props::validate)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Wildcard '*' is not allowed");
    }

    @Test
    @DisplayName("Wildcard mixed with valid origins causes IllegalStateException at startup")
    void validate_WildcardMixedWithValidOrigins_ThrowsIllegalStateException() {
        CorsProperties props = buildProperties(List.of("https://zorgwerkwijzer.nl", "*"));

        assertThatThrownBy(props::validate)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Wildcard '*' is not allowed");
    }

    @Test
    @DisplayName("Production origins are accepted")
    void validate_ProductionOrigins_Succeeds() {
        CorsProperties props = buildProperties(List.of(
                "https://zorgwerkwijzer.nl",
                "https://www.zorgwerkwijzer.nl"
        ));

        assertThatNoException().isThrownBy(props::validate);
    }

    @Test
    @DisplayName("Local development origin is accepted")
    void validate_LocalhostOrigin_Succeeds() {
        CorsProperties props = buildProperties(List.of("http://localhost:3000"));

        assertThatNoException().isThrownBy(props::validate);
    }

    @Test
    @DisplayName("Single explicit production origin is accepted")
    void validate_SingleExplicitOrigin_Succeeds() {
        CorsProperties props = buildProperties(List.of("https://zorgwerkwijzer.nl"));

        assertThatNoException().isThrownBy(props::validate);
    }
}
