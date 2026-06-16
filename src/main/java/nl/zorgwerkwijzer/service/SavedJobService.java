package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.SavedJobDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SavedJobService {

    SavedJobDto save(Long vacancyId, Long profileId);

    void remove(Long vacancyId, Long profileId);

    Page<SavedJobDto> findByProfile(Long profileId, Pageable pageable);

    boolean isSaved(Long vacancyId, Long profileId);
}
