package nl.zorgwerkwijzer.dto;

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
@Schema(description = "Full vacancy details for the detail page")
public class VacancyDetailDto {

    @Schema(description = "Unique identifier", example = "1")
    private Long id;

    @Schema(description = "Job title", example = "Verpleegkundige Ouderenzorg")
    private String title;

    @Schema(description = "SEO-friendly URL slug")
    private String slug;

    @Schema(description = "Full job description")
    private String description;

    @Schema(description = "Job requirements")
    private String requirements;

    @Schema(description = "Name of the employer")
    private String employerName;

    @Schema(description = "Slug of the employer")
    private String employerSlug;

    @Schema(description = "Logo URL of the employer")
    private String employerLogoUrl;

    @Schema(description = "Website URL of the employer")
    private String employerWebsiteUrl;

    @Schema(description = "Name of the city")
    private String cityName;

    @Schema(description = "Name of the occupation")
    private String occupationName;

    @Schema(description = "Type of employment")
    private EmploymentType employmentType;

    @Schema(description = "Required education level")
    private EducationLevel educationLevel;

    @Schema(description = "Minimum salary")
    private BigDecimal salaryMin;

    @Schema(description = "Maximum salary")
    private BigDecimal salaryMax;

    @Schema(description = "Minimum weekly hours")
    private Integer hoursMin;

    @Schema(description = "Maximum weekly hours")
    private Integer hoursMax;

    @Schema(description = "Whether this vacancy is active")
    private Boolean isActive;

    @Schema(description = "Date the vacancy was published")
    private LocalDateTime publishedAt;

    @Schema(description = "Date the vacancy expires")
    private LocalDateTime expiresAt;

    @Schema(description = "SEO meta title")
    private String seoTitle;

    @Schema(description = "SEO meta description")
    private String seoDescription;

    @Schema(description = "Creation timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Last update timestamp")
    private LocalDateTime updatedAt;
    @Schema(description = "Whether this vacancy is featured")
    private Boolean isFeatured;
    @Schema(description = "Date until which the vacancy is featured")
    private LocalDateTime featuredUntil;
}
