package nl.zorgwerkwijzer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.service.StripeWebhookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

/**
 * Controller voor inkomende Stripe webhook events.
 *
 * Beveiligingsprincipes:
 * - Geen JWT authenticatie — dit endpoint staat open (permitAll in SecurityConfig)
 * - Eigen beveiliging via Stripe-Signature header verificatie in StripeWebhookService
 * - Raw request body wordt gelezen via HttpServletRequest.getInputStream() voor signature-verificatie
 *   (NIET via @RequestBody — dat zou de body herformatteren en de signature invalideren)
 * - Idempotency via stripe_webhook_events tabel + UNIQUE constraint
 */
@RestController
@RequestMapping("/api/v1/stripe")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Stripe Webhooks", description = "Interne endpoint voor Stripe webhook event verwerking")
public class StripeWebhookController {

    private static final String STRIPE_SIGNATURE_HEADER = "Stripe-Signature";

    private final StripeWebhookService stripeWebhookService;

    /**
     * Ontvangt en verwerkt Stripe webhook events.
     *
     * Het raw request body wordt direct gelezen (NIET via @RequestBody) om de
     * Stripe webhook signature te kunnen verifiëren. Elke re-serialisatie
     * zou de HMAC-SHA256 signature invalideren.
     *
     * HTTP responses:
     * - 200: Event ontvangen en verwerkt (of al eerder verwerkt — idempotent)
     * - 400: Ongeldige Stripe signature
     * - 500: Onverwachte serverfout
     */
    @PostMapping("/webhook")
    @Operation(
        summary = "Stripe webhook endpoint",
        description = "Ontvangt Stripe webhook events. Beveiligd via Stripe-Signature header verificatie."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Event verwerkt"),
        @ApiResponse(responseCode = "400", description = "Ongeldige Stripe signature")
    })
    public ResponseEntity<Map<String, String>> handleWebhook(HttpServletRequest request) {
        // Lees raw bytes — NIET via @RequestBody (signature-verificatie vereist exact de originele bytes)
        byte[] rawPayload;
        try {
            rawPayload = request.getInputStream().readAllBytes();
        } catch (IOException e) {
            log.error("[STRIPE] Fout bij lezen van webhook request body: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Kan request body niet lezen"));
        }

        String sigHeader = request.getHeader(STRIPE_SIGNATURE_HEADER);

        // Verwerk het event — signature-verificatie en event-routing in de service
        stripeWebhookService.handleEvent(rawPayload, sigHeader);

        return ResponseEntity.ok(Map.of("received", "true"));
    }
}
