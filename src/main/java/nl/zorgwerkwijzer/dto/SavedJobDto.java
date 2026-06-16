package nl.zorgwerkwijzer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "A vacancy saved/bookmarked by a profile")
public class SavedJobDto {

    @Schema(description = "Unique identifier", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotNull
    @Schema(description = "ID of the vacancy to save", example = "1")
    private Long vacancyId;

    @NotNull
    @Schema(description = "ID of the profile saving the vacancy", example = "5")
    private Long profileId;

    @Schema(description = "Title of the saved vacancy", example = "Verpleegkundige", accessMode = Schema.AccessMode.READ_ONLY)
    private String vacancyTitle;

    @Schema(description = "SEO slug of the vacancy for deep-linking", accessMode = Schema.AccessMode.READ_ONLY)
    private String vacancySlug;

    @Schema(description = "Name of the employer", accessMode = Schema.AccessMode.READ_ONLY)
    private String employerName;

    @Schema(description = "City of the vacancy", accessMode = Schema.AccessMode.READ_ONLY)
    private String cityName;

    @Schema(description = "Timestamp when the vacancy was saved", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime savedAt;
}
