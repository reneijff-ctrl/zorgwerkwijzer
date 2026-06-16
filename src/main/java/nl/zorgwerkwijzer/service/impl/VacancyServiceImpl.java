package nl.zorgwerkwijzer.service.impl;

import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.VacancyCreateUpdateDto;
import nl.zorgwerkwijzer.dto.VacancyDetailDto;
import nl.zorgwerkwijzer.dto.VacancyListDto;
import nl.zorgwerkwijzer.exception.ResourceNotFoundException;
import nl.zorgwerkwijzer.mapper.VacancyMapper;
import nl.zorgwerkwijzer.model.EducationLevel;
import nl.zorgwerkwijzer.model.Employer;
import nl.zorgwerkwijzer.model.EmploymentType;
import nl.zorgwerkwijzer.model.Vacancy;
import nl.zorgwerkwijzer.repository.EmployerRepository;
import nl.zorgwerkwijzer.repository.VacancyRepository;
import nl.zorgwerkwijzer.repository.VacancySpecification;
import nl.zorgwerkwijzer.service.AuditService;
import nl.zorgwerkwijzer.service.VacancyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class VacancyServiceImpl implements VacancyService {

    private final VacancyRepository vacancyRepository;
    private final EmployerRepository employerRepository;
    private final VacancyMapper vacancyMapper;
    private final AuditService auditService;

    @Override
    @Transactional(readOnly = true)
    public Page<VacancyListDto> findAll(Pageable pageable) {
        return vacancyRepository.findAllByIsActiveTrue(pageable)
                .map(vacancyMapper::toListDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VacancyListDto> search(String query,
                                       Long cityId,
                                       Long occupationId,
                                       EmploymentType employmentType,
                                       EducationLevel educationLevel,
                                       Pageable pageable) {
        return vacancyRepository.findAll(
                VacancySpecification.search(query, cityId, occupationId, employmentType, educationLevel),
                pageable
        ).map(vacancyMapper::toListDto);
    }

    @Override
    @Transactional(readOnly = true)
    public VacancyDetailDto findById(Long id) {
        return vacancyMapper.toDetailDto(findVacancyById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public VacancyDetailDto findBySlug(String slug) {
        Vacancy vacancy = vacancyRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Vacancy not found with slug: " + slug));
        return vacancyMapper.toDetailDto(vacancy);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VacancyListDto> findByEmployer(Long employerId, Pageable pageable) {
        return vacancyRepository.findAllByEmployerId(employerId, pageable)
                .map(vacancyMapper::toListDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VacancyListDto> findByCity(Long cityId, Pageable pageable) {
        return vacancyRepository.findAllByCityId(cityId, pageable)
                .map(vacancyMapper::toListDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VacancyListDto> findByOccupation(Long occupationId, Pageable pageable) {
        return vacancyRepository.findAllByOccupationId(occupationId, pageable)
                .map(vacancyMapper::toListDto);
    }

    @Override
    public VacancyDetailDto create(VacancyCreateUpdateDto dto) {
        validateCrossFieldConstraints(dto);

        String slug = resolveSlug(dto.getSlug(), dto.getTitle());
        if (vacancyRepository.existsBySlug(slug)) {
            throw new IllegalArgumentException("Slug already in use: " + slug);
        }

        Employer employer = findEmployerById(dto.getEmployerId());
        Vacancy vacancy = new Vacancy();
        vacancyMapper.updateEntityFromDto(dto, vacancy);
        vacancy.setSlug(slug);
        vacancy.setEmployer(employer);
        vacancy.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : Boolean.TRUE);
        vacancy.setPublishedAt(dto.getPublishedAt() != null ? dto.getPublishedAt() : LocalDateTime.now());

        Vacancy saved = vacancyRepository.save(vacancy);
        auditService.logVacancyCreated(saved.getId(), saved.getTitle(), "system");
        return vacancyMapper.toDetailDto(saved);
    }
    @Override
    public VacancyDetailDto update(Long id, VacancyCreateUpdateDto dto) {
        validateCrossFieldConstraints(dto);

        Vacancy existing = findVacancyById(id);

        String slug = resolveSlug(dto.getSlug(), dto.getTitle());
        if (vacancyRepository.existsBySlugAndIdNot(slug, id)) {
            throw new IllegalArgumentException("Slug already in use: " + slug);
        }

        Employer employer = findEmployerById(dto.getEmployerId());
        vacancyMapper.updateEntityFromDto(dto, existing);
        existing.setSlug(slug);
        existing.setEmployer(employer);
        if (dto.getIsActive() != null) {
            existing.setIsActive(dto.getIsActive());
        }
        if (dto.getPublishedAt() != null) {
            existing.setPublishedAt(dto.getPublishedAt());
        }

        return vacancyMapper.toDetailDto(vacancyRepository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!vacancyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vacancy not found with id: " + id);
        }
        vacancyRepository.deleteById(id);
    }

    private Vacancy findVacancyById(Long id) {
        return vacancyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vacancy not found with id: " + id));
    }

    private Employer findEmployerById(Long employerId) {
        return employerRepository.findById(employerId)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found with id: " + employerId));
    }

    private void validateCrossFieldConstraints(VacancyCreateUpdateDto dto) {
        if (dto.getSalaryMin() != null && dto.getSalaryMax() != null
                && dto.getSalaryMin().compareTo(dto.getSalaryMax()) > 0) {
            throw new IllegalArgumentException("Minimum salary cannot exceed maximum salary");
        }
        if (dto.getHoursMin() != null && dto.getHoursMax() != null
                && dto.getHoursMin() > dto.getHoursMax()) {
            throw new IllegalArgumentException("Minimum hours cannot exceed maximum hours");
        }
        if (dto.getExpiresAt() != null && dto.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Expiry date must be in the future");
        }
    }

    private String resolveSlug(String providedSlug, String title) {
        if (providedSlug != null && !providedSlug.isBlank()) {
            return providedSlug;
        }
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}
