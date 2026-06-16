package nl.zorgwerkwijzer.service.impl;

import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.EmployerDto;
import nl.zorgwerkwijzer.dto.VacancyListDto;
import nl.zorgwerkwijzer.exception.ResourceNotFoundException;
import nl.zorgwerkwijzer.mapper.EmployerMapper;
import nl.zorgwerkwijzer.mapper.VacancyMapper;
import nl.zorgwerkwijzer.model.Employer;
import nl.zorgwerkwijzer.repository.EmployerRepository;
import nl.zorgwerkwijzer.repository.UserRepository;
import nl.zorgwerkwijzer.repository.VacancyRepository;
import nl.zorgwerkwijzer.service.EmployerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployerServiceImpl implements EmployerService {

    private final EmployerRepository employerRepository;
    private final VacancyRepository vacancyRepository;
    private final EmployerMapper employerMapper;
    private final VacancyMapper vacancyMapper;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<EmployerDto> findAll(Pageable pageable) {
        return employerRepository.findAll(pageable)
                .map(this::toDtoWithVacancyCount);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployerDto findById(Long id) {
        Employer employer = findEmployerById(id);
        return toDtoWithVacancyCount(employer);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployerDto findBySlug(String slug) {
        Employer employer = employerRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found with slug: " + slug));
        return toDtoWithVacancyCount(employer);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmployerDto> findPremiumEmployers(Pageable pageable) {
        return employerRepository.findAllByIsPremiumTrue(pageable)
                .map(this::toDtoWithVacancyCount);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VacancyListDto> findVacanciesBySlug(String slug, Pageable pageable) {
        Employer employer = employerRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found with slug: " + slug));
        return vacancyRepository.findAllByEmployerIdAndIsActiveTrue(employer.getId(), pageable)
                .map(vacancyMapper::toListDto);
    }

    @Override
    public EmployerDto updateOwnProfile(Long id, String authenticatedEmail, EmployerDto dto) {
        userRepository.findByEmail(authenticatedEmail).ifPresent(user -> {
            if (user.getEmployerId() == null || !user.getEmployerId().equals(id)) {
                throw new AccessDeniedException("You are not allowed to update this employer profile");
            }
        });
        return update(id, dto);
    }

    @Override
    public EmployerDto create(EmployerDto dto) {
        if (dto.getSlug() == null || dto.getSlug().isBlank()) {
            dto.setSlug(generateSlug(dto.getName()));
        }
        if (employerRepository.existsBySlug(dto.getSlug())) {
            throw new IllegalArgumentException("Slug already in use: " + dto.getSlug());
        }
        if (employerRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + dto.getEmail());
        }
        Employer employer = employerMapper.toEntity(dto);
        employer.setIsPremium(Boolean.FALSE);
        return toDtoWithVacancyCount(employerRepository.save(employer));
    }

    @Override
    public EmployerDto update(Long id, EmployerDto dto) {
        Employer existing = findEmployerById(id);
        if (dto.getSlug() != null && !dto.getSlug().isBlank()
                && employerRepository.existsBySlugAndIdNot(dto.getSlug(), id)) {
            throw new IllegalArgumentException("Slug already in use: " + dto.getSlug());
        }
        if (employerRepository.existsByEmailAndIdNot(dto.getEmail(), id)) {
            throw new IllegalArgumentException("Email already in use: " + dto.getEmail());
        }
        if (dto.getSlug() == null || dto.getSlug().isBlank()) {
            dto.setSlug(existing.getSlug());
        }
        employerMapper.updateEntityFromDto(dto, existing);
        return toDtoWithVacancyCount(employerRepository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!employerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employer not found with id: " + id);
        }
        employerRepository.deleteById(id);
    }

    private Employer findEmployerById(Long id) {
        return employerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found with id: " + id));
    }

    private EmployerDto toDtoWithVacancyCount(Employer employer) {
        EmployerDto dto = employerMapper.toDto(employer);
        dto.setVacancyCount((int) vacancyRepository.countByEmployerIdAndIsActiveTrue(employer.getId()));
        return dto;
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}
