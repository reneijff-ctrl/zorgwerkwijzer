package nl.zorgwerkwijzer.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * Startup validator voor de Resend e-mail configuratie.
 *
 * <p>Logt een duidelijke waarschuwing wanneer RESEND_API_KEY ontbreekt.
 * De applicatie start normaal door — een ontbrekende mailconfiguratie
 * blokkeert het platform nooit.</p>
 *
 * <p>Vereiste environment variable voor productie:
 * <ul>
 *   <li>RESEND_API_KEY — Resend API-sleutel (re_...)</li>
 *   <li>MAIL_FROM      — Afzenderadres (default: noreply@zorgwerkwijzer.nl)</li>
 *   <li>MAIL_ADMIN     — Admin-adres (default: admin@zorgwerkwijzer.nl)</li>
 * </ul>
 * </p>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class MailConfigValidator {

    private final ResendProperties resendProperties;

    public boolean isConfigured() {
        return resendProperties.isConfigured();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void validate() {
        if (resendProperties.isConfigured()) {
            log.info("✅ Resend e-mail geconfigureerd en klaar voor gebruik.");
        } else {
            log.warn("⚠️  RESEND_API_KEY is niet ingesteld — e-mailnotificaties zijn UITGESCHAKELD.");
            log.warn("   Stel de volgende environment variable in om e-mail in te schakelen:");
            log.warn("   RESEND_API_KEY = <api-sleutel>   (te vinden op https://resend.com/api-keys)");
            log.warn("   De applicatie blijft normaal draaien. Status-updates worden opgeslagen maar er worden GEEN mails verstuurd.");
        }
    }
}
