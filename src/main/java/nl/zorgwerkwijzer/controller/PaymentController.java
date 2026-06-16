package nl.zorgwerkwijzer.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.dto.VacancyCreditCheckoutRequest;
import nl.zorgwerkwijzer.dto.VacancyCreditStatusDto;
import nl.zorgwerkwijzer.exception.ResourceNotFoundException;
import nl.zorgwerkwijzer.model.Employer;
import nl.zorgwerkwijzer.repository.EmployerRepository;
import nl.zorgwerkwijzer.repository.UserRepository;
import nl.zorgwerkwijzer.service.VacancyCreditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final VacancyCreditService vacancyCreditService;
    private final EmployerRepository employerRepository;
    private final UserRepository userRepository;

    /**
     * Maakt een Stripe Checkout sessie aan voor eenmalige vacaturecredits.
     *
     * POST /api/v1/payments/vacancy-credit-checkout
     * Body: { "bundleType": "single|bundle3|bundle5" }
     */
    @PostMapping("/vacancy-credit-checkout")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<Map<String, String>> createVacancyCreditCheckout(
            @Valid @RequestBody VacancyCreditCheckoutRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        Employer employer = employerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Werkgever niet gevonden voor e-mail: " + email));

        String checkoutUrl = vacancyCreditService.createCreditCheckoutSession(
                employer.getId(),
                employer.getEmail(),
                request.getBundleType()
        );

        log.info("[PAYMENT] Vacancy credit checkout aangemaakt voor werkgever {} (bundleType={}).",
                employer.getId(), request.getBundleType());

        return ResponseEntity.ok(Map.of("checkoutUrl", checkoutUrl));
    }

    /**
     * Geeft de huidige credit-status terug voor de ingelogde werkgever.
     *
     * GET /api/v1/payments/vacancy-credits
     */
    @GetMapping("/vacancy-credits")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<VacancyCreditStatusDto> getVacancyCreditStatus(
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        Employer employer = employerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Werkgever niet gevonden voor e-mail: " + email));

        VacancyCreditStatusDto status = vacancyCreditService.getCreditStatus(employer.getId());
        return ResponseEntity.ok(status);
    }
}
