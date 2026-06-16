package nl.zorgwerkwijzer.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.dto.admin.*;
import nl.zorgwerkwijzer.exception.ResourceNotFoundException;
import nl.zorgwerkwijzer.model.Employer;
import nl.zorgwerkwijzer.model.EmployerCreditTransaction;
import nl.zorgwerkwijzer.model.EmployerSubscription;
import nl.zorgwerkwijzer.model.SubscriptionPackage;
import nl.zorgwerkwijzer.model.SubscriptionStatus;
import nl.zorgwerkwijzer.model.User;
import nl.zorgwerkwijzer.model.UserRole;
import nl.zorgwerkwijzer.model.Vacancy;
import nl.zorgwerkwijzer.model.Profile;
import nl.zorgwerkwijzer.repository.ApplicationRepository;
import nl.zorgwerkwijzer.repository.EmployerCreditTransactionRepository;
import nl.zorgwerkwijzer.repository.EmployerRepository;
import nl.zorgwerkwijzer.repository.EmployerSubscriptionRepository;
import nl.zorgwerkwijzer.repository.ProfileRepository;
import nl.zorgwerkwijzer.repository.UserRepository;
import nl.zorgwerkwijzer.repository.VacancyRepository;
import nl.zorgwerkwijzer.model.AuditAction;
import nl.zorgwerkwijzer.service.AdminAuditLogService;
import nl.zorgwerkwijzer.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final EmployerRepository employerRepository;
    private final VacancyRepository vacancyRepository;
    private final ApplicationRepository applicationRepository;
    private final ProfileRepository profileRepository;
    private final EmployerSubscriptionRepository employerSubscriptionRepository;
    private final EmployerCreditTransactionRepository employerCreditTransactionRepository;
    private final AdminAuditLogService adminAuditLogService;

    // Bundle price lookup (cents) — mirrors VacancyCreditServiceImpl
    private static final java.util.Map<String, Long> BUNDLE_PRICE_CENTS = java.util.Map.of(
            "bundle3", 9900L,
            "bundle5", 14900L
    );

    // ── Statistieken ──────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public AdminStatsDto getStats() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);

        long totalUsers       = userRepository.count();
        long totalCandidates  = userRepository.countByRole(UserRole.ROLE_USER);
        long totalEmployers   = userRepository.countByRole(UserRole.ROLE_EMPLOYER);
        long totalVacancies   = vacancyRepository.count();
        long activeVacancies  = vacancyRepository.countByIsActiveTrue();
        long featuredVacancies = vacancyRepository.countByIsFeaturedTrue();
        long totalApplications = applicationRepository.count();
        long newUsersLast30Days     = userRepository.countByCreatedAtAfter(thirtyDaysAgo);
        long newEmployersLast30Days = userRepository.countByRoleAndCreatedAtAfter(UserRole.ROLE_EMPLOYER, thirtyDaysAgo);

        // Recente werkgevers (laatste 5)
        Pageable recentPageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<AdminEmployerSummaryDto> recentEmployers = employerRepository
                .findAll(recentPageable)
                .stream()
                .map(this::toEmployerSummaryDto)
                .collect(Collectors.toList());

        // Recente vacatures (laatste 5)
        List<AdminVacancySummaryDto> recentVacancies = vacancyRepository
                .findAll(recentPageable)
                .stream()
                .map(this::toVacancySummaryDto)
                .collect(Collectors.toList());

        // ── Subscription statistieken ─────────────────────────────────────────
        long activeSubscriptions = employerSubscriptionRepository.countByStatusIn(
                List.of(SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING));
        long trialingCount = employerSubscriptionRepository.countByStatusIn(
                List.of(SubscriptionStatus.TRIALING));
        long pastDueCount = employerSubscriptionRepository.countByStatusIn(
                List.of(SubscriptionStatus.PAST_DUE));

        List<EmployerSubscription> recentCancellationsSubs =
                employerSubscriptionRepository.findByCanceledAtAfter(thirtyDaysAgo);
        long canceledLast30DaysCount = recentCancellationsSubs.size();

        // subscriptionsByPackage: count per pakket naam
        List<EmployerSubscription> allSubs = employerSubscriptionRepository.findAll();
        Map<String, Long> subscriptionsByPackage = allSubs.stream()
                .filter(s -> s.getSubscriptionPackage() != null)
                .collect(Collectors.groupingBy(
                        s -> s.getSubscriptionPackage().getName(),
                        Collectors.counting()));

        // MRR: som van maandelijkse bijdragen van ACTIVE subscriptions
        // YEARLY billing: priceYearly / 12
        long mrr = allSubs.stream()
                .filter(s -> s.getStatus() == SubscriptionStatus.ACTIVE
                          || s.getStatus() == SubscriptionStatus.TRIALING)
                .filter(s -> s.getSubscriptionPackage() != null)
                .mapToLong(s -> {
                    SubscriptionPackage pkg = s.getSubscriptionPackage();
                    if (s.getBillingInterval() != null
                            && "YEARLY".equals(s.getBillingInterval().name())
                            && pkg.getPriceYearly() != null) {
                        return pkg.getPriceYearly() / 12L;
                    }
                    return pkg.getPriceMonthly() != null ? pkg.getPriceMonthly() : 0L;
                })
                .sum();
        long arr = mrr * 12;

        // mrrByPackage: MRR-bijdrage per pakket naam
        Map<String, Long> mrrByPackage = allSubs.stream()
                .filter(s -> s.getStatus() == SubscriptionStatus.ACTIVE
                          || s.getStatus() == SubscriptionStatus.TRIALING)
                .filter(s -> s.getSubscriptionPackage() != null)
                .collect(Collectors.groupingBy(
                        s -> s.getSubscriptionPackage().getName(),
                        Collectors.summingLong(s -> {
                            SubscriptionPackage pkg = s.getSubscriptionPackage();
                            if (s.getBillingInterval() != null
                                    && "YEARLY".equals(s.getBillingInterval().name())
                                    && pkg.getPriceYearly() != null) {
                                return pkg.getPriceYearly() / 12L;
                            }
                            return pkg.getPriceMonthly() != null ? pkg.getPriceMonthly() : 0L;
                        })));

        List<AdminSubscriptionDto> pastDueSubscriptions =
                employerSubscriptionRepository.findByStatus(SubscriptionStatus.PAST_DUE)
                        .stream().map(this::toAdminSubscriptionDto).collect(Collectors.toList());

        List<AdminSubscriptionDto> recentCancellations =
                recentCancellationsSubs.stream()
                        .map(this::toAdminSubscriptionDto).collect(Collectors.toList());

        // ── Credit omzet ──────────────────────────────────────────────────────
        List<EmployerCreditTransaction> allPurchases = employerCreditTransactionRepository.findAllPurchases();
        long creditRevenue = allPurchases.stream()
                .mapToLong(t -> BUNDLE_PRICE_CENTS.getOrDefault(t.getBundleType(), 0L))
                .sum();
        long totalCreditsSold = allPurchases.stream()
                .mapToLong(t -> t.getCreditsAdded() != null ? t.getCreditsAdded() : 0)
                .sum();
        Map<String, Long> creditsByBundle = allPurchases.stream()
                .filter(t -> t.getBundleType() != null)
                .collect(Collectors.groupingBy(
                        EmployerCreditTransaction::getBundleType,
                        Collectors.summingLong(t -> t.getCreditsAdded() != null ? t.getCreditsAdded() : 0)));
        Map<String, Long> creditRevenueByBundle = allPurchases.stream()
                .filter(t -> t.getBundleType() != null)
                .collect(Collectors.groupingBy(
                        EmployerCreditTransaction::getBundleType,
                        Collectors.summingLong(t -> BUNDLE_PRICE_CENTS.getOrDefault(t.getBundleType(), 0L))));

        // ── Subscription lifetime omzet (som van alle betaalde periodes) ──────
        // Benadering: actieve + geannuleerde subs × hun maandprijs × maanden actief
        // Eenvoudige benadering: som van maandprijzen van alle subs × 1 (minimaal 1 maand)
        long subscriptionRevenue = allSubs.stream()
                .filter(s -> s.getSubscriptionPackage() != null)
                .mapToLong(s -> {
                    SubscriptionPackage pkg = s.getSubscriptionPackage();
                    if (s.getBillingInterval() != null
                            && "YEARLY".equals(s.getBillingInterval().name())
                            && pkg.getPriceYearly() != null) {
                        return pkg.getPriceYearly();
                    }
                    return pkg.getPriceMonthly() != null ? pkg.getPriceMonthly() : 0L;
                })
                .sum();
        long lifetimeRevenue = subscriptionRevenue + creditRevenue;

        // ── Maandomzet ────────────────────────────────────────────────────────
        LocalDateTime startOfThisMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime startOfPrevMonth = startOfThisMonth.minusMonths(1);
        LocalDateTime endOfPrevMonth   = startOfThisMonth.minusNanos(1);

        List<EmployerCreditTransaction> purchasesThisMonth = employerCreditTransactionRepository
                .findPurchasesBetween(startOfThisMonth, LocalDateTime.now());
        List<EmployerCreditTransaction> purchasesPrevMonth = employerCreditTransactionRepository
                .findPurchasesBetween(startOfPrevMonth, endOfPrevMonth);

        long creditRevenueThisMonth = purchasesThisMonth.stream()
                .mapToLong(t -> BUNDLE_PRICE_CENTS.getOrDefault(t.getBundleType(), 0L)).sum();
        long creditRevenuePrevMonth = purchasesPrevMonth.stream()
                .mapToLong(t -> BUNDLE_PRICE_CENTS.getOrDefault(t.getBundleType(), 0L)).sum();

        // Subscription omzet deze maand = MRR (lopende maand bijdrage)
        long revenueThisMonth = mrr + creditRevenueThisMonth;
        long revenuePrevMonth = mrr + creditRevenuePrevMonth;

        // ── Gemiddelde omzet per werkgever ────────────────────────────────────
        long avgRevenuePerEmployer = totalEmployers > 0 ? lifetimeRevenue / totalEmployers : 0L;

        // ── cancelAtPeriodEnd count ───────────────────────────────────────────
        long cancelAtPeriodEndCount = allSubs.stream()
                .filter(EmployerSubscription::isCancelAtPeriodEnd)
                .count();

        return AdminStatsDto.builder()
                .totalUsers(totalUsers)
                .totalCandidates(totalCandidates)
                .totalEmployers(totalEmployers)
                .newUsersLast30Days(newUsersLast30Days)
                .newEmployersLast30Days(newEmployersLast30Days)
                .totalVacancies(totalVacancies)
                .activeVacancies(activeVacancies)
                .featuredVacancies(featuredVacancies)
                .totalApplications(totalApplications)
                .activeSubscriptions(activeSubscriptions)
                .trialingCount(trialingCount)
                .pastDueCount(pastDueCount)
                .canceledLast30DaysCount(canceledLast30DaysCount)
                .subscriptionsByPackage(subscriptionsByPackage)
                .mrr(mrr)
                .arr(arr)
                .mrrByPackage(mrrByPackage)
                .subscriptionRevenue(subscriptionRevenue)
                .creditRevenue(creditRevenue)
                .lifetimeRevenue(lifetimeRevenue)
                .revenueThisMonth(revenueThisMonth)
                .revenuePrevMonth(revenuePrevMonth)
                .avgRevenuePerEmployer(avgRevenuePerEmployer)
                .cancelAtPeriodEndCount(cancelAtPeriodEndCount)
                .totalCreditsSold(totalCreditsSold)
                .creditsByBundle(creditsByBundle)
                .creditRevenueByBundle(creditRevenueByBundle)
                .recentEmployers(recentEmployers)
                .recentVacancies(recentVacancies)
                .pastDueSubscriptions(pastDueSubscriptions)
                .recentCancellations(recentCancellations)
                .build();
    }

    // ── Gebruikers ────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public Page<AdminUserDto> getUsers(String q, UserRole role, Pageable pageable) {
        boolean hasQuery = StringUtils.hasText(q);
        boolean hasRole  = role != null;

        Page<User> users;
        if (hasQuery && hasRole) {
            users = userRepository.findByEmailContainingIgnoreCaseAndRole(q, role, pageable);
        } else if (hasQuery) {
            users = userRepository.findByEmailContainingIgnoreCase(q, pageable);
        } else if (hasRole) {
            users = userRepository.findByRole(role, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }

        return users.map(this::toAdminUserDto);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminUserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gebruiker niet gevonden met id: " + id));
        return toAdminUserDto(user);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gebruiker niet gevonden met id: " + id));

        // Self-delete blokkering: admin mag zijn eigen account niet verwijderen
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        if (user.getEmail().equalsIgnoreCase(currentEmail)) {
            throw new IllegalArgumentException("Je kunt je eigen account niet verwijderen");
        }

        // Admin-accounts kunnen nooit verwijderd worden
        if (user.getRole() == UserRole.ROLE_ADMIN) {
            throw new IllegalArgumentException("Admin-accounts kunnen niet worden verwijderd via het dashboard");
        }

        // AVG: profiel + sollicitaties + opgeslagen vacatures meeverwijderen
        profileRepository.findByEmail(user.getEmail()).ifPresent(profile -> {
            profileRepository.delete(profile);
            log.info("Admin cascade-deleted profile for user id={} email={}", id, user.getEmail());
        });
        userRepository.delete(user);
        log.info("Admin deleted user id={} email={}", id, user.getEmail());
        userRepository.findByEmail(currentEmail).ifPresent(admin ->
                adminAuditLogService.logAction(
                        admin.getId(), currentEmail,
                        AuditAction.USER_DELETED,
                        "USER", id, user.getEmail(),
                        user.getRole().name(), null
                )
        );
    }

    // ── Werkgevers ────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public Page<AdminEmployerDto> getEmployers(String q, Pageable pageable) {
        Page<Employer> employers;
        if (StringUtils.hasText(q)) {
            employers = employerRepository
                    .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(q, q, pageable);
        } else {
            employers = employerRepository.findAll(pageable);
        }
        return employers.map(this::toAdminEmployerDto);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminEmployerDetailDto getEmployerById(Long id) {
        Employer employer = employerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Werkgever niet gevonden met id: " + id));

        // Vacatures van deze werkgever (max 50, gesorteerd op aanmaakdatum)
        Pageable vacancyPageable = PageRequest.of(0, 50, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<AdminVacancySummaryDto> vacancies = vacancyRepository
                .findAllByEmployerId(id, vacancyPageable)
                .stream()
                .map(this::toVacancySummaryDto)
                .collect(Collectors.toList());

        // Gekoppelde gebruikers
        List<AdminUserDto> linkedUsers = userRepository.findByEmployerId(id)
                .stream()
                .map(this::toAdminUserDto)
                .collect(Collectors.toList());

        return AdminEmployerDetailDto.builder()
                .id(employer.getId())
                .name(employer.getName())
                .email(employer.getEmail())
                .slug(employer.getSlug())
                .phoneNumber(employer.getPhoneNumber())
                .address(employer.getAddress())
                .city(employer.getCity())
                .province(employer.getProvince())
                .postalCode(employer.getPostalCode())
                .websiteUrl(employer.getWebsiteUrl())
                .logoUrl(employer.getLogoUrl())
                .employeeCount(employer.getEmployeeCount())
                .foundedYear(employer.getFoundedYear())
                .createdAt(employer.getCreatedAt())
                // Subscription velden — worden ingevuld zodra Stripe/subscription fase live is
                .subscriptionStatus(null)
                .packageName(null)
                .packageDisplayName(null)
                .billingInterval(null)
                .stripeCustomerId(null)
                .stripeSubscriptionId(null)
                .currentPeriodStart(null)
                .currentPeriodEnd(null)
                .canceledAt(null)
                .vacancies(vacancies)
                .linkedUsers(linkedUsers)
                .build();
    }

    // ── Vacatures ─────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public Page<AdminVacancyDto> getVacancies(String q, Boolean isActive, Boolean isFeatured, Pageable pageable) {
        boolean hasQuery      = StringUtils.hasText(q);
        boolean hasActive     = isActive != null;
        boolean hasFeatured   = isFeatured != null;

        Page<Vacancy> vacancies;
        if (hasQuery && hasActive && hasFeatured) {
            vacancies = vacancyRepository
                    .findByTitleContainingIgnoreCaseAndIsActiveAndIsFeatured(q, isActive, isFeatured, pageable);
        } else if (hasQuery && hasActive) {
            vacancies = vacancyRepository
                    .findByTitleContainingIgnoreCaseAndIsActive(q, isActive, pageable);
        } else if (hasQuery && hasFeatured) {
            vacancies = vacancyRepository
                    .findByTitleContainingIgnoreCaseAndIsFeatured(q, isFeatured, pageable);
        } else if (hasActive && hasFeatured) {
            vacancies = vacancyRepository.findByIsActiveAndIsFeatured(isActive, isFeatured, pageable);
        } else if (hasQuery) {
            vacancies = vacancyRepository.findByTitleContainingIgnoreCase(q, pageable);
        } else if (hasActive) {
            vacancies = vacancyRepository.findByIsActive(isActive, pageable);
        } else if (hasFeatured) {
            vacancies = vacancyRepository.findByIsFeatured(isFeatured, pageable);
        } else {
            vacancies = vacancyRepository.findAll(pageable);
        }

        return vacancies.map(this::toAdminVacancyDto);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminVacancyDetailDto getVacancyById(Long id) {
        Vacancy vacancy = vacancyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vacature niet gevonden met id: " + id));
        long applicationCount = applicationRepository.countByVacancyId(vacancy.getId());
        Employer employer = vacancy.getEmployer();
        return AdminVacancyDetailDto.builder()
                .id(vacancy.getId())
                .title(vacancy.getTitle())
                .slug(vacancy.getSlug())
                .description(vacancy.getDescription())
                .requirements(vacancy.getRequirements())
                .employerId(employer != null ? employer.getId() : null)
                .employerName(employer != null ? employer.getName() : "Onbekend")
                .employerSlug(employer != null ? employer.getSlug() : null)
                .employerEmail(employer != null ? employer.getEmail() : null)
                .cityId(vacancy.getCityId())
                .occupationId(vacancy.getOccupationId())
                .employmentType(vacancy.getEmploymentType())
                .educationLevel(vacancy.getEducationLevel())
                .salaryMin(vacancy.getSalaryMin())
                .salaryMax(vacancy.getSalaryMax())
                .hoursMin(vacancy.getHoursMin())
                .hoursMax(vacancy.getHoursMax())
                .isActive(vacancy.getIsActive())
                .isFeatured(vacancy.getIsFeatured())
                .seoTitle(vacancy.getSeoTitle())
                .seoDescription(vacancy.getSeoDescription())
                .applicationCount(applicationCount)
                .publishedAt(vacancy.getPublishedAt())
                .expiresAt(vacancy.getExpiresAt())
                .createdAt(vacancy.getCreatedAt())
                .updatedAt(vacancy.getUpdatedAt())
                .build();
    }

    @Override
    public AdminVacancyDto toggleVacancyFeatured(Long id) {
        Vacancy vacancy = vacancyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vacature niet gevonden met id: " + id));
        boolean oldFeatured = vacancy.getIsFeatured();
        vacancy.setIsFeatured(!oldFeatured);
        Vacancy saved = vacancyRepository.save(vacancy);
        log.info("Admin toggled featured for vacancy id={} isFeatured={}", id, saved.getIsFeatured());
        String featuredEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        userRepository.findByEmail(featuredEmail).ifPresent(admin ->
                adminAuditLogService.logAction(
                        admin.getId(), featuredEmail,
                        saved.getIsFeatured() ? AuditAction.VACANCY_FEATURED_ON : AuditAction.VACANCY_FEATURED_OFF,
                        "VACANCY", id, vacancy.getTitle(),
                        String.valueOf(oldFeatured), String.valueOf(saved.getIsFeatured())
                )
        );
        return toAdminVacancyDto(saved);
    }

    @Override
    public AdminVacancyDto toggleVacancyActive(Long id) {
        Vacancy vacancy = vacancyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vacature niet gevonden met id: " + id));
        boolean oldActive = vacancy.getIsActive();
        vacancy.setIsActive(!oldActive);
        Vacancy saved = vacancyRepository.save(vacancy);
        log.info("Admin toggled active for vacancy id={} isActive={}", id, saved.getIsActive());
        String activeEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        userRepository.findByEmail(activeEmail).ifPresent(admin ->
                adminAuditLogService.logAction(
                        admin.getId(), activeEmail,
                        saved.getIsActive() ? AuditAction.VACANCY_ACTIVE_ON : AuditAction.VACANCY_ACTIVE_OFF,
                        "VACANCY", id, vacancy.getTitle(),
                        String.valueOf(oldActive), String.valueOf(saved.getIsActive())
                )
        );
        return toAdminVacancyDto(saved);
    }

    @Override
    public void deleteVacancy(Long id) {
        Vacancy vacancy = vacancyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vacature niet gevonden met id: " + id));
        vacancyRepository.delete(vacancy);
        log.info("Admin deleted vacancy id={} title={}", id, vacancy.getTitle());
        String vacEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        userRepository.findByEmail(vacEmail).ifPresent(admin ->
                adminAuditLogService.logAction(
                        admin.getId(), vacEmail,
                        AuditAction.VACANCY_DELETED,
                        "VACANCY", id, vacancy.getTitle(),
                        vacancy.getIsActive() != null ? vacancy.getIsActive().toString() : null, null
                )
        );
    }

    // ── Mapping helpers ───────────────────────────────────────────────────────

    private AdminUserDto toAdminUserDto(User user) {
        String employerName = null;
        boolean isLastEmployerUser = false;
        if (user.getEmployerId() != null) {
            employerName = employerRepository.findById(user.getEmployerId())
                    .map(Employer::getName)
                    .orElse(null);
            isLastEmployerUser = userRepository.countByEmployerId(user.getEmployerId()) == 1;
        }
        return AdminUserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .employerId(user.getEmployerId())
                .employerName(employerName)
                .createdAt(user.getCreatedAt())
                .isLastEmployerUser(isLastEmployerUser)
                .build();
    }

    private AdminEmployerDto toAdminEmployerDto(Employer employer) {
        long activeVacancyCount = vacancyRepository.countByEmployerIdAndIsActiveTrue(employer.getId());
        return AdminEmployerDto.builder()
                .id(employer.getId())
                .name(employer.getName())
                .email(employer.getEmail())
                .slug(employer.getSlug())
                .city(employer.getCity())
                .subscriptionStatus(null)
                .packageName(null)
                .activeVacancyCount(activeVacancyCount)
                .createdAt(employer.getCreatedAt())
                .build();
    }

    private AdminEmployerSummaryDto toEmployerSummaryDto(Employer employer) {
        return AdminEmployerSummaryDto.builder()
                .id(employer.getId())
                .name(employer.getName())
                .slug(employer.getSlug())
                .subscriptionStatus(null)
                .createdAt(employer.getCreatedAt())
                .build();
    }

    private AdminVacancyDto toAdminVacancyDto(Vacancy vacancy) {
        long applicationCount = applicationRepository.countByVacancyId(vacancy.getId());
        Employer employer = vacancy.getEmployer();
        return AdminVacancyDto.builder()
                .id(vacancy.getId())
                .title(vacancy.getTitle())
                .slug(vacancy.getSlug())
                .employerId(employer != null ? employer.getId() : null)
                .employerName(employer != null ? employer.getName() : "Onbekend")
                .isActive(vacancy.getIsActive())
                .isFeatured(vacancy.getIsFeatured())
                .applicationCount(applicationCount)
                .publishedAt(vacancy.getPublishedAt())
                .expiresAt(vacancy.getExpiresAt())
                .createdAt(vacancy.getCreatedAt())
                .build();
    }

    private AdminVacancySummaryDto toVacancySummaryDto(Vacancy vacancy) {
        Employer emp = vacancy.getEmployer();
        return AdminVacancySummaryDto.builder()
                .id(vacancy.getId())
                .title(vacancy.getTitle())
                .slug(vacancy.getSlug())
                .employerName(emp != null ? emp.getName() : "Onbekend")
                .isActive(vacancy.getIsActive())
                .isFeatured(vacancy.getIsFeatured())
                .publishedAt(vacancy.getPublishedAt())
                .build();
    }

    // ── Abonnementen ──────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public Page<AdminSubscriptionDto> getSubscriptions(String status, Long packageId,
                                                        Boolean canceledLast30Days,
                                                        Pageable pageable) {
        if (Boolean.TRUE.equals(canceledLast30Days)) {
            // Retourneer recente annuleringen gesorteerd op canceledAt DESC
            LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
            List<EmployerSubscription> list = employerSubscriptionRepository
                    .findByCanceledAtAfter(thirtyDaysAgo);
            // Handmatig pagineren
            int start = (int) pageable.getOffset();
            int end = Math.min(start + pageable.getPageSize(), list.size());
            List<AdminSubscriptionDto> content = (start < list.size())
                    ? list.subList(start, end).stream().map(this::toAdminSubscriptionDto).collect(Collectors.toList())
                    : Collections.emptyList();
            return new org.springframework.data.domain.PageImpl<>(content, pageable, list.size());
        }

        Page<EmployerSubscription> page;
        if (StringUtils.hasText(status) && packageId != null) {
            SubscriptionStatus statusEnum = SubscriptionStatus.valueOf(status);
            page = employerSubscriptionRepository
                    .findByStatusAndSubscriptionPackageId(statusEnum, packageId, pageable);
        } else if (StringUtils.hasText(status)) {
            SubscriptionStatus statusEnum = SubscriptionStatus.valueOf(status);
            page = employerSubscriptionRepository.findByStatus(statusEnum, pageable);
        } else if (packageId != null) {
            page = employerSubscriptionRepository.findBySubscriptionPackageId(packageId, pageable);
        } else {
            page = employerSubscriptionRepository.findAll(pageable);
        }
        return page.map(this::toAdminSubscriptionDto);
    }

    private AdminSubscriptionDto toAdminSubscriptionDto(EmployerSubscription sub) {
        nl.zorgwerkwijzer.model.Employer employer = sub.getEmployer();
        SubscriptionPackage pkg = sub.getSubscriptionPackage();

        // Lifetime omzet per werkgever: subscription + credits
        long subRevenue = 0L;
        if (pkg != null) {
            if (sub.getBillingInterval() != null
                    && "YEARLY".equals(sub.getBillingInterval().name())
                    && pkg.getPriceYearly() != null) {
                subRevenue = pkg.getPriceYearly();
            } else if (pkg.getPriceMonthly() != null) {
                subRevenue = pkg.getPriceMonthly();
            }
        }
        long creditRev = 0L;
        if (employer != null) {
            creditRev = employerCreditTransactionRepository.findByEmployerId(employer.getId())
                    .stream()
                    .filter(t -> t.getCreditsAdded() != null && t.getCreditsAdded() > 0)
                    .mapToLong(t -> BUNDLE_PRICE_CENTS.getOrDefault(t.getBundleType(), 0L))
                    .sum();
        }

        return AdminSubscriptionDto.builder()
                .id(sub.getId())
                .employerId(employer != null ? employer.getId() : null)
                .employerName(employer != null ? employer.getName() : "Onbekend")
                .employerEmail(employer != null ? employer.getEmail() : null)
                .packageName(pkg != null ? pkg.getName() : null)
                .packageDisplayName(pkg != null ? pkg.getDisplayName() : null)
                .priceMonthly(pkg != null ? pkg.getPriceMonthly() : null)
                .priceYearly(pkg != null ? pkg.getPriceYearly() : null)
                .status(sub.getStatus() != null ? sub.getStatus().name() : null)
                .billingInterval(sub.getBillingInterval() != null ? sub.getBillingInterval().name() : null)
                .currentPeriodEnd(sub.getCurrentPeriodEnd())
                .canceledAt(sub.getCanceledAt())
                .trialEnd(sub.getTrialEnd())
                .stripeSubscriptionId(sub.getStripeSubscriptionId())
                .stripeCustomerId(sub.getStripeCustomerId())
                .createdAt(sub.getCreatedAt())
                .cancelAtPeriodEnd(sub.isCancelAtPeriodEnd())
                .lifetimeRevenue(subRevenue + creditRev)
                .build();
    }
}
