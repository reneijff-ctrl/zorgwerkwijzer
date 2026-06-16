package nl.zorgwerkwijzer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.subscription.ChangeSubscriptionRequest;
import nl.zorgwerkwijzer.dto.subscription.CheckoutRequest;
import nl.zorgwerkwijzer.dto.subscription.CheckoutResponse;
import nl.zorgwerkwijzer.dto.subscription.EmployerSubscriptionDto;
import nl.zorgwerkwijzer.dto.subscription.PortalRequest;
import nl.zorgwerkwijzer.dto.subscription.PortalResponse;
import nl.zorgwerkwijzer.dto.subscription.SubscriptionPackageDto;
import nl.zorgwerkwijzer.exception.ResourceNotFoundException;
import nl.zorgwerkwijzer.model.User;
import nl.zorgwerkwijzer.repository.UserRepository;
import nl.zorgwerkwijzer.service.StripeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/subscriptions")
@RequiredArgsConstructor
@Tag(name = "Subscriptions", description = "Abonnementsbeheer voor werkgevers")
@SecurityRequirement(name = "bearerAuth")
public class SubscriptionController {

    private final StripeService stripeService;
    private final UserRepository userRepository;

    // ─── Publiek: pakketten ophalen ───────────────────────────────────────────

    @GetMapping("/packages")
    @Operation(summary = "Beschikbare pakketten ophalen",
               description = "Retourneert alle actieve abonnementspakketten. Publiek toegankelijk.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Pakketten succesvol opgehaald")
    })
    public ResponseEntity<List<SubscriptionPackageDto>> getPackages() {
        return ResponseEntity.ok(stripeService.getActivePackages());
    }

    // ─── Huidig abonnement ────────────────────────────────────────────────────

    @GetMapping("/current")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Huidig abonnement ophalen",
               description = "Retourneert het huidige abonnement van de ingelogde werkgever.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Abonnement opgehaald (of null als geen abonnement)"),
        @ApiResponse(responseCode = "403", description = "Geen werkgever-rol")
    })
    public ResponseEntity<EmployerSubscriptionDto> getCurrentSubscription(
            @AuthenticationPrincipal UserDetails principal) {

        Long employerId = resolveEmployerId(principal.getUsername());
        return stripeService.getCurrentSubscription(employerId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    // ─── Checkout Session aanmaken ────────────────────────────────────────────

    @PostMapping("/checkout")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Stripe Checkout Session aanmaken",
               description = "Maakt een Stripe Checkout Session aan en retourneert de checkout URL. " +
                             "Redirect de browser naar deze URL om de betaling te starten.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Checkout URL aangemaakt"),
        @ApiResponse(responseCode = "400", description = "Ongeldige invoer of Stripe Price ID niet geconfigureerd"),
        @ApiResponse(responseCode = "403", description = "Geen werkgever-rol"),
        @ApiResponse(responseCode = "409", description = "Werkgever heeft al een actief abonnement")
    })
    public ResponseEntity<CheckoutResponse> createCheckout(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody CheckoutRequest request) {

        Long employerId = resolveEmployerId(principal.getUsername());
        String checkoutUrl = stripeService.createCheckoutSession(
                employerId,
                request.getPackageId(),
                request.getBillingInterval(),
                request.getSuccessUrl(),
                request.getCancelUrl()
        );
        return ResponseEntity.ok(new CheckoutResponse(checkoutUrl));
    }

    // ─── Customer Portal Session aanmaken ─────────────────────────────────────

    @PostMapping("/portal")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Stripe Customer Portal Session aanmaken",
               description = "Maakt een Stripe Customer Portal Session aan voor het beheren van het abonnement " +
                             "(upgraden, downgraden, annuleren, betalingsgegevens wijzigen).")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Portal URL aangemaakt"),
        @ApiResponse(responseCode = "400", description = "Geen actief abonnement gevonden"),
        @ApiResponse(responseCode = "403", description = "Geen werkgever-rol")
    })
    public ResponseEntity<PortalResponse> createPortalSession(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody PortalRequest request) {

        Long employerId = resolveEmployerId(principal.getUsername());
        String portalUrl = stripeService.createCustomerPortalSession(employerId, request.getReturnUrl());
        return ResponseEntity.ok(new PortalResponse(portalUrl));
    }

    // ─── Sync met Stripe ──────────────────────────────────────────────────────

    @PostMapping("/sync")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Abonnement synchroniseren met Stripe",
               description = "Haalt de actuele abonnementsstatus op uit Stripe en werkt de lokale database bij. " +
                             "Gebruik dit wanneer webhooks zijn gemist (bijv. tijdens downtime of lokale ontwikkeling).")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Abonnement gesynchroniseerd"),
        @ApiResponse(responseCode = "400", description = "Geen Stripe Subscription ID gevonden"),
        @ApiResponse(responseCode = "403", description = "Geen werkgever-rol"),
        @ApiResponse(responseCode = "404", description = "Geen abonnement gevonden")
    })
    public ResponseEntity<EmployerSubscriptionDto> syncSubscription(
            @AuthenticationPrincipal UserDetails principal) {

        Long employerId = resolveEmployerId(principal.getUsername());
        EmployerSubscriptionDto dto = stripeService.syncSubscriptionWithStripe(employerId);
        return ResponseEntity.ok(dto);
    }

    // ─── Upgrade / Downgrade abonnement ───────────────────────────────────────

    @PutMapping("/change")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Abonnement upgraden of downgraden",
               description = "Wijzigt het actieve abonnement naar een ander pakket via Stripe Subscription Update. " +
                             "Proratie wordt automatisch berekend door Stripe.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Abonnement gewijzigd"),
        @ApiResponse(responseCode = "400", description = "Abonnement niet actief of Stripe Price ID niet geconfigureerd"),
        @ApiResponse(responseCode = "403", description = "Geen werkgever-rol"),
        @ApiResponse(responseCode = "404", description = "Pakket niet gevonden")
    })
    public ResponseEntity<EmployerSubscriptionDto> changeSubscription(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody ChangeSubscriptionRequest request) {

        Long employerId = resolveEmployerId(principal.getUsername());
        EmployerSubscriptionDto dto = stripeService.changeSubscriptionPackage(
                employerId,
                request.getPackageId(),
                request.getBillingInterval()
        );
        return ResponseEntity.ok(dto);
    }

    // ─── Hulpmethode: employer ID opzoeken ────────────────────────────────────

    private Long resolveEmployerId(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Gebruiker niet gevonden: " + email));
        if (user.getEmployerId() == null) {
            throw new AccessDeniedException("Je account is niet gekoppeld aan een werkgever.");
        }
        return user.getEmployerId();
    }
}
