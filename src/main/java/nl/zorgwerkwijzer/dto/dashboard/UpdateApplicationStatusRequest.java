package nl.zorgwerkwijzer.dto.dashboard;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import nl.zorgwerkwijzer.model.ApplicationStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to update the status of an application")
public class UpdateApplicationStatusRequest {

    @NotNull(message = "Status is verplicht")
    @Schema(description = "New application status", example = "INVITED")
    private ApplicationStatus status;
}
