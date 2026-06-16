package nl.zorgwerkwijzer.service;

public interface SubscriptionService {

    /**
     * Controleert of de werkgever een actief abonnement heeft en de vacaturelimiet niet heeft bereikt.
     * Gebruikt SELECT FOR UPDATE op de employer_subscriptions rij om race conditions te voorkomen.
     *
     * @param employerId het ID van de werkgever
     * @throws nl.zorgwerkwijzer.exception.SubscriptionLimitException als de limiet bereikt is
     */
    void checkVacancyLimit(Long employerId);

    /**
     * Controleert abonnement OF vacaturecredits. Als abonnement faalt maar credits beschikbaar zijn,
     * worden de credits gebruikt. Geeft true terug als credits gebruikt zijn (voor deductie in service).
     *
     * @param employerId het ID van de werkgever
     * @return true als vacaturecredits gebruikt moeten worden, false als abonnement gebruikt wordt
     * @throws nl.zorgwerkwijzer.exception.SubscriptionLimitException als geen abonnement én geen credits
     */
    boolean checkVacancyLimitOrCreditsAvailable(Long employerId);

    /**
     * Controleert of de werkgever recht heeft op featured vacatures (isFeaturedIncluded).
     *
     * @param employerId het ID van de werkgever
     * @throws nl.zorgwerkwijzer.exception.SubscriptionLimitException als featured niet is inbegrepen
     */
    void checkFeaturedAllowed(Long employerId);

    /**
     * Controleert of de werkgever CV-downloads mag zien.
     *
     * @param employerId het ID van de werkgever
     * @return true als CV-download is inbegrepen in het pakket
     */
    boolean canViewCv(Long employerId);

    /**
     * Controleert of de werkgever contactgegevens van kandidaten mag zien.
     *
     * @param employerId het ID van de werkgever
     * @return true als contactgegevens zichtbaar zijn
     */
    boolean canSeeApplicantContact(Long employerId);
}
