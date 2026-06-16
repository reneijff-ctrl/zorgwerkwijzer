package nl.zorgwerkwijzer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import nl.zorgwerkwijzer.model.UserRole;

@Data
@Schema(description = "Request to update a user's role (admin only)")
public class RoleUpdateRequest {

    @NotNull(message = "Role is required")
    @Schema(description = "New role to assign", example = "ROLE_EMPLOYER")
    private UserRole role;
}
