package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.ApplicationRequestDto;
import nl.zorgwerkwijzer.dto.ApplicationResponseDto;
import nl.zorgwerkwijzer.model.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ApplicationService {

    ApplicationResponseDto create(ApplicationRequestDto dto);

    Page<ApplicationResponseDto> findByProfile(Long profileId, Pageable pageable);

    Page<ApplicationResponseDto> findByVacancy(Long vacancyId, Pageable pageable);

    ApplicationResponseDto findById(Long id);

    ApplicationResponseDto updateStatus(Long id, ApplicationStatus status);

    void delete(Long id);
}
