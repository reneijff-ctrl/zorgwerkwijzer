package nl.zorgwerkwijzer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
@Schema(description = "Request body for creating or updating a vacancy")
public class VacancyCreateUpdateDto {

    @NotNull(message = "Employer ID is required")
    @Schema(description = "ID of the employer", example = "1")
    private Long employerId;

    @Schema(description = "ID of the city (optional)", example = "5")
    private Long cityId;

    @Schema(description = "ID of the occupation (optional)", example = "3")
    private Long occupationId;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    @Schema(description = "Job title", example = "Verpleegkundige Ouderenzorg")
    private String title;

    @Pattern(regexp = "^[a-z0-9-]*$", message = "Slug may only contain lowercase letters, digits and hyphens")
    @Schema(description = "SEO-friendly URL slug, auto-generated if left empty")
    private String slug;

    @NotBlank(message = "Description is required")
    @Schema(description = "Full job description")
    private String description;

    @Schema(description = "Job requirements")
    private String requirements;

    @DecimalMin(value = "0.0", message = "Minimum salary cannot be negative")
    @Schema(description = "Minimum gross monthly salary", example = "2500.00")
    private BigDecimal salaryMin;

    @DecimalMin(value = "0.0", message = "Maximum salary cannot be negative")
    @Schema(description = "Maximum gross monthly salary", example = "3500.00")
    private BigDecimal salaryMax;

    @Min(value = 0, message = "Minimum hours cannot be negative")
    @Max(value = 60, message = "Minimum hours cannot exceed 60")
    @Schema(description = "Minimum weekly hours", example = "32")
    private Integer hoursMin;

    @Min(value = 0, message = "Maximum hours cannot be negative")
    @Max(value = 60, message = "Maximum hours cannot exceed 60")
    @Schema(description = "Maximum weekly hours", example = "36")
    private Integer hoursMax;

    @Schema(description = "Type of employment contract", example = "VAST")
    private EmploymentType employmentType;

    @Schema(description = "Required education level", example = "HBO")
    private EducationLevel educationLevel;

    @Schema(description = "Whether this vacancy is active", example = "true")
    private Boolean isActive;

    @Schema(description = "Date the vacancy was published")
    private LocalDateTime publishedAt;

    @Schema(description = "Date the vacancy expires")
    private LocalDateTime expiresAt;

    @Size(max = 255, message = "SEO title must not exceed 255 characters")
    @Schema(description = "SEO meta title")
    private String seoTitle;

    @Schema(description = "SEO meta description")
    private String seoDescription;
    @Schema(description = "Whether this vacancy should be featured", example = "false")
    private Boolean isFeatured;
    @Schema(description = "Date until which the vacancy is featured")
    private LocalDateTime featuredUntil;
}
