package nl.zorgwerkwijzer.repository;

import nl.zorgwerkwijzer.model.AdminAuditLog;
import nl.zorgwerkwijzer.model.AuditAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLog, Long>,
        JpaSpecificationExecutor<AdminAuditLog> {

    Page<AdminAuditLog> findByAdminUserId(Long adminUserId, Pageable pageable);

    Page<AdminAuditLog> findByAction(AuditAction action, Pageable pageable);

    Page<AdminAuditLog> findByEntityTypeAndEntityId(String entityType, Long entityId, Pageable pageable);

    Page<AdminAuditLog> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to, Pageable pageable);

    Page<AdminAuditLog> findByAdminUserIdAndCreatedAtBetween(
            Long adminUserId, LocalDateTime from, LocalDateTime to, Pageable pageable);

}
