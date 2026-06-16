package nl.zorgwerkwijzer.dto.admin;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nl.zorgwerkwijzer.model.EducationLevel;
import nl.zorgwerkwijzer.model.EmploymentType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Detailed vacancy representation for admin management")
public class AdminVacancyDetailDto {

    @Schema(description = "Vacancy ID")
    private Long id;

    @Schema(description = "Vacancy title")
    private String title;

    @Schema(description = "Vacancy slug")
    private String slug;

    @Schema(description = "Vacancy description")
    private String description;

    @Schema(description = "Vacancy requirements")
    private String requirements;

    // ── Werkgever ──────────────────────────────────────────────────────────────
    @Schema(description = "Employer ID")
    private Long employerId;

    @Schema(description = "Employer name")
    private String employerName;

    @Schema(description = "Employer slug (for public profile link)")
    private String employerSlug;

    @Schema(description = "Employer email")
    private String employerEmail;

    // ── Locatie & classificatie ────────────────────────────────────────────────
    @Schema(description = "City ID")
    private Long cityId;

    @Schema(description = "Occupation ID")
    private Long occupationId;

    @Schema(description = "Employment type")
    private EmploymentType employmentType;

    @Schema(description = "Education level")
    private EducationLevel educationLevel;

    // ── Salaris & uren ────────────────────────────────────────────────────────
    @Schema(description = "Minimum salary")
    private BigDecimal salaryMin;

    @Schema(description = "Maximum salary")
    private BigDecimal salaryMax;

    @Schema(description = "Minimum hours per week")
    private Integer hoursMin;

    @Schema(description = "Maximum hours per week")
    private Integer hoursMax;

    // ── Status ────────────────────────────────────────────────────────────────
    @Schema(description = "Whether the vacancy is active")
    private Boolean isActive;

    @Schema(description = "Whether the vacancy is featured")
    private Boolean isFeatured;

    // ── SEO ───────────────────────────────────────────────────────────────────
    @Schema(description = "SEO title")
    private String seoTitle;

    @Schema(description = "SEO description")
    private String seoDescription;

    // ── Statistieken ──────────────────────────────────────────────────────────
    @Schema(description = "Total number of applications")
    private long applicationCount;

    // ── Tijdstempels ──────────────────────────────────────────────────────────
    @Schema(description = "Vacancy publication timestamp")
    private LocalDateTime publishedAt;

    @Schema(description = "Vacancy expiry timestamp (or null if no expiry)")
    private LocalDateTime expiresAt;

    @Schema(description = "Record creation timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Record last update timestamp")
    private LocalDateTime updatedAt;
}
