package nl.zorgwerkwijzer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Health status response")
public class HealthResponseDto {
    @Schema(description = "Overall status of the application", example = "UP")
    private String status;

    @Schema(description = "Name of the application", example = "ZorgWerkWijzer")
    private String application;

    @Schema(description = "Version of the application", example = "1.0.0")
    private String version;
}
