package nl.zorgwerkwijzer.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "app.cors")
@Validated
@Getter
@Setter
public class CorsProperties {

    /**
     * Explicit list of allowed origins.
     * No wildcard fallback — application refuses to start if empty in production.
     */
    private List<String> allowedOrigins;

    private boolean allowCredentials = false;

    @PostConstruct
    public void validate() {
        if (allowedOrigins == null || allowedOrigins.isEmpty()) {
            throw new IllegalStateException(
                "[SECURITY] app.cors.allowed-origins is not configured. " +
                "Set the CORS_ALLOWED_ORIGINS environment variable, e.g.: " +
                "https://zorgwerkwijzer.nl,https://www.zorgwerkwijzer.nl"
            );
        }

        for (String origin : allowedOrigins) {
            if ("*".equals(origin.trim())) {
                throw new IllegalStateException(
                    "[SECURITY] Wildcard '*' is not allowed in app.cors.allowed-origins. " +
                    "Specify explicit origins such as: https://zorgwerkwijzer.nl"
                );
            }
        }
    }
}
