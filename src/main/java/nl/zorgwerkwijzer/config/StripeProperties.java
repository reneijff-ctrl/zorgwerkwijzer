package nl.zorgwerkwijzer.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.stripe")
@Getter
@Setter
public class StripeProperties {

    /**
     * Stripe Secret Key — begint met sk_live_ of sk_test_.
     * Set via STRIPE_SECRET_KEY environment variable.
     */
    private String secretKey;

    /**
     * Stripe Webhook Signing Secret — begint met whsec_.
     * Set via STRIPE_WEBHOOK_SECRET environment variable.
     */
    private String webhookSecret;

    @PostConstruct
    public void validate() {
        // In lokale ontwikkelomgeving is de key optioneel.
        // In productie moet STRIPE_SECRET_KEY worden gezet.
        if (secretKey != null && !secretKey.isBlank()) {
            if (!secretKey.startsWith("sk_live_") && !secretKey.startsWith("sk_test_")) {
                throw new IllegalStateException(
                    "[STRIPE] app.stripe.secret-key heeft een ongeldig formaat. " +
                    "Verwacht: sk_live_... of sk_test_..."
                );
            }
        }
    }
}
