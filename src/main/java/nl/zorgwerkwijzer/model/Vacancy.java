package nl.zorgwerkwijzer.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vacancies")
@Getter
@Setter
@NoArgsConstructor
public class Vacancy extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    private Employer employer;

    @Column(name = "city_id")
    private Long cityId;

    @Column(name = "occupation_id")
    private Long occupationId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true, length = 300)
    private String slug;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(precision = 10, scale = 2)
    private BigDecimal salaryMin;

    @Column(precision = 10, scale = 2)
    private BigDecimal salaryMax;

    private Integer hoursMin;

    private Integer hoursMax;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private EmploymentType employmentType;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private EducationLevel educationLevel;

    @Column(nullable = false)
    private Boolean isActive = Boolean.TRUE;

    @Column(nullable = false)
    private Boolean isFeatured = Boolean.FALSE;
    @Column(name = "featured_until")
    private LocalDateTime featuredUntil;
    @Column(nullable = false)
    private LocalDateTime publishedAt;

    private LocalDateTime expiresAt;

    private String seoTitle;

    @Column(columnDefinition = "TEXT")
    private String seoDescription;
}
