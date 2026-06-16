package nl.zorgwerkwijzer.dto.admin;

import lombok.Builder;
import lombok.Getter;
import nl.zorgwerkwijzer.model.AuditAction;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminAuditLogDto {

    private Long id;
    private Long adminUserId;
    private String adminEmail;
    private AuditAction action;
    private String entityType;
    private Long entityId;
    private String entityName;
    private String oldValue;
    private String newValue;
    private LocalDateTime createdAt;
}
