package nl.zorgwerkwijzer.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "saved_jobs",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_saved_jobs_vacancy_profile",
        columnNames = {"vacancy_id", "profile_id"}
    )
)
@Getter
@Setter
@NoArgsConstructor
public class SavedJob extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vacancy_id", nullable = false)
    private Vacancy vacancy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;
}
