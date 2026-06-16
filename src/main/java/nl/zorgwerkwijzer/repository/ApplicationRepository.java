package nl.zorgwerkwijzer.repository;

import nl.zorgwerkwijzer.model.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Page<Application> findAllByProfileId(Long profileId, Pageable pageable);

    Page<Application> findAllByVacancyId(Long vacancyId, Pageable pageable);

    boolean existsByVacancyIdAndProfileId(Long vacancyId, Long profileId);

    long countByVacancyId(Long vacancyId);

    @Query("SELECT a FROM Application a " +
           "JOIN FETCH a.vacancy v " +
           "JOIN FETCH a.profile p " +
           "WHERE v.employer.id = :employerId")
    Page<Application> findAllByVacancyEmployerId(@Param("employerId") Long employerId, Pageable pageable);

    // ── Admin dashboard ───────────────────────────────────────────────────────

    long countByCreatedAtAfter(java.time.LocalDateTime date);
}
