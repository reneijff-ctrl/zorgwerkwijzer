package nl.zorgwerkwijzer.service.impl;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.config.FrontendProperties;
import nl.zorgwerkwijzer.config.StripeProperties;
import nl.zorgwerkwijzer.dto.CreditTransactionDto;
import nl.zorgwerkwijzer.dto.VacancyCreditStatusDto;
import nl.zorgwerkwijzer.exception.ResourceNotFoundException;
import nl.zorgwerkwijzer.model.Employer;
import nl.zorgwerkwijzer.model.EmployerCreditTransaction;
import nl.zorgwerkwijzer.repository.EmployerCreditTransactionRepository;
import nl.zorgwerkwijzer.repository.EmployerRepository;
import nl.zorgwerkwijzer.service.VacancyCreditService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class VacancyCreditServiceImpl implements VacancyCreditService {

    private static final Map<String, Integer> BUNDLE_CREDITS = Map.of(
            "single",  1,
            "bundle3", 3,
            "bundle5", 5
    );

    private static final Map<String, Long> BUNDLE_PRICE_CENTS = Map.of(
            "single",  3900L,
            "bundle3", 9900L,
            "bundle5", 14900L
    );

    private static final Map<String, String> BUNDLE_LABEL = Map.of(
            "single",  "1 vacature plaatsing",
            "bundle3", "3 vacature plaatsingen bundel",
            "bundle5", "5 vacature plaatsingen bundel"
    );

    private final EmployerRepository employerRepository;
    private final EmployerCreditTransactionRepository creditTransactionRepository;
    private final FrontendProperties frontendProperties;
    private final StripeProperties stripeProperties;

    @Override
    @Transactional(readOnly = true)
    public VacancyCreditStatusDto getCreditStatus(Long employerId) {
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new ResourceNotFoundException("Werkgever niet gevonden: " + employerId));

        List<CreditTransactionDto> transactions = creditTransactionRepository
                .findTop10ByEmployerIdOrderByCreatedAtDesc(employerId)
                .stream()
                .map(t -> new CreditTransactionDto(
                        t.getId(),
                        t.getCreditsAdded(),
                        t.getCreditsUsed(),
                        t.getReason(),
                        t.getBundleType(),
                        t.getCreatedAt()))
                .collect(Collectors.toList());

        return new VacancyCreditStatusDto(
                employer.getVacancyCredits() != null ? employer.getVacancyCredits() : 0,
                transactions
        );
    }

    @Override
    @Transactional
    public void addCredits(Long employerId, String bundleType, String stripePaymentIntent) {
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new ResourceNotFoundException("Werkgever niet gevonden: " + employerId));

        int creditsToAdd = BUNDLE_CREDITS.getOrDefault(bundleType, 0);
        if (creditsToAdd == 0) {
            log.warn("[CREDITS] Onbekend bundleType '{}' voor werkgever {}. Geen credits toegevoegd.",
                    bundleType, employerId);
            return;
        }

        int currentCredits = employer.getVacancyCredits() != null ? employer.getVacancyCredits() : 0;
        employer.setVacancyCredits(currentCredits + creditsToAdd);
        employerRepository.save(employer);

        // Audit trail aanmaken
        EmployerCreditTransaction tx = new EmployerCreditTransaction();
        tx.setEmployer(employer);
        tx.setCreditsAdded(creditsToAdd);
        tx.setCreditsUsed(0);
        tx.setReason(BUNDLE_LABEL.getOrDefault(bundleType, "Bundel gekocht"));
        tx.setStripePaymentIntent(stripePaymentIntent);
        tx.setBundleType(bundleType);
        creditTransactionRepository.save(tx);

        log.info("[CREDITS] +{} credits toegevoegd aan werkgever {} (bundleType={}, paymentIntent={}). Totaal: {}",
                creditsToAdd, employerId, bundleType, stripePaymentIntent,
                employer.getVacancyCredits());
    }

    @Override
    @Transactional
    public void deductCredit(Long employerId) {
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new ResourceNotFoundException("Werkgever niet gevonden: " + employerId));

        int currentCredits = employer.getVacancyCredits() != null ? employer.getVacancyCredits() : 0;
        if (currentCredits <= 0) {
            throw new IllegalStateException(
                    "Geen vacaturecredits beschikbaar. Koop eerst een vacatureplaatsing of activeer een abonnement.");
        }

        employer.setVacancyCredits(currentCredits - 1);
        employerRepository.save(employer);

        // Audit trail
        EmployerCreditTransaction tx = new EmployerCreditTransaction();
        tx.setEmployer(employer);
        tx.setCreditsAdded(0);
        tx.setCreditsUsed(1);
        tx.setReason("Vacature geplaatst via credit");
        tx.setBundleType(null);
        creditTransactionRepository.save(tx);

        log.info("[CREDITS] -1 credit afgetrokken van werkgever {}. Resterend: {}",
                employerId, employer.getVacancyCredits());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasCredits(Long employerId) {
        return employerRepository.findById(employerId)
                .map(e -> e.getVacancyCredits() != null && e.getVacancyCredits() > 0)
                .orElse(false);
    }

    @Override
    public String createCreditCheckoutSession(Long employerId, String employerEmail, String bundleType) {
        Long priceCents = BUNDLE_PRICE_CENTS.get(bundleType);
        String label = BUNDLE_LABEL.get(bundleType);

        if (priceCents == null) {
            throw new IllegalArgumentException(
                    "Ongeldig bundleType: " + bundleType + ". Kies uit: single, bundle3, bundle5");
        }

        String stripeKey = stripeProperties.getSecretKey();
        if (stripeKey == null || stripeKey.isBlank()) {
            throw new IllegalStateException(
                    "Stripe secret key is niet geconfigureerd. Stel STRIPE_SECRET_KEY in.");
        }
        com.stripe.Stripe.apiKey = stripeKey;

        String successUrl = frontendProperties.getUrl()
                + "/dashboard/abonnement?credits_success=true&bundle=" + bundleType;
        String cancelUrl = frontendProperties.getUrl() + "/dashboard/abonnement";

        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setCustomerEmail(employerEmail)
                    .setSuccessUrl(successUrl)
                    .setCancelUrl(cancelUrl)
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("eur")
                                                    .setUnitAmount(priceCents)
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName(label)
                                                                    .setDescription("ZorgWerkwijzer vacatureplaatsing — 60 dagen online")
                                                                    .build())
                                                    .build())
                                    .build())
                    .putMetadata("type", "vacancy_credits")
                    .putMetadata("bundleType", bundleType)
                    .putMetadata("employerId", String.valueOf(employerId))
                    .build();

            Session session = Session.create(params);
            log.info("[CREDITS] Stripe Checkout sessie aangemaakt voor werkgever {} (bundleType={}): {}",
                    employerId, bundleType, session.getId());
            return session.getUrl();

        } catch (StripeException e) {
            log.error("[CREDITS] Stripe Checkout aanmaken mislukt voor werkgever {}: {}", employerId, e.getMessage());
            throw new IllegalStateException("Stripe checkout kon niet worden aangemaakt: " + e.getMessage(), e);
        }
    }
}
