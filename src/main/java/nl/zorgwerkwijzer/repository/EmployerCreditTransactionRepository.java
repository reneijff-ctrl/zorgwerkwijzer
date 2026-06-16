package nl.zorgwerkwijzer.repository;

import nl.zorgwerkwijzer.model.EmployerCreditTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmployerCreditTransactionRepository extends JpaRepository<EmployerCreditTransaction, Long> {

    List<EmployerCreditTransaction> findTop10ByEmployerIdOrderByCreatedAtDesc(Long employerId);

    List<EmployerCreditTransaction> findByEmployerId(Long employerId);

    List<EmployerCreditTransaction> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    @Query("SELECT t FROM EmployerCreditTransaction t WHERE t.creditsAdded > 0")
    List<EmployerCreditTransaction> findAllPurchases();

    @Query("SELECT t FROM EmployerCreditTransaction t WHERE t.creditsAdded > 0 AND t.createdAt BETWEEN :from AND :to")
    List<EmployerCreditTransaction> findPurchasesBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
