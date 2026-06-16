package nl.zorgwerkwijzer.repository;

import nl.zorgwerkwijzer.model.User;
import nl.zorgwerkwijzer.model.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(UserRole role);

    long countByCreatedAtAfter(LocalDateTime date);

    long countByRoleAndCreatedAtAfter(UserRole role, LocalDateTime date);

    Page<User> findByEmailContainingIgnoreCase(String email, Pageable pageable);

    Page<User> findByRole(UserRole role, Pageable pageable);

    Page<User> findByEmailContainingIgnoreCaseAndRole(String email, UserRole role, Pageable pageable);

    List<User> findByEmployerId(Long employerId);

    long countByEmployerId(Long employerId);
    Optional<User> findByVerificationToken(String verificationToken);
}
