package nl.zorgwerkwijzer.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuratie-properties voor de Resend e-mail API.
 *
 * <p>Vereiste environment variables:
 * <ul>
 *   <li>RESEND_API_KEY — Resend API-sleutel (re_...)</li>
 *   <li>MAIL_FROM      — Afzenderadres (default: noreply@zorgwerkwijzer.nl)</li>
 *   <li>MAIL_ADMIN     — Admin-adres (default: admin@zorgwerkwijzer.nl)</li>
 * </ul>
 * </p>
 */
@Component
@ConfigurationProperties(prefix = "resend")
@Getter
@Setter
@Slf4j
public class ResendProperties {

    /** Resend API-sleutel — stel in via RESEND_API_KEY environment variable. */
    private String apiKey = "";

    @PostConstruct
    public void validate() {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("⚠️  RESEND_API_KEY is niet ingesteld — e-mailnotificaties zijn UITGESCHAKELD.");
            log.warn("   Stel de environment variable RESEND_API_KEY in om e-mail in te schakelen.");
        } else {
            log.info("✅ Resend e-mail geconfigureerd — API-sleutel aanwezig.");
        }
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }
}
