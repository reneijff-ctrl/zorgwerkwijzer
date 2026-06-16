package nl.zorgwerkwijzer.service.impl;

import com.stripe.exception.StripeException;
import com.stripe.model.Subscription;
import com.stripe.model.SubscriptionCollection;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.config.FrontendProperties;
import nl.zorgwerkwijzer.dto.subscription.EmployerSubscriptionDto;
import nl.zorgwerkwijzer.dto.subscription.SubscriptionPackageDto;
import nl.zorgwerkwijzer.exception.ResourceNotFoundException;
import nl.zorgwerkwijzer.model.BillingInterval;
import nl.zorgwerkwijzer.model.Employer;
import nl.zorgwerkwijzer.model.EmployerSubscription;
import nl.zorgwerkwijzer.model.SubscriptionPackage;
import nl.zorgwerkwijzer.model.SubscriptionStatus;
import nl.zorgwerkwijzer.repository.EmployerRepository;
import nl.zorgwerkwijzer.repository.EmployerSubscriptionRepository;
import nl.zorgwerkwijzer.repository.SubscriptionPackageRepository;
import nl.zorgwerkwijzer.service.StripeService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StripeServiceImpl implements StripeService {

    private final SubscriptionPackageRepository subscriptionPackageRepository;
    private final EmployerSubscriptionRepository employerSubscriptionRepository;
    private final EmployerRepository employerRepository;
    private final FrontendProperties frontendProperties;

    // ─── Pakketten ────────────────────────────────────────────────────────────

    @Override
    public List<SubscriptionPackageDto> getActivePackages() {
        return subscriptionPackageRepository.findByIsActiveTrueOrderByPriceMonthlyAsc()
                .stream()
                .map(this::toPackageDto)
                .collect(Collectors.toList());
    }

    // ─── Huidig abonnement ───────────────────────────────────────────────────

    @Override
    public Optional<EmployerSubscriptionDto> getCurrentSubscription(Long employerId) {
        return employerSubscriptionRepository.findByEmployerId(employerId)
                .map(this::toSubscriptionDto);
    }

    // ─── Checkout Session ────────────────────────────────────────────────────

    @Override
    @Transactional
    public String createCheckoutSession(Long employerId, Long packageId, String billingInterval,
                                        String successUrl, String cancelUrl) {
        // Fix 3: URL whitelist validatie
        validateFrontendUrl(successUrl, "successUrl");
        validateFrontendUrl(cancelUrl, "cancelUrl");

        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new ResourceNotFoundException("Werkgever niet gevonden: " + employerId));

        SubscriptionPackage pkg = subscriptionPackageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Pakket niet gevonden: " + packageId));

        // Controleer of er al een actief abonnement bestaat
        Optional<EmployerSubscription> existing = employerSubscriptionRepository.findByEmployerId(employerId);
        if (existing.isPresent()) {
            SubscriptionStatus status = existing.get().getStatus();
            if (status == SubscriptionStatus.ACTIVE || status == SubscriptionStatus.TRIALING) {
                throw new IllegalStateException(
                    "Je hebt al een actief abonnement. Gebruik 'Beheer abonnement' om te upgraden."
                );
            }
        }

        // Bepaal de juiste Stripe Price ID
        boolean isYearly = "YEARLY".equalsIgnoreCase(billingInterval);
        String priceId = isYearly ? pkg.getStripePriceIdYearly() : pkg.getStripePriceIdMonthly();
        if (priceId == null || priceId.isBlank()) {
            throw new IllegalStateException(
                "Stripe Price ID is nog niet geconfigureerd voor pakket: " + pkg.getDisplayName() +
                ". Configureer de Stripe Price IDs in het admin dashboard."
            );
        }

        try {
            // Fix 1: Customer-ID ophalen of aanmaken + direct opslaan als INACTIVE subscription
            String stripeCustomerId = getOrCreateStripeCustomerAndPersist(employer, existing.orElse(null), pkg);

            // Bouw Checkout Session parameters
            com.stripe.param.checkout.SessionCreateParams params =
                com.stripe.param.checkout.SessionCreateParams.builder()
                    .setCustomer(stripeCustomerId)
                    .setMode(com.stripe.param.checkout.SessionCreateParams.Mode.SUBSCRIPTION)
                    .addLineItem(
                        com.stripe.param.checkout.SessionCreateParams.LineItem.builder()
                            .setPrice(priceId)
                            .setQuantity(1L)
                            .build()
                    )
                    .setSuccessUrl(successUrl)
                    .setCancelUrl(cancelUrl)
                    .putMetadata("employerId", String.valueOf(employerId))
                    .putMetadata("packageId", String.valueOf(packageId))
                    .setLocale(com.stripe.param.checkout.SessionCreateParams.Locale.NL)
                    .setBillingAddressCollection(
                        com.stripe.param.checkout.SessionCreateParams.BillingAddressCollection.REQUIRED
                    )
                    .setAllowPromotionCodes(true)
                    .build();

            com.stripe.model.checkout.Session session =
                com.stripe.model.checkout.Session.create(params);

            log.info("[STRIPE] Checkout Session aangemaakt voor werkgever {} pakket {} session={}",
                employerId, pkg.getName(), session.getId());

            return session.getUrl();

        } catch (StripeException e) {
            log.error("[STRIPE] Fout bij aanmaken Checkout Session voor werkgever {}: {}", employerId, e.getMessage());
            throw new RuntimeException("Stripe fout: " + e.getMessage(), e);
        }
    }

    // ─── Customer Portal ─────────────────────────────────────────────────────

    @Override
    @Transactional
    public String createCustomerPortalSession(Long employerId, String returnUrl) {
        // Fix 3: URL whitelist validatie
        validateFrontendUrl(returnUrl, "returnUrl");

        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new ResourceNotFoundException("Werkgever niet gevonden: " + employerId));

        EmployerSubscription subscription = employerSubscriptionRepository.findByEmployerId(employerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Geen abonnement gevonden voor werkgever: " + employer.getName() +
                    ". Sluit eerst een abonnement af."
                ));

        if (subscription.getStripeCustomerId() == null) {
            throw new IllegalStateException(
                "Geen Stripe Customer ID gevonden. Sluit eerst een abonnement af via de betaalpagina."
            );
        }

        try {
            com.stripe.param.billingportal.SessionCreateParams params =
                com.stripe.param.billingportal.SessionCreateParams.builder()
                    .setCustomer(subscription.getStripeCustomerId())
                    .setReturnUrl(returnUrl)
                    .build();

            com.stripe.model.billingportal.Session portalSession =
                com.stripe.model.billingportal.Session.create(params);

            log.info("[STRIPE] Customer Portal Session aangemaakt voor werkgever {} customer={}",
                employerId, subscription.getStripeCustomerId());

            return portalSession.getUrl();

        } catch (StripeException e) {
            log.error("[STRIPE] Fout bij aanmaken Customer Portal Session voor werkgever {}: {}",
                employerId, e.getMessage());
            throw new RuntimeException("Stripe fout: " + e.getMessage(), e);
        }
    }

    // ─── Fix 1: Customer aanmaken + direct persisteren als INACTIVE subscription ──

    /**
     * Haalt de Stripe Customer ID op uit de bestaande subscription,
     * of maakt een nieuwe Stripe Customer aan en slaat het ID direct op
     * als een INACTIVE EmployerSubscription record.
     *
     * Dit voorkomt:
     * 1. Duplicate Stripe Customers bij herhaalde checkout pogingen
     * 2. Race conditions bij gelijktijdige checkout requests (UNIQUE constraint op employer_id)
     */
    private String getOrCreateStripeCustomerAndPersist(Employer employer,
                                                        EmployerSubscription existingSubscription,
                                                        SubscriptionPackage pkg) {
        // Als er al een Stripe Customer ID is, hergebruik die
        if (existingSubscription != null && existingSubscription.getStripeCustomerId() != null) {
            return existingSubscription.getStripeCustomerId();
        }

        try {
            // Controleer eerst of een customer al bestaat op basis van e-mailadres in Stripe
            com.stripe.param.CustomerListParams listParams =
                com.stripe.param.CustomerListParams.builder()
                    .setEmail(employer.getEmail())
                    .setLimit(1L)
                    .build();
            com.stripe.model.CustomerCollection customers =
                com.stripe.model.Customer.list(listParams);

            String stripeCustomerId;

            if (customers.getData() != null && !customers.getData().isEmpty()) {
                stripeCustomerId = customers.getData().get(0).getId();
                log.info("[STRIPE] Bestaande Stripe Customer gevonden voor werkgever {} customer={}",
                    employer.getId(), stripeCustomerId);
            } else {
                // Nieuwe Stripe Customer aanmaken
                com.stripe.param.CustomerCreateParams createParams =
                    com.stripe.param.CustomerCreateParams.builder()
                        .setEmail(employer.getEmail())
                        .setName(employer.getName())
                        .putMetadata("employerId", String.valueOf(employer.getId()))
                        .build();
                com.stripe.model.Customer customer = com.stripe.model.Customer.create(createParams);
                stripeCustomerId = customer.getId();
                log.info("[STRIPE] Nieuwe Stripe Customer aangemaakt voor werkgever {} customer={}",
                    employer.getId(), stripeCustomerId);
            }

            // Fix 1: Customer-ID direct persisteren als INACTIVE subscription
            // Dit voorkomt dat bij een volgende checkout opnieuw een Stripe Customer wordt aangemaakt
            // en beschermt via de UNIQUE(employer_id) constraint tegen race conditions.
            if (existingSubscription == null) {
                persistInactiveSubscription(employer, pkg, stripeCustomerId);
            } else {
                // Bestaande INACTIVE subscription: Customer-ID bijwerken
                existingSubscription.setStripeCustomerId(stripeCustomerId);
                employerSubscriptionRepository.save(existingSubscription);
                log.info("[STRIPE] Stripe Customer ID opgeslagen in bestaande subscription voor werkgever {}",
                    employer.getId());
            }

            return stripeCustomerId;

        } catch (StripeException e) {
            log.error("[STRIPE] Fout bij ophalen/aanmaken Stripe Customer voor werkgever {}: {}",
                employer.getId(), e.getMessage());
            throw new RuntimeException("Stripe fout bij customer beheer: " + e.getMessage(), e);
        }
    }

    /**
     * Maakt een INACTIVE EmployerSubscription record aan met het Stripe Customer ID.
     * Bij een gelijktijdige aanroep vangt de UNIQUE(employer_id) DB-constraint de race condition op.
     */
    private void persistInactiveSubscription(Employer employer, SubscriptionPackage pkg, String stripeCustomerId) {
        try {
            EmployerSubscription subscription = new EmployerSubscription();
            subscription.setEmployer(employer);
            subscription.setSubscriptionPackage(pkg);
            subscription.setStripeCustomerId(stripeCustomerId);
            subscription.setStatus(SubscriptionStatus.INACTIVE);
            employerSubscriptionRepository.save(subscription);
            log.info("[STRIPE] INACTIVE subscription aangemaakt voor werkgever {} customer={}",
                employer.getId(), stripeCustomerId);
        } catch (DataIntegrityViolationException e) {
            // Race condition: een andere thread heeft al een subscription aangemaakt.
            // Het Customer-ID van de winnende thread is nu opgeslagen — herlaad en gebruik dat ID.
            log.info("[STRIPE] Concurrent subscription aanmaak gedetecteerd voor werkgever {} — herlaad bestaande subscription",
                employer.getId());
            EmployerSubscription existing = employerSubscriptionRepository
                    .findByEmployerId(employer.getId())
                    .orElseThrow(() -> new IllegalStateException(
                        "Concurrent subscription aanmaak gefaald voor werkgever: " + employer.getId()));
            // Gebruik het Customer-ID van de winnende thread als het al opgeslagen is
            if (existing.getStripeCustomerId() == null) {
                existing.setStripeCustomerId(stripeCustomerId);
                employerSubscriptionRepository.save(existing);
            }
        }
    }

    // ─── Sync met Stripe ─────────────────────────────────────────────────────

    /**
     * Synchroniseert de lokale abonnementstatus met Stripe door de subscription
     * rechtstreeks op te halen bij Stripe. Gebruikt bij gemiste webhooks.
     */
    @Override
    @Transactional
    public EmployerSubscriptionDto syncSubscriptionWithStripe(Long employerId) {
        EmployerSubscription sub = employerSubscriptionRepository.findByEmployerId(employerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Geen abonnement gevonden voor werkgever: " + employerId));

        String stripeSubId = sub.getStripeSubscriptionId();

        // Fallback: stripeSubscriptionId is null maar stripeCustomerId is wel bekend.
        // Dit treedt op bij het bootstrap-probleem (checkout vóór persistInactiveSubscription)
        // of bij een race condition. Zoek de actieve subscription op via de Stripe Customer API.
        if ((stripeSubId == null || stripeSubId.isBlank()) && sub.getStripeCustomerId() != null) {
            log.info("[STRIPE] stripeSubscriptionId null voor werkgever {} — ophalen via Customer API (customer={})",
                    employerId, sub.getStripeCustomerId());
            try {
                stripeSubId = resolveSubscriptionIdFromCustomer(sub.getStripeCustomerId());
                if (stripeSubId != null) {
                    sub.setStripeSubscriptionId(stripeSubId);
                    employerSubscriptionRepository.save(sub);
                    log.info("[STRIPE] stripeSubscriptionId {} hersteld via Customer API voor werkgever {}",
                            stripeSubId, employerId);
                }
            } catch (StripeException e) {
                log.error("[STRIPE] Kan subscription ID niet ophalen via Customer API voor werkgever {}: {}",
                        employerId, e.getMessage());
            }
        }

        if (stripeSubId == null || stripeSubId.isBlank()) {
            log.warn("[STRIPE] Sync mislukt voor werkgever {} — geen Stripe Subscription ID", employerId);
            throw new IllegalStateException(
                    "Kan niet synchroniseren: er is nog geen Stripe subscription ID gekoppeld. " +
                    "Voltooi eerst de checkout.");
        }

        try {
            Subscription stripeSub = Subscription.retrieve(stripeSubId);

            // Status mappen
            SubscriptionStatus newStatus = mapStripeStatus(stripeSub.getStatus());
            SubscriptionStatus oldStatus = sub.getStatus();
            sub.setStatus(newStatus);

            // Periode bijwerken
            if (stripeSub.getCurrentPeriodStart() != null) {
                sub.setCurrentPeriodStart(epochToLocalDateTime(stripeSub.getCurrentPeriodStart()));
            }
            if (stripeSub.getCurrentPeriodEnd() != null) {
                sub.setCurrentPeriodEnd(epochToLocalDateTime(stripeSub.getCurrentPeriodEnd()));
            }
            if (stripeSub.getTrialEnd() != null) {
                sub.setTrialEnd(epochToLocalDateTime(stripeSub.getTrialEnd()));
            }

            // cancelAtPeriodEnd bijwerken
            if (stripeSub.getCancelAtPeriodEnd() != null) {
                sub.setCancelAtPeriodEnd(stripeSub.getCancelAtPeriodEnd());
            }

            // Pakket bijwerken op basis van price ID
            if (stripeSub.getItems() != null && !stripeSub.getItems().getData().isEmpty()) {
                String priceId = stripeSub.getItems().getData().get(0).getPrice().getId();
                subscriptionPackageRepository.findByStripePriceIdMonthly(priceId)
                        .or(() -> subscriptionPackageRepository.findByStripePriceIdYearly(priceId))
                        .ifPresent(pkg -> {
                            sub.setSubscriptionPackage(pkg);
                            // Billing interval afleiden
                            String interval = stripeSub.getItems().getData().get(0).getPrice().getRecurring().getInterval();
                            sub.setBillingInterval("year".equals(interval) ? BillingInterval.YEARLY : BillingInterval.MONTHLY);
                        });
            }

            employerSubscriptionRepository.save(sub);
            log.info("[STRIPE] Sync geslaagd voor werkgever {}: {} → {} (Stripe status: {})",
                    employerId, oldStatus, newStatus, stripeSub.getStatus());

            return toSubscriptionDto(sub);

        } catch (StripeException e) {
            log.error("[STRIPE] Sync fout voor werkgever {}: {}", employerId, e.getMessage());
            throw new RuntimeException("Stripe sync fout: " + e.getMessage(), e);
        }
    }

    /**
     * Mapt Stripe status string naar intern enum (gelijk aan StripeWebhookServiceImpl).
     */
    private SubscriptionStatus mapStripeStatus(String stripeStatus) {
        if (stripeStatus == null) return SubscriptionStatus.INACTIVE;
        return switch (stripeStatus) {
            case "active"           -> SubscriptionStatus.ACTIVE;
            case "trialing"         -> SubscriptionStatus.TRIALING;
            case "past_due"         -> SubscriptionStatus.PAST_DUE;
            case "canceled"         -> SubscriptionStatus.CANCELED;
            case "unpaid"           -> SubscriptionStatus.UNPAID;
            default                 -> SubscriptionStatus.INACTIVE;
        };
    }

    private LocalDateTime epochToLocalDateTime(Long epochSeconds) {
        if (epochSeconds == null) return null;
        return LocalDateTime.ofInstant(Instant.ofEpochSecond(epochSeconds), ZoneOffset.UTC);
    }

    // ─── Upgrade / Downgrade via Stripe Subscription Update ──────────────────

    /**
     * Upgradet of downgradet het abonnement via Stripe Subscription Update.
     * Proratie wordt automatisch berekend door Stripe.
     * De lokale database wordt direct bijgewerkt; Stripe stuurt ook een webhook (customer.subscription.updated).
     */
    @Override
    @Transactional
    public EmployerSubscriptionDto changeSubscriptionPackage(Long employerId, Long packageId, String billingInterval) {
        EmployerSubscription sub = employerSubscriptionRepository.findByEmployerId(employerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Geen abonnement gevonden voor werkgever: " + employerId));

        if (sub.getStatus() != SubscriptionStatus.ACTIVE && sub.getStatus() != SubscriptionStatus.TRIALING) {
            throw new IllegalStateException(
                    "Je abonnement moet actief zijn om te upgraden of downgraden. " +
                    "Huidige status: " + sub.getStatus());
        }

        String stripeSubId = sub.getStripeSubscriptionId();
        if (stripeSubId == null || stripeSubId.isBlank()) {
            throw new IllegalStateException(
                    "Geen Stripe Subscription ID gevonden. Neem contact op met ondersteuning.");
        }

        SubscriptionPackage newPkg = subscriptionPackageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Pakket niet gevonden: " + packageId));

        boolean isYearly = "YEARLY".equalsIgnoreCase(billingInterval);
        String newPriceId = isYearly ? newPkg.getStripePriceIdYearly() : newPkg.getStripePriceIdMonthly();
        if (newPriceId == null || newPriceId.isBlank()) {
            throw new IllegalStateException(
                    "Stripe Price ID niet geconfigureerd voor pakket: " + newPkg.getDisplayName());
        }

        try {
            // Haal huidige Stripe subscription op
            Subscription stripeSub = Subscription.retrieve(stripeSubId);

            // Bouw update params — proratie ingeschakeld (Stripe default)
            String currentItemId = stripeSub.getItems().getData().get(0).getId();
            com.stripe.param.SubscriptionUpdateParams params =
                    com.stripe.param.SubscriptionUpdateParams.builder()
                            .setProrationBehavior(
                                    com.stripe.param.SubscriptionUpdateParams.ProrationBehavior.CREATE_PRORATIONS)
                            .addItem(
                                    com.stripe.param.SubscriptionUpdateParams.Item.builder()
                                            .setId(currentItemId)
                                            .setPrice(newPriceId)
                                            .build()
                            )
                            .build();

            Subscription updatedSub = stripeSub.update(params);
            log.info("[STRIPE] Abonnement gewijzigd voor werkgever {}: pakket={} interval={} sub={}",
                    employerId, newPkg.getName(), billingInterval, stripeSubId);

            // Lokale database direct bijwerken (webhook doet hetzelfde maar kan vertraagd zijn)
            sub.setSubscriptionPackage(newPkg);
            sub.setBillingInterval(isYearly ? BillingInterval.YEARLY : BillingInterval.MONTHLY);
            if (updatedSub.getCurrentPeriodEnd() != null) {
                sub.setCurrentPeriodEnd(epochToLocalDateTime(updatedSub.getCurrentPeriodEnd()));
            }
            employerSubscriptionRepository.save(sub);

            return toSubscriptionDto(sub);

        } catch (StripeException e) {
            log.error("[STRIPE] Abonnement wijzigen mislukt voor werkgever {}: {}", employerId, e.getMessage());
            throw new RuntimeException("Stripe fout bij abonnementswijziging: " + e.getMessage(), e);
        }
    }

    // ─── Customer API fallback ────────────────────────────────────────────────

    /**
     * Haalt de meest recente actieve Stripe Subscription ID op voor een gegeven Customer ID.
     * Wordt gebruikt als de lokale database geen stripeSubscriptionId heeft (bootstrap-herstel).
     *
     * @return het Stripe Subscription ID, of null als er geen actieve subscription is
     */
    private String resolveSubscriptionIdFromCustomer(String stripeCustomerId) throws StripeException {
        com.stripe.param.SubscriptionListParams params = com.stripe.param.SubscriptionListParams.builder()
                .setCustomer(stripeCustomerId)
                .setStatus(com.stripe.param.SubscriptionListParams.Status.ACTIVE)
                .setLimit(1L)
                .build();

        SubscriptionCollection subscriptions = Subscription.list(params);

        if (subscriptions.getData() != null && !subscriptions.getData().isEmpty()) {
            String subId = subscriptions.getData().get(0).getId();
            log.info("[STRIPE] Actieve subscription {} gevonden via Customer API voor customer {}",
                    subId, stripeCustomerId);
            return subId;
        }

        log.warn("[STRIPE] Geen actieve subscription gevonden via Customer API voor customer {}",
                stripeCustomerId);
        return null;
    }

    // ─── Fix 3: URL whitelist validatie ──────────────────────────────────────

    /**
     * Valideert dat een redirect-URL naar het geconfigureerde frontend domein wijst.
     * Voorkomt open redirect aanvallen via Stripe Checkout/Portal.
     */
    private void validateFrontendUrl(String url, String fieldName) {
        if (url == null || url.isBlank()) {
            throw new IllegalArgumentException(fieldName + " is verplicht.");
        }

        // Localhost-URLs zijn altijd toegestaan voor lokale development.
        // Stripe accepteert http://localhost in test-modus; in live-modus weigert Stripe
        // deze URLs zelf — er is dus geen productie-risico.
        if (url.startsWith("http://localhost") || url.startsWith("https://localhost")) {
            return;
        }

        String allowedBase = frontendProperties.getUrl();
        // Normalise: verwijder trailing slash voor vergelijking
        String normalizedAllowed = allowedBase.endsWith("/")
            ? allowedBase.substring(0, allowedBase.length() - 1)
            : allowedBase;

        if (!url.startsWith(normalizedAllowed + "/") && !url.equals(normalizedAllowed)) {
            throw new IllegalArgumentException(
                fieldName + " moet een " + normalizedAllowed + " URL zijn. " +
                "Externe redirects zijn niet toegestaan."
            );
        }
        if (!url.startsWith("https://")) {
            throw new IllegalArgumentException(
                fieldName + " moet beginnen met https://."
            );
        }
    }

    // ─── DTO mappers ─────────────────────────────────────────────────────────

    private SubscriptionPackageDto toPackageDto(SubscriptionPackage pkg) {
        return SubscriptionPackageDto.builder()
                .id(pkg.getId())
                .name(pkg.getName())
                .displayName(pkg.getDisplayName())
                .priceMonthly(pkg.getPriceMonthly())
                .priceYearly(pkg.getPriceYearly())
                .maxActiveVacancies(pkg.getMaxActiveVacancies())
                .canViewCv(pkg.getCanViewCv())
                .canSeeApplicantContact(pkg.getCanSeeApplicantContact())
                .isFeaturedIncluded(pkg.getIsFeaturedIncluded())
                .build();
    }

    private EmployerSubscriptionDto toSubscriptionDto(EmployerSubscription sub) {
        SubscriptionPackage pkg = sub.getSubscriptionPackage();
        return EmployerSubscriptionDto.builder()
                .id(sub.getId())
                .packageName(pkg.getName())
                .packageDisplayName(pkg.getDisplayName())
                .packagePriceMonthly(pkg.getPriceMonthly())
                .packagePriceYearly(pkg.getPriceYearly())
                .maxActiveVacancies(pkg.getMaxActiveVacancies())
                .canViewCv(pkg.getCanViewCv())
                .canSeeApplicantContact(pkg.getCanSeeApplicantContact())
                .isFeaturedIncluded(pkg.getIsFeaturedIncluded())
                .status(sub.getStatus())
                .billingInterval(sub.getBillingInterval())
                .currentPeriodStart(sub.getCurrentPeriodStart())
                .currentPeriodEnd(sub.getCurrentPeriodEnd())
                .trialEnd(sub.getTrialEnd())
                .canceledAt(sub.getCanceledAt())
                .stripeCustomerId(sub.getStripeCustomerId())
                .stripeSubscriptionId(sub.getStripeSubscriptionId())
                .cancelAtPeriodEnd(sub.isCancelAtPeriodEnd())
                .periodEndDate(sub.getCurrentPeriodEnd() != null ? sub.getCurrentPeriodEnd().toLocalDate() : null)
                .build();
    }
}
