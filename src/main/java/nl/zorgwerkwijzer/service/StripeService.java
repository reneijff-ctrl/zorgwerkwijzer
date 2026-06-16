package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.subscription.EmployerSubscriptionDto;
import nl.zorgwerkwijzer.dto.subscription.SubscriptionPackageDto;

import java.util.List;
import java.util.Optional;

public interface StripeService {

    /**
     * Retourneert alle actieve abonnementspakketten.
     */
    List<SubscriptionPackageDto> getActivePackages();

    /**
     * Retourneert het huidige actieve abonnement van de werkgever.
     */
    Optional<EmployerSubscriptionDto> getCurrentSubscription(Long employerId);

    /**
     * Maakt een Stripe Checkout Session aan voor een nieuw abonnement.
     *
     * @param employerId    ID van de werkgever
     * @param packageId     ID van het gekozen pakket
     * @param billingInterval "MONTHLY" of "YEARLY"
     * @param successUrl    URL waarnaar de klant terugkeert na succesvolle betaling
     * @param cancelUrl     URL waarnaar de klant terugkeert bij annulering
     * @return Stripe Checkout Session URL
     */
    String createCheckoutSession(Long employerId, Long packageId, String billingInterval,
                                 String successUrl, String cancelUrl);

    /**
     * Maakt een Stripe Customer Portal Session aan voor het beheren van het abonnement.
     *
     * @param employerId ID van de werkgever
     * @param returnUrl  URL waarnaar de klant terugkeert vanuit de portal
     * @return Stripe Customer Portal URL
     */
    String createCustomerPortalSession(Long employerId, String returnUrl);

    /**
     * Synchroniseert de abonnementstatus van de werkgever met Stripe.
     * Gebruikt wanneer webhooks gemist zijn (bijv. tijdens lokale dev of downtime).
     *
     * @param employerId ID van de werkgever
     * @return bijgewerkt abonnement DTO
     */
    EmployerSubscriptionDto syncSubscriptionWithStripe(Long employerId);

    /**
     * Upgradet of downgradet het abonnement naar een ander pakket via Stripe Subscription Update.
     * Proratie wordt berekend door Stripe.
     *
     * @param employerId      ID van de werkgever
     * @param packageId       ID van het nieuwe pakket
     * @param billingInterval "MONTHLY" of "YEARLY"
     * @return bijgewerkt abonnement DTO
     */
    EmployerSubscriptionDto changeSubscriptionPackage(Long employerId, Long packageId, String billingInterval);
}
