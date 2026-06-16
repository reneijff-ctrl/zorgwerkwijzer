package nl.zorgwerkwijzer.repository;

import nl.zorgwerkwijzer.model.ContactMessage;
import nl.zorgwerkwijzer.model.ContactMessageStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.criteria.Predicate;

public class ContactMessageSpecification {

    private ContactMessageSpecification() {}

    public static Specification<ContactMessage> search(String q, ContactMessageStatus status, LocalDateTime from) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (q != null && !q.isBlank()) {
                String pattern = "%" + q.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("email")), pattern),
                        cb.like(cb.lower(root.get("message")), pattern)
                ));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), from));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
