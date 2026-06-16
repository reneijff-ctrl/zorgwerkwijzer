package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.VacancyCreateUpdateDto;
import nl.zorgwerkwijzer.dto.VacancyDetailDto;
import nl.zorgwerkwijzer.dto.VacancyListDto;
import nl.zorgwerkwijzer.model.EducationLevel;
import nl.zorgwerkwijzer.model.EmploymentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VacancyService {

    Page<VacancyListDto> findAll(Pageable pageable);

    Page<VacancyListDto> search(String query,
                                Long cityId,
                                Long occupationId,
                                EmploymentType employmentType,
                                EducationLevel educationLevel,
                                Pageable pageable);

    VacancyDetailDto findById(Long id);

    VacancyDetailDto findBySlug(String slug);

    Page<VacancyListDto> findByEmployer(Long employerId, Pageable pageable);

    Page<VacancyListDto> findByCity(Long cityId, Pageable pageable);

    Page<VacancyListDto> findByOccupation(Long occupationId, Pageable pageable);

    VacancyDetailDto create(VacancyCreateUpdateDto dto);

    VacancyDetailDto update(Long id, VacancyCreateUpdateDto dto);

    void delete(Long id);
}
