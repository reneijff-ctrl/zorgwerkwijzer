package nl.zorgwerkwijzer.service.impl;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Invoice;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.StripeObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.config.StripeProperties;
import nl.zorgwerkwijzer.model.AuditAction;
import nl.zorgwerkwijzer.model.BillingInterval;
import nl.zorgwerkwijzer.model.Employer;
import nl.zorgwerkwijzer.model.EmployerSubscription;
import nl.zorgwerkwijzer.model.SubscriptionStatus;
import nl.zorgwerkwijzer.model.StripeWebhookEvent;
import nl.zorgwerkwijzer.repository.EmployerRepository;
import nl.zorgwerkwijzer.repository.EmployerSubscriptionRepository;
import nl.zorgwerkwijzer.repository.StripeWebhookEventRepository;
import nl.zorgwerkwijzer.repository.SubscriptionPackageRepository;
import nl.zorgwerkwijzer.repository.VacancyRepository;
import nl.zorgwerkwijzer.service.AdminAuditLogService;
import nl.zorgwerkwijzer.service.EmailService;
import nl.zorgwerkwijzer.service.StripeWebhookService;
import nl.zorgwerkwijzer.service.VacancyCreditService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

/**
 * Implementatie van Stripe webhook event verwerking.
 *
 * Veiligheidsprincipes:
 * - Signature-verificatie via raw bytes (niet via @RequestBody)
 * - Applicatie-level idempotency check + database-level UNIQUE constraint als vangnet
 * - E-mail fouten zijn niet-blokkend (try/catch MailException patroon)
 * - Audit logging via AdminAuditLogService (REQUIRES_NEW — overleeft rollback)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class StripeWebhookServiceImpl implements StripeWebhookService {

    // Systeem-actor voor webhook-events (geen menselijke admin)
    private static final Long SYSTEM_ACTOR_ID = 0L;
    private static final String SYSTEM_ACTOR_EMAIL = "stripe-webhook@system";
    private static final String ENTITY_TYPE_SUBSCRIPTION = "SUBSCRIPTION";

    private final StripeProperties stripeProperties;
    private final EmployerSubscriptionRepository employerSubscriptionRepository;
    private final SubscriptionPackageRepository subscriptionPackageRepository;
    private final EmployerRepository employerRepository;
    private final VacancyRepository vacancyRepository;
    private final StripeWebhookEventRepository stripeWebhookEventRepository;
    private final EmailService emailService;
    private final AdminAuditLogService adminAuditLogService;
    private final VacancyCreditService vacancyCreditService;

    // ─── Publieke entry-point ──────────────────────────────────────────────────

    @Override
    @Transactional
    public void handleEvent(byte[] rawPayload, String sigHeader) {
        String webhookSecret = stripeProperties.getWebhookSecret();
        String payloadString = new String(rawPayload, StandardCharsets.UTF_8);

        log.info("[WEBHOOK] Event ontvangen — payload {} bytes, sigHeader aanwezig: {}",
                rawPayload.length, sigHeader != null && !sigHeader.isBlank());

        // 1. Signature-verificatie — beschermt tegen nep-events
        if (webhookSecret == null || webhookSecret.isBlank()) {
            // Webhook secret is verplicht — zowel lokaal als in productie.
            // Lokaal: start de Stripe CLI met:
            //   stripe listen --forward-to http://localhost:8080/api/v1/stripe/webhook
            // en stel het gegenereerde whsec_... in als STRIPE_WEBHOOK_SECRET
            // (of voeg het toe aan application-local.yaml als app.stripe.webhook-secret: whsec_...)
            log.error("[STRIPE] STRIPE_WEBHOOK_SECRET is niet geconfigureerd. "
                    + "Start de Stripe CLI: stripe listen --forward-to http://localhost:8080/api/v1/stripe/webhook "
                    + "en stel het whsec_... geheim in als STRIPE_WEBHOOK_SECRET env-variabele.");
            throw new IllegalStateException(
                    "Stripe webhook secret is niet geconfigureerd. "
                    + "Stel STRIPE_WEBHOOK_SECRET in als environment variable.");
        }

        Event event;
        try {
            event = Webhook.constructEvent(payloadString, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            log.warn("[STRIPE] Ongeldige webhook signature: {}", e.getMessage());
            throw new IllegalArgumentException("Ongeldige Stripe webhook signature");
        }

        String eventId = event.getId();
        String eventType = event.getType();

        // 2. Applicatie-level idempotency check (snelpad)
        if (stripeWebhookEventRepository.existsByStripeEventId(eventId)) {
            log.info("[STRIPE] Duplicate event overgeslagen: {} ({})", eventId, eventType);
            return;
        }

        // 3. Sla webhook event op vóór verwerking
        //    UNIQUE constraint op stripe_event_id vangt race conditions op (database-level vangnet)
        persistWebhookEvent(eventId, eventType, payloadString);

        // 4. Routeer naar de juiste handler
        log.info("[WEBHOOK] Event type: {} | event ID: {}", eventType, eventId);
        switch (eventType) {
            case "checkout.session.completed"        -> handleCheckoutSessionCompleted(event);
            case "customer.subscription.created"    -> handleSubscriptionCreated(event);
            case "customer.subscription.updated"    -> handleSubscriptionUpdated(event);
            case "customer.subscription.deleted"    -> handleSubscriptionDeleted(event);
            case "invoice.paid"                     -> handleInvoicePaid(event);
            // invoice.payment_succeeded is een alias voor invoice.paid bij sommige Stripe configuraties
            case "invoice.payment_succeeded"        -> handleInvoicePaid(event);
            case "invoice.payment_failed"           -> handleInvoicePaymentFailed(event);
            default -> log.debug("[STRIPE] Onbekend event-type genegeerd: {}", eventType);
        }
    }

    // ─── Event handlers ───────────────────────────────────────────────────────

    /**
     * checkout.session.completed — koppelt het Stripe Subscription ID aan de
     * bestaande INACTIVE EmployerSubscription die is aangemaakt bij de checkout.
     */
    private void handleCheckoutSessionCompleted(Event event) {
        Session session = deserialize(event, Session.class);
        if (session == null) return;

        // ── Vacancy Credits: eenmalige betaling (mode=payment, type=vacancy_credits) ──
        if (session.getMetadata() != null
                && "vacancy_credits".equals(session.getMetadata().get("type"))) {
            handleVacancyCreditPayment(session);
            return;
        }

        String stripeCustomerId = session.getCustomer();
        String stripeSubscriptionId = session.getSubscription();

        if (stripeCustomerId == null || stripeSubscriptionId == null) {
            log.warn("[STRIPE] checkout.session.completed mist customer of subscription ID");
            return;
        }

        // Stap 1: zoek op stripeCustomerId (normaal pad)
        Optional<EmployerSubscription> subOpt =
                employerSubscriptionRepository.findByStripeCustomerId(stripeCustomerId);

        // Stap 2: fallback via employerId uit checkout metadata
        // Dit dekt twee scenario's:
        // A) Race condition: webhook arriveert voor persistInactiveSubscription() commit
        // B) Bootstrap: checkout was voltooid vóór persistInactiveSubscription bestond
        if (subOpt.isEmpty() && session.getMetadata() != null) {
            String metaEmployerId = session.getMetadata().get("employerId");
            if (metaEmployerId != null) {
                try {
                    Long employerId = Long.parseLong(metaEmployerId);
                    subOpt = employerSubscriptionRepository.findByEmployerId(employerId);
                    if (subOpt.isPresent()) {
                        // Customer ID bijwerken als dat er nog niet instond
                        EmployerSubscription found = subOpt.get();
                        if (found.getStripeCustomerId() == null) {
                            found.setStripeCustomerId(stripeCustomerId);
                        }
                        log.info("[STRIPE] checkout.session.completed: employer {} gevonden via metadata employerId",
                                employerId);
                    } else {
                        // Stap 3: geen record via employerId — maak nieuw INACTIVE record aan
                        // zodat stripeSubscriptionId alsnog opgeslagen wordt
                        log.warn("[STRIPE] Geen subscription record voor employer {} — aanmaken via metadata",
                                employerId);
                        subOpt = createSubscriptionFromCheckoutMetadata(
                                employerId, stripeCustomerId, session);
                    }
                } catch (NumberFormatException e) {
                    log.error("[STRIPE] Ongeldige employerId in checkout metadata: {}", metaEmployerId);
                }
            }
        }

        if (subOpt.isEmpty()) {
            log.error("[STRIPE] checkout.session.completed: GEEN subscription gevonden voor "
                    + "customer={} — stripeSubscriptionId={} gaat verloren",
                    stripeCustomerId, stripeSubscriptionId);
            return;
        }

        EmployerSubscription sub = subOpt.get();
        sub.setStripeSubscriptionId(stripeSubscriptionId);

        // Pakket bijwerken via Checkout Session metadata (packageId is meegegeven bij aanmaak)
        if (session.getMetadata() != null) {
            String metaPackageId = session.getMetadata().get("packageId");
            if (metaPackageId != null) {
                try {
                    Long packageId = Long.parseLong(metaPackageId);
                    subscriptionPackageRepository.findById(packageId)
                            .ifPresent(sub::setSubscriptionPackage);
                } catch (NumberFormatException e) {
                    log.warn("[STRIPE] Ongeldige packageId in checkout metadata: {}", metaPackageId);
                }
            }
        }

        employerSubscriptionRepository.save(sub);

        log.info("[STRIPE] checkout.session.completed: subscription {} gekoppeld aan employer {} (pakket: {})",
                stripeSubscriptionId, sub.getEmployer().getId(),
                sub.getSubscriptionPackage() != null ? sub.getSubscriptionPackage().getName() : "onbekend");
    }

    /**
     * Maakt een nieuw EmployerSubscription record aan op basis van checkout session metadata.
     * Wordt alleen aangeroepen als er géén bestaand record is voor de werkgever.
     * Dekt het bootstrap-scenario waarbij de checkout werd voltooid vóór persistInactiveSubscription bestond.
     */
    private Optional<EmployerSubscription> createSubscriptionFromCheckoutMetadata(
            Long employerId, String stripeCustomerId, Session session) {
        return employerRepository.findById(employerId).map(employer -> {
            EmployerSubscription newSub = new EmployerSubscription();
            newSub.setEmployer(employer);
            newSub.setStripeCustomerId(stripeCustomerId);
            newSub.setStatus(SubscriptionStatus.INACTIVE);

            // Pakket instellen via metadata als beschikbaar
            if (session.getMetadata() != null) {
                String metaPackageId = session.getMetadata().get("packageId");
                if (metaPackageId != null) {
                    try {
                        subscriptionPackageRepository.findById(Long.parseLong(metaPackageId))
                                .ifPresent(newSub::setSubscriptionPackage);
                    } catch (NumberFormatException ignored) {}
                }
            }

            // subscriptionPackage is NOT NULL in DB — vangnet: gebruik goedkoopste pakket
            if (newSub.getSubscriptionPackage() == null) {
                subscriptionPackageRepository.findByIsActiveTrueOrderByPriceMonthlyAsc()
                        .stream().findFirst().ifPresent(newSub::setSubscriptionPackage);
            }

            if (newSub.getSubscriptionPackage() == null) {
                log.error("[STRIPE] Kan geen subscription aanmaken voor employer {} — geen pakket beschikbaar",
                        employerId);
                return null;
            }

            EmployerSubscription saved = employerSubscriptionRepository.save(newSub);
            log.info("[STRIPE] Nieuw subscription record aangemaakt via checkout metadata voor employer {}",
                    employerId);
            return saved;
        });
    }

    /**
     * Verwerkt eenmalige vacancy credit betaling.
     * Wordt aangeroepen vanuit handleCheckoutSessionCompleted als metadata.type == "vacancy_credits".
     */
    private void handleVacancyCreditPayment(Session session) {
        java.util.Map<String, String> metadata = session.getMetadata();
        log.info("[WEBHOOK] handleVacancyCreditPayment aangeroepen — metadata: {}", metadata);
        if (metadata == null) {
            log.warn("[CREDITS] checkout.session.completed vacancy_credits: geen metadata aanwezig");
            return;
        }

        String bundleType = metadata.get("bundleType");
        String metaEmployerId = metadata.get("employerId");
        String paymentIntent = session.getPaymentIntent();

        log.info("[WEBHOOK] Metadata — employerId: {}, bundleType: {}, paymentIntent: {}",
                metaEmployerId, bundleType, paymentIntent);

        if (bundleType == null || metaEmployerId == null) {
            log.warn("[CREDITS] checkout.session.completed vacancy_credits: bundleType={} employerId={}",
                    bundleType, metaEmployerId);
            return;
        }

        try {
            Long employerId = Long.parseLong(metaEmployerId);
            vacancyCreditService.addCredits(employerId, bundleType, paymentIntent);
            log.info("[WEBHOOK] Credits toegevoegd — employerId: {}, bundleType: {}, paymentIntent: {}",
                    employerId, bundleType, paymentIntent);
            log.info("[CREDITS] checkout.session.completed verwerkt: employer={}, bundleType={}, paymentIntent={}",
                    employerId, bundleType, paymentIntent);
        } catch (NumberFormatException e) {
            log.error("[CREDITS] Ongeldige employerId in vacancy_credits metadata: {}", metaEmployerId);
        } catch (Exception e) {
            log.error("[CREDITS] Fout bij verwerken vacancy credit betaling voor employerId={}: {}",
                    metaEmployerId, e.getMessage(), e);
        }
    }

    /**
     * customer.subscription.created — stelt de initiële subscriptie-velden in.
     * Wordt gevolgd door invoice.paid dat de status op ACTIVE zet.
     */
    private void handleSubscriptionCreated(Event event) {
        Subscription stripeSub = deserialize(event, Subscription.class);
        if (stripeSub == null) return;

        EmployerSubscription sub = findOrWarnSubscription(stripeSub.getId(), stripeSub.getCustomer());
        if (sub == null) return;

        SubscriptionStatus oldStatus = sub.getStatus();
        updateSubscriptionFields(sub, stripeSub);

        // Status op TRIALING zetten bij trial, anders INACTIVE laten (invoice.paid activeert)
        if ("trialing".equals(stripeSub.getStatus())) {
            sub.setStatus(SubscriptionStatus.TRIALING);
        }

        employerSubscriptionRepository.save(sub);
        log.info("[STRIPE] customer.subscription.created verwerkt voor employer {}", sub.getEmployer().getId());

        logAudit(AuditAction.SUBSCRIPTION_CREATED, sub, oldStatus.name(), sub.getStatus().name());
    }

    /**
     * customer.subscription.updated — bijwerken van status, pakket en periode.
     */
    private void handleSubscriptionUpdated(Event event) {
        Subscription stripeSub = deserialize(event, Subscription.class);
        if (stripeSub == null) return;

        EmployerSubscription sub = findOrWarnSubscription(stripeSub.getId(), stripeSub.getCustomer());
        if (sub == null) return;

        SubscriptionStatus oldStatus = sub.getStatus();
        String oldPackageName = sub.getSubscriptionPackage() != null
                ? sub.getSubscriptionPackage().getName() : "UNKNOWN";

        updateSubscriptionFields(sub, stripeSub);

        // Pakket bijwerken op basis van Stripe price ID (eerste item in de subscription)
        if (stripeSub.getItems() != null && !stripeSub.getItems().getData().isEmpty()) {
            String priceId = stripeSub.getItems().getData().get(0).getPrice().getId();
            subscriptionPackageRepository.findByStripePriceIdMonthly(priceId)
                    .or(() -> subscriptionPackageRepository.findByStripePriceIdYearly(priceId))
                    .ifPresent(sub::setSubscriptionPackage);
        }

        employerSubscriptionRepository.save(sub);
        log.info("[STRIPE] customer.subscription.updated: employer {} — {} → {}",
                sub.getEmployer().getId(), oldStatus, sub.getStatus());

        String newPackageName = sub.getSubscriptionPackage() != null
                ? sub.getSubscriptionPackage().getName() : "UNKNOWN";
        String oldValue = oldStatus.name() + "|" + oldPackageName;
        String newValue = sub.getStatus().name() + "|" + newPackageName;
        logAudit(AuditAction.SUBSCRIPTION_CHANGED, sub, oldValue, newValue);
    }

    /**
     * customer.subscription.deleted — annulering verwerken en vacatures inactiveren.
     */
    private void handleSubscriptionDeleted(Event event) {
        Subscription stripeSub = deserialize(event, Subscription.class);
        if (stripeSub == null) return;

        EmployerSubscription sub = findOrWarnSubscription(stripeSub.getId(), stripeSub.getCustomer());
        if (sub == null) return;

        SubscriptionStatus oldStatus = sub.getStatus();
        sub.setStatus(SubscriptionStatus.CANCELED);
        sub.setCanceledAt(LocalDateTime.now());
        employerSubscriptionRepository.save(sub);

        // Alle actieve vacatures van de werkgever inactiveren (bulk update)
        Long employerId = sub.getEmployer().getId();
        int deactivatedCount = vacancyRepository.deactivateAllByEmployerId(employerId);
        log.info("[STRIPE] customer.subscription.deleted: employer {} — {} vacatures gedeactiveerd",
                employerId, deactivatedCount);

        logAudit(AuditAction.SUBSCRIPTION_CANCELLED, sub, oldStatus.name(), null);
    }

    /**
     * invoice.paid — activeer of verleng de subscription.
     */
    private void handleInvoicePaid(Event event) {
        Invoice invoice = deserialize(event, Invoice.class);
        if (invoice == null) return;

        String stripeSubscriptionId = invoice.getSubscription();
        if (stripeSubscriptionId == null) {
            log.debug("[STRIPE] invoice.paid zonder subscription ID — eenmalige betaling, overgeslagen");
            return;
        }

        Optional<EmployerSubscription> subOpt =
                employerSubscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId);
        if (subOpt.isEmpty()) {
            // Probeer op customer ID (bijv. als subscription ID nog niet gekoppeld is)
            subOpt = employerSubscriptionRepository.findByStripeCustomerId(invoice.getCustomer());
        }
        if (subOpt.isEmpty()) {
            log.warn("[STRIPE] invoice.paid: geen subscription gevonden voor sub={} customer={}",
                    stripeSubscriptionId, invoice.getCustomer());
            return;
        }

        EmployerSubscription sub = subOpt.get();
        SubscriptionStatus oldStatus = sub.getStatus();

        // Koppel subscription ID als dat er nog niet in stond
        if (sub.getStripeSubscriptionId() == null) {
            sub.setStripeSubscriptionId(stripeSubscriptionId);
        }

        sub.setStatus(SubscriptionStatus.ACTIVE);

        // Periode bijwerken vanuit invoice lines
        if (invoice.getPeriodStart() != null) {
            sub.setCurrentPeriodStart(epochToLocalDateTime(invoice.getPeriodStart()));
        }
        if (invoice.getPeriodEnd() != null) {
            sub.setCurrentPeriodEnd(epochToLocalDateTime(invoice.getPeriodEnd()));
        }

        employerSubscriptionRepository.save(sub);
        log.info("[STRIPE] invoice.paid: employer {} — subscription ACTIEF", sub.getEmployer().getId());

        AuditAction action = (oldStatus == SubscriptionStatus.INACTIVE ||
                              oldStatus == SubscriptionStatus.TRIALING)
                ? AuditAction.SUBSCRIPTION_CREATED
                : AuditAction.SUBSCRIPTION_CHANGED;
        logAudit(action, sub, oldStatus.name(), SubscriptionStatus.ACTIVE.name());
    }

    /**
     * invoice.payment_failed — zet status op PAST_DUE en stuur e-mail.
     * E-mailfout is niet-blokkend.
     */
    private void handleInvoicePaymentFailed(Event event) {
        Invoice invoice = deserialize(event, Invoice.class);
        if (invoice == null) return;

        String stripeSubscriptionId = invoice.getSubscription();
        if (stripeSubscriptionId == null) return;

        Optional<EmployerSubscription> subOpt =
                employerSubscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId);
        if (subOpt.isEmpty()) {
            log.warn("[STRIPE] invoice.payment_failed: geen subscription gevonden voor sub={}",
                    stripeSubscriptionId);
            return;
        }

        EmployerSubscription sub = subOpt.get();
        SubscriptionStatus oldStatus = sub.getStatus();
        sub.setStatus(SubscriptionStatus.PAST_DUE);
        employerSubscriptionRepository.save(sub);

        log.warn("[STRIPE] invoice.payment_failed: employer {} — betaling mislukt",
                sub.getEmployer().getId());

        // E-mail versturen — fout is niet-blokkend
        try {
            Employer employer = sub.getEmployer();
            emailService.sendPaymentFailedEmail(employer.getEmail(), employer.getName());
        } catch (Exception e) {
            log.error("[STRIPE] E-mail betaalmislukking sturen mislukt voor employer {}: {}",
                    sub.getEmployer().getId(), e.getMessage());
        }

        logAudit(AuditAction.SUBSCRIPTION_PAYMENT_FAILED, sub, oldStatus.name(),
                SubscriptionStatus.PAST_DUE.name());
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Deserializeert een Stripe event data-object naar het gevraagde type.
     * Retourneert null bij een deserialisation-probleem (object wordt veilig overgeslagen).
     */
    @SuppressWarnings("unchecked")
    private <T extends StripeObject> T deserialize(Event event, Class<T> clazz) {
        EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();

        StripeObject obj = null;

        if (deserializer.getObject().isPresent()) {
            obj = deserializer.getObject().get();
        } else {
            // Fallback: API-versie mismatch tussen Stripe CLI/account en de SDK.
            // deserializeUnsafe() negeert de versiecheck en deserialiseert het object alsnog.
            // Dit treedt op wanneer de Stripe CLI een nieuwere API-versie gebruikt dan de SDK verwacht.
            log.warn("[STRIPE] Standaard deserialisatie mislukt voor event {} (API-versie mismatch?) — " +
                    "fallback naar deserializeUnsafe()", event.getId());
            try {
                obj = deserializer.deserializeUnsafe();
            } catch (Exception e) {
                log.error("[STRIPE] deserializeUnsafe() mislukt voor event {}: {}", event.getId(), e.getMessage());
                return null;
            }
        }

        if (!clazz.isInstance(obj)) {
            log.warn("[STRIPE] Event-object is geen instantie van {} (event {})", clazz.getSimpleName(), event.getId());
            return null;
        }
        return (T) obj;
    }

    /**
     * Zoekt een EmployerSubscription op basis van Stripe Subscription ID.
     * Valt terug op Stripe Customer ID als het subscription ID niet overeenkomt.
     */
    private EmployerSubscription findOrWarnSubscription(String stripeSubId, String stripeCustomerId) {
        return employerSubscriptionRepository.findByStripeSubscriptionId(stripeSubId)
                .or(() -> employerSubscriptionRepository.findByStripeCustomerId(stripeCustomerId))
                .orElseGet(() -> {
                    log.warn("[STRIPE] Geen EmployerSubscription gevonden voor sub={} customer={}",
                            stripeSubId, stripeCustomerId);
                    return null;
                });
    }

    /**
     * Werkt de gemeenschappelijke subscription-velden bij op basis van een Stripe Subscription object.
     */
    private void updateSubscriptionFields(EmployerSubscription sub, Subscription stripeSub) {
        // Status mappen
        SubscriptionStatus mappedStatus = mapStripeStatus(stripeSub.getStatus());
        sub.setStatus(mappedStatus);

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
        if (stripeSub.getCanceledAt() != null) {
            sub.setCanceledAt(epochToLocalDateTime(stripeSub.getCanceledAt()));
        }

        // cancelAtPeriodEnd bijwerken
        if (stripeSub.getCancelAtPeriodEnd() != null) {
            sub.setCancelAtPeriodEnd(stripeSub.getCancelAtPeriodEnd());
        }

        // Billing interval afleiden uit eerste price item
        if (stripeSub.getItems() != null && !stripeSub.getItems().getData().isEmpty()) {
            String interval = stripeSub.getItems().getData().get(0).getPrice().getRecurring().getInterval();
            sub.setBillingInterval("year".equals(interval) ? BillingInterval.YEARLY : BillingInterval.MONTHLY);
        }

        // Stripe Subscription ID zetten als nog niet aanwezig
        if (sub.getStripeSubscriptionId() == null) {
            sub.setStripeSubscriptionId(stripeSub.getId());
        }
    }

    /**
     * Mapt een Stripe subscription status-string naar het interne SubscriptionStatus enum.
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

    /**
     * Slaat een webhook event op in de idempotency-log.
     * De UNIQUE constraint op stripe_event_id fungeert als database-level vangnet
     * bij race conditions — DataIntegrityViolationException wordt afgevangen in GlobalExceptionHandler.
     */
    private void persistWebhookEvent(String eventId, String eventType, String payload) {
        StripeWebhookEvent webhookEvent = StripeWebhookEvent.builder()
                .stripeEventId(eventId)
                .eventType(eventType)
                .processed(true)
                .processedAt(LocalDateTime.now())
                .payload(payload)
                .build();
        stripeWebhookEventRepository.save(webhookEvent);
    }

    /**
     * Logt een subscription-actie in de admin audit log.
     * Draait in een aparte transactie (REQUIRES_NEW via AdminAuditLogServiceImpl).
     */
    private void logAudit(AuditAction action, EmployerSubscription sub, String oldValue, String newValue) {
        try {
            Long employerId = sub.getEmployer().getId();
            String employerName = sub.getEmployer().getName();
            adminAuditLogService.logAction(
                    SYSTEM_ACTOR_ID,
                    SYSTEM_ACTOR_EMAIL,
                    action,
                    ENTITY_TYPE_SUBSCRIPTION,
                    employerId,
                    employerName,
                    oldValue,
                    newValue
            );
        } catch (Exception e) {
            log.error("[STRIPE] Audit log schrijven mislukt voor actie {}: {}", action, e.getMessage());
        }
    }

    /**
     * Converteert een Unix epoch timestamp (seconden) naar LocalDateTime (UTC).
     */
    private LocalDateTime epochToLocalDateTime(Long epochSeconds) {
        if (epochSeconds == null) return null;
        return LocalDateTime.ofInstant(Instant.ofEpochSecond(epochSeconds), ZoneOffset.UTC);
    }
}
