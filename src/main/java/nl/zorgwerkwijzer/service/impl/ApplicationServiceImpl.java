package nl.zorgwerkwijzer.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.dto.ApplicationRequestDto;
import nl.zorgwerkwijzer.dto.ApplicationResponseDto;
import nl.zorgwerkwijzer.exception.ResourceNotFoundException;
import nl.zorgwerkwijzer.mapper.ApplicationMapper;
import nl.zorgwerkwijzer.model.Application;
import nl.zorgwerkwijzer.model.ApplicationStatus;
import nl.zorgwerkwijzer.model.Profile;
import nl.zorgwerkwijzer.model.Vacancy;
import nl.zorgwerkwijzer.repository.ApplicationRepository;
import nl.zorgwerkwijzer.repository.ProfileRepository;
import nl.zorgwerkwijzer.repository.VacancyRepository;
import nl.zorgwerkwijzer.service.ApplicationService;
import nl.zorgwerkwijzer.service.AuditService;
import nl.zorgwerkwijzer.service.EmailService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final VacancyRepository     vacancyRepository;
    private final ProfileRepository     profileRepository;
    private final ApplicationMapper     applicationMapper;
    private final EmailService          emailService;
    private final AuditService          auditService;

    @Override
    @Transactional
    public ApplicationResponseDto create(ApplicationRequestDto dto) {
        Vacancy vacancy = vacancyRepository.findById(dto.getVacancyId())
                .orElseThrow(() -> new ResourceNotFoundException("Vacancy not found with id: " + dto.getVacancyId()));

        if (!Boolean.TRUE.equals(vacancy.getIsActive())) {
            throw new IllegalArgumentException("Cannot apply to an inactive vacancy");
        }

        Profile profile = profileRepository.findById(dto.getProfileId())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + dto.getProfileId()));

        if (applicationRepository.existsByVacancyIdAndProfileId(dto.getVacancyId(), dto.getProfileId())) {
            throw new IllegalArgumentException("Already applied to this vacancy");
        }

        Application application = new Application();
        application.setVacancy(vacancy);
        application.setProfile(profile);
        application.setCoverLetter(dto.getCoverLetter());
        application.setStatus(ApplicationStatus.SUBMITTED);

        Application saved = applicationRepository.save(application);
        auditService.logApplicationSubmitted(
                saved.getId(),
                profile.getEmail(),
                vacancy.getId()
        );
        return applicationMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationResponseDto> findByProfile(Long profileId, Pageable pageable) {
        return applicationRepository.findAllByProfileId(profileId, pageable)
                .map(applicationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationResponseDto> findByVacancy(Long vacancyId, Pageable pageable) {
        return applicationRepository.findAllByVacancyId(vacancyId, pageable)
                .map(applicationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponseDto findById(Long id) {
        return applicationMapper.toDto(getApplicationOrThrow(id));
    }

    @Override
    @Transactional
    public ApplicationResponseDto updateStatus(Long id, ApplicationStatus status) {
        Application application = getApplicationOrThrow(id);
        ApplicationStatus oldStatus = application.getStatus();
        application.setStatus(status);
        ApplicationResponseDto result = applicationMapper.toDto(applicationRepository.save(application));

        log.info("Application {} status changed from {} to {}", id, oldStatus, status);
        sendStatusEmail(application, status);

        return result;
    }

    private void sendStatusEmail(Application application, ApplicationStatus status) {
        Profile profile   = application.getProfile();
        String  toEmail   = profile.getEmail();
        String  firstName = profile.getFirstName() != null ? profile.getFirstName() : "kandidaat";
        String  vacancy   = application.getVacancy().getTitle();
        String  employer  = application.getVacancy().getEmployer().getName();

        switch (status) {
            case REVIEWED -> emailService.sendApplicationViewedEmail(toEmail, firstName, vacancy, employer);
            case INVITED  -> emailService.sendApplicationInvitedEmail(toEmail, firstName, vacancy, employer);
            case HIRED    -> emailService.sendApplicationAcceptedEmail(toEmail, firstName, vacancy, employer);
            case REJECTED -> emailService.sendApplicationRejectedEmail(toEmail, firstName, vacancy, employer);
            default       -> { /* SUBMITTED: geen notificatie */ }
        }
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!applicationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Application not found with id: " + id);
        }
        applicationRepository.deleteById(id);
    }

    private Application getApplicationOrThrow(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
    }
}
