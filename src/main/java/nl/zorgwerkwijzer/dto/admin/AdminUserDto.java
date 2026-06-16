package nl.zorgwerkwijzer.dto.admin;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nl.zorgwerkwijzer.model.UserRole;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User representation for admin management")
public class AdminUserDto {

    @Schema(description = "User ID")
    private Long id;

    @Schema(description = "Email address")
    private String email;

    @Schema(description = "Assigned role")
    private UserRole role;

    @Schema(description = "Linked employer ID (only for ROLE_EMPLOYER)")
    private Long employerId;

    @Schema(description = "Linked employer name (only for ROLE_EMPLOYER)")
    private String employerName;

    @Schema(description = "Account creation timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "True if this is the only user linked to the employer (warning: employer will lose access)")
    private boolean isLastEmployerUser;
}
