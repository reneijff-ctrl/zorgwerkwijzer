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
@Schema(description = "Lightweight vacancy summary for list views")
public class VacancyListDto {

    @Schema(description = "Unique identifier", example = "1")
    private Long id;

    @Schema(description = "Job title", example = "Verpleegkundige Ouderenzorg")
    private String title;

    @Schema(description = "SEO-friendly URL slug", example = "verpleegkundige-ouderenzorg-amsterdam-buurtzorg")
    private String slug;

    @Schema(description = "Name of the employer", example = "Buurtzorg Nederland")
    private String employerName;

    @Schema(description = "Slug of the employer", example = "buurtzorg-nederland")
    private String employerSlug;

    @Schema(description = "Logo URL of the employer")
    private String employerLogoUrl;

    @Schema(description = "Name of the city", example = "Amsterdam")
    private String cityName;

    @Schema(description = "Name of the occupation", example = "Verpleegkundige")
    private String occupationName;

    @Schema(description = "Type of employment", example = "VAST")
    private EmploymentType employmentType;

    @Schema(description = "Required education level", example = "HBO")
    private EducationLevel educationLevel;

    @Schema(description = "Minimum salary", example = "2500.00")
    private BigDecimal salaryMin;

    @Schema(description = "Maximum salary", example = "3500.00")
    private BigDecimal salaryMax;

    @Schema(description = "Minimum weekly hours", example = "32")
    private Integer hoursMin;

    @Schema(description = "Maximum weekly hours", example = "36")
    private Integer hoursMax;

    @Schema(description = "Date the vacancy was published")
    private LocalDateTime publishedAt;
    @Schema(description = "Whether this vacancy is featured")
    private Boolean isFeatured;
    @Schema(description = "Date until which the vacancy is featured")
    private LocalDateTime featuredUntil;
}
