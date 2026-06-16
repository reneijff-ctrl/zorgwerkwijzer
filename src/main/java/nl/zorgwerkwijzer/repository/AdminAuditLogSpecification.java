package nl.zorgwerkwijzer.repository;

import jakarta.persistence.criteria.Predicate;
import nl.zorgwerkwijzer.model.AdminAuditLog;
import nl.zorgwerkwijzer.model.AuditAction;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Specification voor gefilterde audit-log queries.
 * Gebruikt de Criteria API — predicates worden alleen toegevoegd als de parameter niet null is.
 * Hierdoor worden geen IS NULL constructies gegenereerd, wat PostgreSQL type-inferentie fouten
 * (SQLState 42P18) voorkomt bij enum-parameters zoals AuditAction.
 * Volgt hetzelfde patroon als VacancySpecification.
 */
public final class AdminAuditLogSpecification {

    private AdminAuditLogSpecification() {}

    public static Specification<AdminAuditLog> filter(
            Long adminUserId,
            AuditAction action,
            String entityType,
            LocalDateTime from,
            LocalDateTime to) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (adminUserId != null) {
                predicates.add(cb.equal(root.get("adminUserId"), adminUserId));
            }
            if (action != null) {
                predicates.add(cb.equal(root.get("action"), action));
            }
            if (entityType != null && !entityType.isBlank()) {
                predicates.add(cb.equal(root.get("entityType"), entityType));
            }
            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), from));
            }
            if (to != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), to));
            }

            query.orderBy(cb.desc(root.get("createdAt")));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
