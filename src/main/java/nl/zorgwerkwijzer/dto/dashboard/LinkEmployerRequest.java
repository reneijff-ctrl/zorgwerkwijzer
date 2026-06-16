package nl.zorgwerkwijzer.dto.dashboard;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request to link an employer to the authenticated user and assign ROLE_EMPLOYER")
public class LinkEmployerRequest {

    @NotNull(message = "Employer ID is required")
    @Schema(description = "ID of the employer to link to this user account", example = "1")
    private Long employerId;
}
