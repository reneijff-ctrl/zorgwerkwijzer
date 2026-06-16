package nl.zorgwerkwijzer.repository;

import jakarta.persistence.LockModeType;
import nl.zorgwerkwijzer.model.EmployerSubscription;
import nl.zorgwerkwijzer.model.SubscriptionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployerSubscriptionRepository extends JpaRepository<EmployerSubscription, Long> {

    Optional<EmployerSubscription> findByEmployerId(Long employerId);

    /**
     * Pessimistische lock voor de vacature-limiet check.
     * Genereert SELECT ... FOR UPDATE in PostgreSQL.
     * Serialiseert gelijktijdige createVacancy() en updateVacancy(reactivering) calls
     * voor dezelfde werkgever — voorkomt phantom-insert race conditions.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT es FROM EmployerSubscription es WHERE es.employer.id = :employerId")
    Optional<EmployerSubscription> findByEmployerIdForUpdate(@Param("employerId") Long employerId);

    Optional<EmployerSubscription> findByStripeSubscriptionId(String stripeSubscriptionId);

    Optional<EmployerSubscription> findByStripeCustomerId(String stripeCustomerId);

    long countByStatusIn(List<SubscriptionStatus> statuses);

    List<EmployerSubscription> findByStatus(SubscriptionStatus status);

    Page<EmployerSubscription> findByStatus(SubscriptionStatus status, Pageable pageable);

    List<EmployerSubscription> findByCanceledAtAfter(LocalDateTime date);

    Page<EmployerSubscription> findBySubscriptionPackageId(Long packageId, Pageable pageable);

    Page<EmployerSubscription> findByStatusAndSubscriptionPackageId(SubscriptionStatus status, Long packageId, Pageable pageable);
}
