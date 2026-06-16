package nl.zorgwerkwijzer.dto.admin;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Vacancy representation for admin management")
public class AdminVacancyDto {

    @Schema(description = "Vacancy ID")
    private Long id;

    @Schema(description = "Vacancy title")
    private String title;

    @Schema(description = "Vacancy slug")
    private String slug;

    @Schema(description = "Employer ID")
    private Long employerId;

    @Schema(description = "Employer name")
    private String employerName;

    @Schema(description = "Whether the vacancy is active")
    private Boolean isActive;

    @Schema(description = "Whether the vacancy is featured")
    private Boolean isFeatured;

    @Schema(description = "Number of applications received")
    private long applicationCount;

    @Schema(description = "Vacancy publication timestamp")
    private LocalDateTime publishedAt;

    @Schema(description = "Vacancy expiry timestamp (or null if no expiry)")
    private LocalDateTime expiresAt;

    @Schema(description = "Record creation timestamp")
    private LocalDateTime createdAt;
}
