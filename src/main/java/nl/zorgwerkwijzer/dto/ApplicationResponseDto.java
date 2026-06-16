package nl.zorgwerkwijzer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nl.zorgwerkwijzer.model.ApplicationStatus;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Application details returned by the API")
public class ApplicationResponseDto {

    @Schema(description = "Unique identifier", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Schema(description = "ID of the vacancy")
    private Long vacancyId;

    @Schema(description = "Title of the vacancy", example = "Verpleegkundige")
    private String vacancyTitle;

    @Schema(description = "SEO slug of the vacancy", example = "verpleegkundige-amsterdam-1")
    private String vacancySlug;

    @Schema(description = "Name of the employer", example = "Buurtzorg")
    private String employerName;

    @Schema(description = "ID of the profile")
    private Long profileId;

    @Schema(description = "Full name of the applicant", example = "Anna de Vries")
    private String profileName;

    @Schema(description = "Current status of the application")
    private ApplicationStatus status;

    @Schema(description = "Cover letter submitted with the application")
    private String coverLetter;

    @Schema(description = "Timestamp when the application was submitted", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;
}
