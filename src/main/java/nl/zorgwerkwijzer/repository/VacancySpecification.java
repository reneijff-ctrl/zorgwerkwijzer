package nl.zorgwerkwijzer.repository;

import jakarta.persistence.criteria.Predicate;
import nl.zorgwerkwijzer.model.EducationLevel;
import nl.zorgwerkwijzer.model.EmploymentType;
import nl.zorgwerkwijzer.model.Vacancy;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class VacancySpecification {

    private VacancySpecification() {
    }

    public static Specification<Vacancy> search(
            String query,
            Long cityId,
            Long occupationId,
            EmploymentType employmentType,
            EducationLevel educationLevel) {

        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.isTrue(root.get("isActive")));

            if (query != null && !query.isBlank()) {
                String pattern = "%" + query.toLowerCase() + "%";
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("title")), pattern));
            }

            if (cityId != null) {
                predicates.add(criteriaBuilder.equal(root.get("cityId"), cityId));
            }

            if (occupationId != null) {
                predicates.add(criteriaBuilder.equal(root.get("occupationId"), occupationId));
            }

            if (employmentType != null) {
                predicates.add(criteriaBuilder.equal(root.get("employmentType"), employmentType));
            }

            if (educationLevel != null) {
                predicates.add(criteriaBuilder.equal(root.get("educationLevel"), educationLevel));
            }

            criteriaQuery.orderBy(
                    criteriaBuilder.desc(root.get("isFeatured")),
                    criteriaBuilder.desc(root.get("publishedAt"))
            );
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
