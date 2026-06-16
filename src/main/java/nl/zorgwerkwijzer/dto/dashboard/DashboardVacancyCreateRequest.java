package nl.zorgwerkwijzer.dto.dashboard;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
@Schema(description = "Request body for creating or updating a vacancy via the employer dashboard")
public class DashboardVacancyCreateRequest {

    @Schema(description = "ID of the city (optional)", example = "5")
    private Long cityId;

    @Schema(description = "ID of the occupation (optional)", example = "3")
    private Long occupationId;

    @NotBlank(message = "Titel is verplicht")
    @Size(max = 255, message = "Titel mag maximaal 255 tekens bevatten")
    @Schema(description = "Job title", example = "Verpleegkundige Ouderenzorg")
    private String title;

    @Pattern(regexp = "^[a-z0-9-]*$", message = "Slug mag alleen kleine letters, cijfers en koppeltekens bevatten")
    @Size(max = 300)
    @Schema(description = "SEO slug, auto-gegenereerd als leeg gelaten")
    private String slug;

    @NotBlank(message = "Omschrijving is verplicht")
    @Schema(description = "Full job description")
    private String description;

    @Schema(description = "Job requirements")
    private String requirements;

    @DecimalMin(value = "0.0", message = "Minimumsalaris mag niet negatief zijn")
    @Schema(description = "Minimum gross monthly salary", example = "2500.00")
    private BigDecimal salaryMin;

    @DecimalMin(value = "0.0", message = "Maximumsalaris mag niet negatief zijn")
    @Schema(description = "Maximum gross monthly salary", example = "3500.00")
    private BigDecimal salaryMax;

    @Min(value = 0, message = "Minimum uren mag niet negatief zijn")
    @Max(value = 60, message = "Minimum uren mag niet meer dan 60 zijn")
    @Schema(description = "Minimum weekly hours", example = "32")
    private Integer hoursMin;

    @Min(value = 0, message = "Maximum uren mag niet negatief zijn")
    @Max(value = 60, message = "Maximum uren mag niet meer dan 60 zijn")
    @Schema(description = "Maximum weekly hours", example = "36")
    private Integer hoursMax;

    @Schema(description = "Type of employment contract", example = "VAST")
    private EmploymentType employmentType;

    @Schema(description = "Required education level", example = "HBO")
    private EducationLevel educationLevel;

    @Schema(description = "Whether this vacancy is active", example = "true")
    private Boolean isActive;

    @Schema(description = "Date the vacancy expires")
    private LocalDateTime expiresAt;

    @Size(max = 255, message = "SEO titel mag maximaal 255 tekens bevatten")
    @Schema(description = "SEO meta title")
    private String seoTitle;

    @Schema(description = "SEO meta description")
    private String seoDescription;
    @Schema(description = "Whether this vacancy should be featured", example = "false")
    private Boolean isFeatured;
    @Schema(description = "Date until which the vacancy is featured")
    private LocalDateTime featuredUntil;
}
