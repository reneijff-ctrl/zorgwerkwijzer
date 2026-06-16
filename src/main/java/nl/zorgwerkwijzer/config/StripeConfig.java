package nl.zorgwerkwijzer.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class StripeConfig {

    private final StripeProperties stripeProperties;
    private final Environment environment;

    /**
     * Initialiseert de Stripe SDK met de geconfigureerde secret key.
     *
     * Fix 4: Fail-fast in productie als STRIPE_SECRET_KEY ontbreekt.
     * In lokale/test omgeving wordt alleen een waarschuwing gelogd.
     */
    @PostConstruct
    public void initStripe() {
        String key = stripeProperties.getSecretKey();

        if (key == null || key.isBlank()) {
            boolean isProduction = Arrays.stream(environment.getActiveProfiles())
                    .anyMatch(profile -> profile.equalsIgnoreCase("prod")
                                     || profile.equalsIgnoreCase("production"));

            if (isProduction) {
                // Fix 4: Productie vereist een geldige Stripe key — applicatie weigert op te starten
                throw new IllegalStateException(
                    "[STRIPE] STRIPE_SECRET_KEY is verplicht in de productie-omgeving. " +
                    "Stel de STRIPE_SECRET_KEY environment variable in met een sk_live_... waarde."
                );
            } else {
                log.warn("[STRIPE] STRIPE_SECRET_KEY is niet geconfigureerd — Stripe functionaliteit is uitgeschakeld in deze omgeving");
            }
            return;
        }

        Stripe.apiKey = key;
        log.info("[STRIPE] Stripe SDK geïnitialiseerd ({})",
            key.startsWith("sk_live_") ? "PRODUCTIE" : "TEST");
    }
}
