package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.VacancyCreditStatusDto;

public interface VacancyCreditService {

    /**
     * Geeft de huidige credit-status terug voor een werkgever.
     */
    VacancyCreditStatusDto getCreditStatus(Long employerId);

    /**
     * Voegt credits toe aan een werkgever na een succesvolle Stripe betaling.
     * Maakt ook een transactie-audit record aan.
     */
    void addCredits(Long employerId, String bundleType, String stripePaymentIntent);

    /**
     * Trekt één credit af bij het publiceren van een vacature via credits.
     * Gooit IllegalStateException als er geen credits beschikbaar zijn.
     */
    void deductCredit(Long employerId);

    /**
     * Controleert of de werkgever credits beschikbaar heeft (zonder af te trekken).
     */
    boolean hasCredits(Long employerId);

    /**
     * Maakt een Stripe Checkout sessie aan voor vacaturecredits.
     */
    String createCreditCheckoutSession(Long employerId, String employerEmail, String bundleType);
}
