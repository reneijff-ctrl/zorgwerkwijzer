package nl.zorgwerkwijzer.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.dto.UserDto;
import nl.zorgwerkwijzer.dto.dashboard.DashboardApplicationDto;
import nl.zorgwerkwijzer.dto.dashboard.DashboardVacancyCreateRequest;
import nl.zorgwerkwijzer.dto.dashboard.DashboardVacancyDto;
import nl.zorgwerkwijzer.dto.dashboard.VacancyDeleteResultDto;
import nl.zorgwerkwijzer.dto.dashboard.LinkEmployerRequest;
import nl.zorgwerkwijzer.exception.ResourceNotFoundException;
import nl.zorgwerkwijzer.model.Application;
import nl.zorgwerkwijzer.model.ApplicationStatus;
import nl.zorgwerkwijzer.model.Employer;
import nl.zorgwerkwijzer.model.Profile;
import nl.zorgwerkwijzer.model.User;
import nl.zorgwerkwijzer.model.UserRole;
import nl.zorgwerkwijzer.model.Vacancy;
import nl.zorgwerkwijzer.repository.ApplicationRepository;
import nl.zorgwerkwijzer.repository.EmployerRepository;
import nl.zorgwerkwijzer.repository.UserRepository;
import nl.zorgwerkwijzer.repository.VacancyRepository;
import nl.zorgwerkwijzer.service.AuditService;
import nl.zorgwerkwijzer.service.EmailService;
import nl.zorgwerkwijzer.service.EmployerDashboardService;
import nl.zorgwerkwijzer.service.SubscriptionService;
import nl.zorgwerkwijzer.service.VacancyCreditService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EmployerDashboardServiceImpl implements EmployerDashboardService {

    private final UserRepository userRepository;
    private final EmployerRepository employerRepository;
    private final VacancyRepository vacancyRepository;
    private final ApplicationRepository applicationRepository;
    private final EmailService emailService;
    private final AuditService auditService;
    private final SubscriptionService subscriptionService;
    private final VacancyCreditService vacancyCreditService;

    @Override
    public UserDto linkEmployer(Long userId, LinkEmployerRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Gebruiker niet gevonden met id: " + userId));

        Employer employer = employerRepository.findById(request.getEmployerId())
                .orElseThrow(() -> new ResourceNotFoundException("Werkgever niet gevonden met id: " + request.getEmployerId()));

        user.setEmployerId(employer.getId());
        user.setRole(UserRole.ROLE_EMPLOYER);
        User saved = userRepository.save(user);

        return toUserDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DashboardVacancyDto> getMyVacancies(String email, Pageable pageable) {
        Long employerId = resolveEmployerId(email);
        return vacancyRepository.findAllByEmployerId(employerId, pageable)
                .map(v -> toDashboardVacancyDto(v, applicationRepository.countByVacancyId(v.getId())));
    }

    @Override
    public DashboardVacancyDto createVacancy(String email, DashboardVacancyCreateRequest request) {
        Long employerId = resolveEmployerId(email);
        // Controleer abonnement OF credits — bij credits: true teruggegeven
        boolean useCredits = subscriptionService.checkVacancyLimitOrCreditsAvailable(employerId);
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new ResourceNotFoundException("Werkgever niet gevonden met id: " + employerId));
        validateSalaryAndHours(request);

        String slug = resolveSlug(request.getSlug(), request.getTitle());
        if (vacancyRepository.existsBySlug(slug)) {
            throw new IllegalArgumentException("Slug is al in gebruik: " + slug);
        }

        Vacancy vacancy = new Vacancy();
        vacancy.setEmployer(employer);
        vacancy.setCityId(request.getCityId());
        vacancy.setOccupationId(request.getOccupationId());
        vacancy.setTitle(request.getTitle());
        vacancy.setSlug(slug);
        vacancy.setDescription(request.getDescription());
        vacancy.setRequirements(request.getRequirements());
        vacancy.setSalaryMin(request.getSalaryMin());
        vacancy.setSalaryMax(request.getSalaryMax());
        vacancy.setHoursMin(request.getHoursMin());
        vacancy.setHoursMax(request.getHoursMax());
        vacancy.setEmploymentType(request.getEmploymentType());
        vacancy.setEducationLevel(request.getEducationLevel());
        vacancy.setIsActive(request.getIsActive() != null ? request.getIsActive() : Boolean.TRUE);
        vacancy.setPublishedAt(LocalDateTime.now());
        vacancy.setExpiresAt(request.getExpiresAt());
        vacancy.setSeoTitle(request.getSeoTitle());
        vacancy.setSeoDescription(request.getSeoDescription());
        // Featured: controleer abonnement als werkgever featured wil aanzetten
        if (Boolean.TRUE.equals(request.getIsFeatured())) {
            subscriptionService.checkFeaturedAllowed(employerId);
            vacancy.setIsFeatured(Boolean.TRUE);
            vacancy.setFeaturedUntil(request.getFeaturedUntil());
        }

        Vacancy saved = vacancyRepository.save(vacancy);

        // Creditsysteem: als vacature via credit geplaatst wordt, trek 1 credit af
        if (useCredits) {
            vacancyCreditService.deductCredit(employerId);
            log.info("[CREDITS] 1 credit gebruikt voor vacature {} (werkgever {}).", saved.getId(), employerId);
        }

        auditService.logVacancyCreated(saved.getId(), saved.getTitle(), email);
        return toDashboardVacancyDto(saved, 0L);
    }
    @Override
    public DashboardVacancyDto updateVacancy(String email, Long vacancyId, DashboardVacancyCreateRequest request) {
        Long employerId = resolveEmployerId(email);
        Vacancy vacancy = vacancyRepository.findById(vacancyId)
                .orElseThrow(() -> new ResourceNotFoundException("Vacature niet gevonden met id: " + vacancyId));

        if (!vacancy.getEmployer().getId().equals(employerId)) {
            throw new AccessDeniedException("Je hebt geen toegang tot deze vacature.");
        }

        validateSalaryAndHours(request);

        String slug = resolveSlug(request.getSlug(), request.getTitle());
        if (vacancyRepository.existsBySlugAndIdNot(slug, vacancyId)) {
            throw new IllegalArgumentException("Slug is al in gebruik: " + slug);
        }

        vacancy.setCityId(request.getCityId());
        vacancy.setOccupationId(request.getOccupationId());
        vacancy.setTitle(request.getTitle());
        vacancy.setSlug(slug);
        vacancy.setDescription(request.getDescription());
        vacancy.setRequirements(request.getRequirements());
        vacancy.setSalaryMin(request.getSalaryMin());
        vacancy.setSalaryMax(request.getSalaryMax());
        vacancy.setHoursMin(request.getHoursMin());
        vacancy.setHoursMax(request.getHoursMax());
        vacancy.setEmploymentType(request.getEmploymentType());
        vacancy.setEducationLevel(request.getEducationLevel());
        if (request.getIsActive() != null) {
            // Bij heractivering (false → true): controleer vacaturelimiet
            if (Boolean.TRUE.equals(request.getIsActive()) && !Boolean.TRUE.equals(vacancy.getIsActive())) {
                subscriptionService.checkVacancyLimit(employerId);
            }
            vacancy.setIsActive(request.getIsActive());
        }
        vacancy.setExpiresAt(request.getExpiresAt());
        vacancy.setSeoTitle(request.getSeoTitle());
        vacancy.setSeoDescription(request.getSeoDescription());
        // Featured: controleer abonnement als werkgever featured wil aanzetten
        if (Boolean.TRUE.equals(request.getIsFeatured()) && !Boolean.TRUE.equals(vacancy.getIsFeatured())) {
            subscriptionService.checkFeaturedAllowed(employerId);
        }
        if (request.getIsFeatured() != null) {
            vacancy.setIsFeatured(request.getIsFeatured());
            vacancy.setFeaturedUntil(Boolean.TRUE.equals(request.getIsFeatured()) ? request.getFeaturedUntil() : null);
        }

        Vacancy saved = vacancyRepository.save(vacancy);
        long count = applicationRepository.countByVacancyId(vacancyId);
        return toDashboardVacancyDto(saved, count);
    }

    @Override
    public DashboardVacancyDto toggleFeatured(String email, Long vacancyId) {
        Long employerId = resolveEmployerId(email);
        Vacancy vacancy = vacancyRepository.findById(vacancyId)
                .orElseThrow(() -> new ResourceNotFoundException("Vacature niet gevonden met id: " + vacancyId));
        if (!vacancy.getEmployer().getId().equals(employerId)) {
            throw new AccessDeniedException("Je hebt geen toegang tot deze vacature.");
        }
        // Controleer of featured is inbegrepen in het pakket — alleen bij aanzetten
        if (!Boolean.TRUE.equals(vacancy.getIsFeatured())) {
            subscriptionService.checkFeaturedAllowed(employerId);
        }
        vacancy.setIsFeatured(!Boolean.TRUE.equals(vacancy.getIsFeatured()));
        Vacancy saved = vacancyRepository.save(vacancy);
        log.info("Employer {} toggled featured for vacancy id={} isFeatured={}",
                employerId, vacancyId, saved.getIsFeatured());
        long count = applicationRepository.countByVacancyId(vacancyId);
        return toDashboardVacancyDto(saved, count);
    }

    @Override
    @Transactional
    public VacancyDeleteResultDto deleteVacancy(String email, Long vacancyId) {
        Long employerId = resolveEmployerId(email);
        Vacancy vacancy = vacancyRepository.findById(vacancyId)
                .orElseThrow(() -> new ResourceNotFoundException("Vacature niet gevonden met id: " + vacancyId));

        if (!vacancy.getEmployer().getId().equals(employerId)) {
            throw new AccessDeniedException("Je hebt geen toegang tot deze vacature.");
        }

        long applicationCount = applicationRepository.countByVacancyId(vacancyId);

        if (applicationCount > 0) {
            vacancy.setIsActive(false);
            vacancyRepository.save(vacancy);
            log.info("Employer {} deactivated vacancy id={} (had {} applications)",
                    employerId, vacancyId, applicationCount);
            return VacancyDeleteResultDto.builder()
                    .success(true)
                    .action("deactivated")
                    .message("Vacature gedeactiveerd omdat er sollicitaties gekoppeld zijn.")
                    .build();
        }

        vacancyRepository.deleteById(vacancyId);
        log.info("Employer {} deleted vacancy id={}", employerId, vacancyId);
        return VacancyDeleteResultDto.builder()
                .success(true)
                .action("deleted")
                .message("Vacature succesvol verwijderd.")
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DashboardApplicationDto> getMyApplications(String email, Pageable pageable) {
        Long employerId = resolveEmployerId(email);
        return applicationRepository.findAllByVacancyEmployerId(employerId, pageable)
                .map(a -> toDashboardApplicationDto(a, employerId));
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardApplicationDto getApplicationById(String email, Long applicationId) {
        Long employerId = resolveEmployerId(email);
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Sollicitatie niet gevonden met id: " + applicationId));
        if (!application.getVacancy().getEmployer().getId().equals(employerId)) {
            throw new AccessDeniedException("Je hebt geen toegang tot deze sollicitatie.");
        }
        return toDashboardApplicationDto(application, employerId);
    }

    @Override
    @Transactional
    public DashboardApplicationDto updateApplicationStatus(String email, Long applicationId, ApplicationStatus status) {
        Long employerId = resolveEmployerId(email);
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Sollicitatie niet gevonden met id: " + applicationId));
        if (!application.getVacancy().getEmployer().getId().equals(employerId)) {
            throw new AccessDeniedException("Je hebt geen toegang tot deze sollicitatie.");
        }
        ApplicationStatus oldStatus = application.getStatus();
        application.setStatus(status);
        DashboardApplicationDto result = toDashboardApplicationDto(applicationRepository.save(application), employerId);

        log.info("Application {} status changed from {} to {}", applicationId, oldStatus, status);
        sendStatusEmail(application, status);

        return result;
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private void sendStatusEmail(Application application, ApplicationStatus status) {
        Profile profile    = application.getProfile();
        String  toEmail    = profile.getEmail();
        String  firstName  = profile.getFirstName() != null ? profile.getFirstName() : "kandidaat";
        String  vacancy    = application.getVacancy().getTitle();
        String  employer   = application.getVacancy().getEmployer().getName();

        switch (status) {
            case REVIEWED -> emailService.sendApplicationViewedEmail(toEmail, firstName, vacancy, employer);
            case INVITED  -> emailService.sendApplicationInvitedEmail(toEmail, firstName, vacancy, employer);
            case HIRED    -> emailService.sendApplicationAcceptedEmail(toEmail, firstName, vacancy, employer);
            case REJECTED -> emailService.sendApplicationRejectedEmail(toEmail, firstName, vacancy, employer);
            default       -> { /* SUBMITTED: geen notificatie */ }
        }
    }

    private Long resolveEmployerId(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Gebruiker niet gevonden: " + email));

        if (user.getEmployerId() == null) {
            throw new AccessDeniedException("Je account is niet gekoppeld aan een werkgever.");
        }
        return user.getEmployerId();
    }

    private DashboardVacancyDto toDashboardVacancyDto(Vacancy v, long applicationCount) {
        return DashboardVacancyDto.builder()
                .id(v.getId())
                .title(v.getTitle())
                .slug(v.getSlug())
                .isActive(v.getIsActive())
                .isFeatured(v.getIsFeatured())
                .employmentType(v.getEmploymentType())
                .educationLevel(v.getEducationLevel())
                .salaryMin(v.getSalaryMin())
                .salaryMax(v.getSalaryMax())
                .hoursMin(v.getHoursMin())
                .hoursMax(v.getHoursMax())
                .applicationCount(applicationCount)
                .publishedAt(v.getPublishedAt())
                .expiresAt(v.getExpiresAt())
                .createdAt(v.getCreatedAt())
                .updatedAt(v.getUpdatedAt())
                .featuredUntil(v.getFeaturedUntil())
                .build();
    }

    private DashboardApplicationDto toDashboardApplicationDto(Application a, Long employerId) {
        Profile p = a.getProfile();
        boolean canViewCv      = subscriptionService.canViewCv(employerId);
        boolean canSeeContact  = subscriptionService.canSeeApplicantContact(employerId);
        return DashboardApplicationDto.builder()
                .id(a.getId())
                .vacancyId(a.getVacancy().getId())
                .vacancyTitle(a.getVacancy().getTitle())
                .vacancySlug(a.getVacancy().getSlug())
                .profileId(p.getId())
                .applicantName(p.getFirstName() + " " + p.getLastName())
                .applicantEmail(canSeeContact ? p.getEmail() : null)
                .applicantPhone(canSeeContact ? p.getPhoneNumber() : null)
                .applicantCity(p.getCity())
                .applicantProfession(p.getProfession())
                .applicantEducation(p.getEducation())
                .applicantExperienceYears(p.getExperienceYears())
                .applicantBio(p.getBio())
                .applicantLinkedinUrl(canSeeContact ? p.getLinkedinUrl() : null)
                .applicantCvUrl(canViewCv ? p.getCvUrl() : null)
                .applicantAvailability(p.getAvailability())
                .applicantDesiredHours(p.getDesiredHours())
                .status(a.getStatus())
                .coverLetter(a.getCoverLetter())
                .appliedAt(a.getCreatedAt())
                .build();
    }

    private UserDto toUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .employerId(user.getEmployerId())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private void validateSalaryAndHours(DashboardVacancyCreateRequest req) {
        if (req.getSalaryMin() != null && req.getSalaryMax() != null
                && req.getSalaryMin().compareTo(req.getSalaryMax()) > 0) {
            throw new IllegalArgumentException("Minimumsalaris mag het maximumsalaris niet overschrijden");
        }
        if (req.getHoursMin() != null && req.getHoursMax() != null
                && req.getHoursMin() > req.getHoursMax()) {
            throw new IllegalArgumentException("Minimum uren mag maximum uren niet overschrijden");
        }
        if (req.getExpiresAt() != null && req.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Vervaldatum moet in de toekomst liggen");
        }
    }

    private String resolveSlug(String provided, String title) {
        if (provided != null && !provided.isBlank()) {
            return provided;
        }
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}
