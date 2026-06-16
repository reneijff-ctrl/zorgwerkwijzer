package nl.zorgwerkwijzer.repository;

import nl.zorgwerkwijzer.model.SavedJob;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {

    Page<SavedJob> findAllByProfileId(Long profileId, Pageable pageable);

    Optional<SavedJob> findByVacancyIdAndProfileId(Long vacancyId, Long profileId);

    boolean existsByVacancyIdAndProfileId(Long vacancyId, Long profileId);

    void deleteByVacancyIdAndProfileId(Long vacancyId, Long profileId);
}
