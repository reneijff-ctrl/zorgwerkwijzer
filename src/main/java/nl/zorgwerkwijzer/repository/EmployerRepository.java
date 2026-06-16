package nl.zorgwerkwijzer.repository;

import nl.zorgwerkwijzer.model.Employer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployerRepository extends JpaRepository<Employer, Long> {

    Optional<Employer> findBySlug(String slug);

    Optional<Employer> findByEmail(String email);

    Page<Employer> findAllByIsPremiumTrue(Pageable pageable);

    boolean existsBySlug(String slug);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    boolean existsBySlugAndIdNot(String slug, Long id);

    // ── Admin dashboard ───────────────────────────────────────────────────────

    Page<Employer> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String name, String email, Pageable pageable);
}
