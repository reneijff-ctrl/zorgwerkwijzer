package nl.zorgwerkwijzer.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.dto.admin.AdminAuditLogDto;
import nl.zorgwerkwijzer.model.AdminAuditLog;
import nl.zorgwerkwijzer.model.AuditAction;
import nl.zorgwerkwijzer.repository.AdminAuditLogRepository;
import nl.zorgwerkwijzer.repository.AdminAuditLogSpecification;
import nl.zorgwerkwijzer.service.AdminAuditLogService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminAuditLogServiceImpl implements AdminAuditLogService {

    private static final String AUDIT_MARKER = "[AUDIT]";

    private final AdminAuditLogRepository auditLogRepository;

    /**
     * Schrijft een audit-record in een APARTE transactie.
     * REQUIRES_NEW garandeert dat het audit-record bewaard blijft
     * ook als de omsluitende transactie (bijv. deleteVacancy) rolled back wordt.
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAction(
            Long adminUserId,
            String adminEmail,
            AuditAction action,
            String entityType,
            Long entityId,
            String entityName,
            String oldValue,
            String newValue
    ) {
        AdminAuditLog record = AdminAuditLog.builder()
                .adminUserId(adminUserId)
                .adminEmail(adminEmail)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .entityName(entityName)
                .oldValue(oldValue)
                .newValue(newValue)
                .createdAt(LocalDateTime.now())
                .build();

        auditLogRepository.save(record);

        log.info("{} action={} by={} entityType={} entityId={} entityName=\"{}\" old=\"{}\" new=\"{}\"",
                AUDIT_MARKER, action, adminEmail, entityType, entityId, entityName, oldValue, newValue);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminAuditLogDto> getAuditLog(
            Long adminUserId,
            AuditAction action,
            String entityType,
            LocalDateTime from,
            LocalDateTime to,
            Pageable pageable
    ) {
        return auditLogRepository
                .findAll(AdminAuditLogSpecification.filter(adminUserId, action, entityType, from, to), pageable)
                .map(this::toDto);
    }

    private AdminAuditLogDto toDto(AdminAuditLog log) {
        return AdminAuditLogDto.builder()
                .id(log.getId())
                .adminUserId(log.getAdminUserId())
                .adminEmail(log.getAdminEmail())
                .action(log.getAction())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .entityName(log.getEntityName())
                .oldValue(log.getOldValue())
                .newValue(log.getNewValue())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
