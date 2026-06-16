package nl.zorgwerkwijzer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request body for submitting a job application")
public class ApplicationRequestDto {

    @NotNull
    @Schema(description = "ID of the vacancy to apply for", example = "1")
    private Long vacancyId;

    @NotNull
    @Schema(description = "ID of the applicant profile", example = "5")
    private Long profileId;

    @Size(max = 5000)
    @Schema(description = "Optional cover letter", example = "Geachte heer/mevrouw...")
    private String coverLetter;
}
