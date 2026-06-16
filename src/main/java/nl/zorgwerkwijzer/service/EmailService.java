package nl.zorgwerkwijzer.service;

/**
 * Service voor het versturen van e-mailnotificaties naar kandidaten.
 */
public interface EmailService {

    /**
     * Stuurt een melding dat de sollicitatie bekeken is door de werkgever.
     *
     * @param toEmail       e-mailadres van de kandidaat
     * @param firstName     voornaam van de kandidaat
     * @param vacancyTitle  titel van de vacature
     * @param employerName  naam van de werkgever
     */
    void sendApplicationViewedEmail(String toEmail, String firstName,
                                    String vacancyTitle, String employerName);

    /**
     * Stuurt een uitnodiging voor een gesprek.
     *
     * @param toEmail       e-mailadres van de kandidaat
     * @param firstName     voornaam van de kandidaat
     * @param vacancyTitle  titel van de vacature
     * @param employerName  naam van de werkgever
     */
    void sendApplicationInvitedEmail(String toEmail, String firstName,
                                     String vacancyTitle, String employerName);

    /**
     * Stuurt een felicitatiemail wanneer de kandidaat is aangenomen.
     *
     * @param toEmail       e-mailadres van de kandidaat
     * @param firstName     voornaam van de kandidaat
     * @param vacancyTitle  titel van de vacature
     * @param employerName  naam van de werkgever
     */
    void sendApplicationAcceptedEmail(String toEmail, String firstName,
                                      String vacancyTitle, String employerName);

    /**
     * Stuurt een afwijzingsmail aan de kandidaat.
     *
     * @param toEmail       e-mailadres van de kandidaat
     * @param firstName     voornaam van de kandidaat
     * @param vacancyTitle  titel van de vacature
     * @param employerName  naam van de werkgever
     */
    void sendApplicationRejectedEmail(String toEmail, String firstName,
                                      String vacancyTitle, String employerName);

    /**
     * Stuurt een betaalmislukking-melding aan een werkgever.
     *
     * @param toEmail       e-mailadres van de werkgever
     * @param employerName  naam van de werkgever of het bedrijf
     */
    void sendPaymentFailedEmail(String toEmail, String employerName);

    /**
     * Stuurt een wachtwoord-reset e-mail met een tijdelijk token.
     *
     * @param toEmail       e-mailadres van de gebruiker
     * @param resetToken    het tijdelijke reset-token (1 uur geldig)
     * @param frontendUrl   base URL van de frontend (voor de reset-link)
     */
    void sendPasswordResetEmail(String toEmail, String resetToken, String frontendUrl);

    /**
     * Stuurt een e-mailverificatielink naar een nieuw geregistreerde gebruiker.
     *
     * @param toEmail           e-mailadres van de gebruiker
     * @param verificationToken het verificatietoken (24 uur geldig)
     * @param frontendUrl       base URL van de frontend (voor de verificatielink)
     */
    void sendEmailVerificationEmail(String toEmail, String verificationToken, String frontendUrl);

    /**
     * Stuurt een contactbericht van een bezoeker door naar de admin.
     *
     * @param name      naam van de afzender
     * @param email     e-mailadres van de afzender
     * @param message   inhoud van het bericht
     * @param adminEmail e-mailadres van de admin
     */
    void sendContactMessage(String name, String email, String message, String adminEmail);

    void sendContactConfirmation(String toEmail, String name, String message);

    /**
     * Stuurt een antwoord van een admin op een contactbericht naar de oorspronkelijke afzender.
     *
     * @param toEmail   e-mailadres van de oorspronkelijke afzender
     * @param toName    naam van de oorspronkelijke afzender
     * @param subject   onderwerp van het antwoord
     * @param replyMessage  inhoud van het antwoord
     */
    void sendContactReply(String toEmail, String toName, String subject, String replyMessage);
}
