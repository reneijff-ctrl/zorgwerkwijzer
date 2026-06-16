package nl.zorgwerkwijzer.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.exception.SubscriptionLimitException;
import nl.zorgwerkwijzer.model.EmployerSubscription;
import nl.zorgwerkwijzer.model.SubscriptionPackage;
import nl.zorgwerkwijzer.model.SubscriptionStatus;
import nl.zorgwerkwijzer.repository.EmployerRepository;
import nl.zorgwerkwijzer.repository.EmployerSubscriptionRepository;
import nl.zorgwerkwijzer.repository.VacancyRepository;
import nl.zorgwerkwijzer.service.SubscriptionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final EmployerSubscriptionRepository employerSubscriptionRepository;
    private final VacancyRepository vacancyRepository;
    private final EmployerRepository employerRepository;

    /**
     * Controleert de vacaturelimiet via SELECT FOR UPDATE op de employer_subscriptions rij.
     * De pessimistische lock serialiseert gelijktijdige createVacancy() aanroepen voor dezelfde werkgever,
     * waardoor race conditions worden voorkomen.
     */
    @Override
    @Transactional
    public void checkVacancyLimit(Long employerId) {
        // Stap 1: SELECT FOR UPDATE — vergrendel de subscription rij voor de duur van de transactie.
        // Gelijktijdige aanroepen voor dezelfde werkgever blokkeren hier totdat de eerste COMMIT.
        EmployerSubscription subscription = employerSubscriptionRepository
                .findByEmployerIdForUpdate(employerId)
                .orElseThrow(() -> new SubscriptionLimitException(
                        "Je hebt nog geen actief abonnement. Kies een pakket om vacatures te plaatsen."));

        // Stap 2: Controleer of het abonnement actief of in de proefperiode is.
        SubscriptionStatus status = subscription.getStatus();
        if (status != SubscriptionStatus.ACTIVE && status != SubscriptionStatus.TRIALING) {
            throw new SubscriptionLimitException(
                    "Je abonnement is niet actief (status: " + status + "). " +
                    "Activeer je abonnement om vacatures te plaatsen.");
        }

        // Stap 3: PREMIUM heeft geen limiet (maxActiveVacancies == null) — direct doorgaan.
        SubscriptionPackage pkg = subscription.getSubscriptionPackage();
        Integer maxVacancies = pkg.getMaxActiveVacancies();
        if (maxVacancies == null) {
            log.debug("Employer {} heeft PREMIUM abonnement — geen vacaturelimiet.", employerId);
            return;
        }

        // Stap 4: Lees het actuele aantal actieve vacatures.
        // De FOR UPDATE lock van stap 1 garandeert dat geen andere transactie
        // tegelijkertijd een vacature kan aanmaken voor dezelfde werkgever.
        long currentCount = vacancyRepository.countByEmployerIdAndIsActiveTrue(employerId);

        if (currentCount >= maxVacancies) {
            throw new SubscriptionLimitException(String.format(
                    "Vacaturelimiet bereikt voor het %s-pakket (%d/%d actieve vacatures). " +
                    "Upgrade je abonnement om meer vacatures te plaatsen.",
                    pkg.getDisplayName(), currentCount, maxVacancies));
        }

        log.debug("Employer {} vacaturelimiet check geslaagd: {}/{} actief.",
                employerId, currentCount, maxVacancies);
    }

    /**
     * Controleert abonnement OF credits. Geeft true terug als credits gebruikt moeten worden.
     */
    @Override
    @Transactional
    public boolean checkVacancyLimitOrCreditsAvailable(Long employerId) {
        // Probeer eerst abonnement-check
        try {
            checkVacancyLimit(employerId);
            return false; // abonnement is geldig — geen credits nodig
        } catch (nl.zorgwerkwijzer.exception.SubscriptionLimitException subscriptionEx) {
            // Geen geldig abonnement of limiet bereikt — check credits als fallback
            nl.zorgwerkwijzer.model.Employer employer = employerRepository.findById(employerId)
                    .orElseThrow(() -> subscriptionEx);
            Integer credits = employer.getVacancyCredits();
            if (credits != null && credits > 0) {
                log.info("Employer {} heeft geen geldig abonnement maar wel {} credit(s). Credits worden gebruikt.",
                        employerId, credits);
                return true; // gebruik credits
            }
            // Geen abonnement én geen credits
            throw new nl.zorgwerkwijzer.exception.SubscriptionLimitException(
                    "Geen actief abonnement en geen vacaturecredits beschikbaar. " +
                    "Koop een vacatureplaatsing of activeer een abonnement.");
        }
    }

    /**
     * Controleert of featured vacatures zijn inbegrepen in het pakket van de werkgever.
     */
    @Override
    @Transactional
    public void checkFeaturedAllowed(Long employerId) {
        EmployerSubscription subscription = employerSubscriptionRepository
                .findByEmployerIdForUpdate(employerId)
                .orElseThrow(() -> new SubscriptionLimitException(
                        "Je hebt nog geen actief abonnement. " +
                        "Featured vacatures vereisen een actief Premium-abonnement."));

        SubscriptionStatus status = subscription.getStatus();
        if (status != SubscriptionStatus.ACTIVE && status != SubscriptionStatus.TRIALING) {
            throw new SubscriptionLimitException(
                    "Je abonnement is niet actief. Featured vacatures vereisen een actief abonnement.");
        }

        SubscriptionPackage pkg = subscription.getSubscriptionPackage();
        if (!Boolean.TRUE.equals(pkg.getIsFeaturedIncluded())) {
            throw new SubscriptionLimitException(String.format(
                    "Featured vacatures zijn niet inbegrepen in het %s-pakket. " +
                    "Upgrade naar Premium voor featured vacatures.",
                    pkg.getDisplayName()));
        }

        log.debug("Employer {} featured check geslaagd (pakket: {}).",
                employerId, pkg.getDisplayName());
    }

    /**
     * Controleert of CV-downloads beschikbaar zijn voor het pakket van de werkgever.
     * Retourneert false (in plaats van exception) — CV-URL wordt gemaskeerd, niet geblokkeerd.
     */
    @Override
    @Transactional(readOnly = true)
    public boolean canViewCv(Long employerId) {
        return employerSubscriptionRepository.findByEmployerId(employerId)
                .filter(s -> s.getStatus() == SubscriptionStatus.ACTIVE
                          || s.getStatus() == SubscriptionStatus.TRIALING)
                .map(s -> Boolean.TRUE.equals(s.getSubscriptionPackage().getCanViewCv()))
                .orElse(false);
    }

    /**
     * Controleert of contactgegevens van kandidaten beschikbaar zijn voor het pakket van de werkgever.
     */
    @Override
    @Transactional(readOnly = true)
    public boolean canSeeApplicantContact(Long employerId) {
        return employerSubscriptionRepository.findByEmployerId(employerId)
                .filter(s -> s.getStatus() == SubscriptionStatus.ACTIVE
                          || s.getStatus() == SubscriptionStatus.TRIALING)
                .map(s -> Boolean.TRUE.equals(s.getSubscriptionPackage().getCanSeeApplicantContact()))
                .orElse(false);
    }
}
