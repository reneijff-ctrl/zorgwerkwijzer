package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.admin.AdminAuditLogDto;
import nl.zorgwerkwijzer.model.AuditAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

/**
 * Database-gebaseerde admin audit log service.
 * Los van de bestaande AuditService (SLF4J/bestand-gebaseerd).
 */
public interface AdminAuditLogService {

    /**
     * Logt een admin-actie naar de database.
     * Draait in een aparte transactie (REQUIRES_NEW) zodat
     * het audit-record niet mee-rolt bij een rollback van de omsluitende transactie.
     */
    void logAction(
            Long adminUserId,
            String adminEmail,
            AuditAction action,
            String entityType,
            Long entityId,
            String entityName,
            String oldValue,
            String newValue
    );

    /**
     * Haalt gefilterde audit-logs op. Alle parameters zijn optioneel (null = geen filter).
     */
    Page<AdminAuditLogDto> getAuditLog(
            Long adminUserId,
            AuditAction action,
            String entityType,
            LocalDateTime from,
            LocalDateTime to,
            Pageable pageable
    );
}
