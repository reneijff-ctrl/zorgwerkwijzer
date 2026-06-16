package nl.zorgwerkwijzer.service;

/**
 * Service voor het verwerken van inkomende Stripe webhook events.
 * Verantwoordelijk voor idempotency, event-routing en status-updates.
 */
public interface StripeWebhookService {

    /**
     * Verwerkt een inkomend Stripe webhook event.
     * Voert signature-verificatie, idempotency-check en event-routing uit.
     *
     * @param rawPayload  raw request body als byte-array (vereist voor signature-verificatie)
     * @param sigHeader   waarde van de Stripe-Signature header
     */
    void handleEvent(byte[] rawPayload, String sigHeader);
}
