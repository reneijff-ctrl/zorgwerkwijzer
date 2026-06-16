package nl.zorgwerkwijzer.dto.dashboard;

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
@Schema(description = "Vacancy summary for the employer dashboard")
public class DashboardVacancyDto {

    private Long id;
    private String title;
    private String slug;
    private Boolean isActive;
    private Boolean isFeatured;
    private EmploymentType employmentType;
    private EducationLevel educationLevel;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private Integer hoursMin;
    private Integer hoursMax;
    private Long applicationCount;
    private LocalDateTime publishedAt;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime featuredUntil;
}
