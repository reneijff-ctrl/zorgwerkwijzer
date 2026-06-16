package nl.zorgwerkwijzer.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuratie voor de frontend URL — gebruikt voor URL-whitelist validatie
 * bij Stripe Checkout en Customer Portal redirects.
 *
 * Instelling via application.yaml:
 *   app.frontend.url: https://zorgwerkwijzer.nl
 */
@Configuration
@ConfigurationProperties(prefix = "app.frontend")
@Getter
@Setter
public class FrontendProperties {

    /**
     * Basis-URL van de frontend applicatie.
     * Voorbeeld: https://zorgwerkwijzer.nl
     * Set via APP_FRONTEND_URL environment variable of application.yaml.
     */
    private String url = "https://zorgwerkwijzer.nl";

    @PostConstruct
    public void validate() {
        if (url == null || url.isBlank()) {
            throw new IllegalStateException(
                "[FRONTEND] app.frontend.url is niet geconfigureerd. " +
                "Stel de waarde in via application.yaml of de APP_FRONTEND_URL environment variable."
            );
        }
        if (!url.startsWith("https://") && !url.startsWith("http://localhost")) {
            throw new IllegalStateException(
                "[FRONTEND] app.frontend.url moet beginnen met https:// (of http://localhost voor lokale ontwikkeling). " +
                "Huidige waarde: " + url
            );
        }
    }
}
