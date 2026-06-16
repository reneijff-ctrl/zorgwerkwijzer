package nl.zorgwerkwijzer.repository;

import nl.zorgwerkwijzer.model.EducationLevel;
import nl.zorgwerkwijzer.model.EmploymentType;
import nl.zorgwerkwijzer.model.Vacancy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VacancyRepository extends JpaRepository<Vacancy, Long>, JpaSpecificationExecutor<Vacancy> {

    Optional<Vacancy> findBySlug(String slug);

    Page<Vacancy> findAllByIsActiveTrue(Pageable pageable);

    Page<Vacancy> findAllByEmployerId(Long employerId, Pageable pageable);

    Page<Vacancy> findAllByCityId(Long cityId, Pageable pageable);

    Page<Vacancy> findAllByOccupationId(Long occupationId, Pageable pageable);

    Page<Vacancy> findAllByEmploymentType(EmploymentType employmentType, Pageable pageable);

    Page<Vacancy> findAllByEducationLevel(EducationLevel educationLevel, Pageable pageable);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    Page<Vacancy> findAllByEmployerIdAndIsActiveTrue(Long employerId, Pageable pageable);

    long countByEmployerIdAndIsActiveTrue(Long employerId);

    // ── Admin dashboard ───────────────────────────────────────────────────────

    long countByIsActiveTrue();

    long countByIsFeaturedTrue();

    Page<Vacancy> findAllByIsFeaturedTrue(Pageable pageable);

    Page<Vacancy> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<Vacancy> findByIsActive(Boolean isActive, Pageable pageable);

    Page<Vacancy> findByIsFeatured(Boolean isFeatured, Pageable pageable);

    Page<Vacancy> findByTitleContainingIgnoreCaseAndIsActive(String title, Boolean isActive, Pageable pageable);

    Page<Vacancy> findByTitleContainingIgnoreCaseAndIsFeatured(String title, Boolean isFeatured, Pageable pageable);

    Page<Vacancy> findByIsActiveAndIsFeatured(Boolean isActive, Boolean isFeatured, Pageable pageable);

    Page<Vacancy> findByTitleContainingIgnoreCaseAndIsActiveAndIsFeatured(String title, Boolean isActive, Boolean isFeatured, Pageable pageable);

    /**
     * Bulk-inactivering bij subscription cancellation.
     * Één UPDATE query i.p.v. N individuele queries.
     */
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query(
            "UPDATE Vacancy v SET v.isActive = false WHERE v.employer.id = :employerId AND v.isActive = true")
    int deactivateAllByEmployerId(@org.springframework.data.repository.query.Param("employerId") Long employerId);
}
