package nl.zorgwerkwijzer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import java.time.LocalDateTime;

/**
 * Immutable audit-record van een admin-mutatie.
 * Erft NIET van BaseEntity — updatedAt heeft geen zin voor audit-records
 * en zou het vertrouwen in de audit-integriteit ondermijnen.
 * Geen foreign keys — records moeten blijven bestaan ook als het gerelateerde object verwijderd is.
 */
@Entity
@Table(name = "admin_audit_log")
@Immutable
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "admin_user_id", nullable = false)
    private Long adminUserId;

    @Column(name = "admin_email", nullable = false, length = 255)
    private String adminEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false, length = 100)
    private AuditAction action;

    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "entity_name", length = 255)
    private String entityName;

    @Column(name = "old_value", columnDefinition = "TEXT")
    private String oldValue;

    @Column(name = "new_value", columnDefinition = "TEXT")
    private String newValue;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = true)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
