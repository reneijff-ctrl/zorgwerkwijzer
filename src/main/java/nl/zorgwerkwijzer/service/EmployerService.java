package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.EmployerDto;
import nl.zorgwerkwijzer.dto.VacancyListDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EmployerService {

    Page<EmployerDto> findAll(Pageable pageable);

    EmployerDto findById(Long id);

    EmployerDto findBySlug(String slug);

    Page<EmployerDto> findPremiumEmployers(Pageable pageable);

    Page<VacancyListDto> findVacanciesBySlug(String slug, Pageable pageable);

    EmployerDto updateOwnProfile(Long id, String authenticatedEmail, EmployerDto dto);

    EmployerDto create(EmployerDto dto);

    EmployerDto update(Long id, EmployerDto dto);

    void delete(Long id);
}
