package nl.zorgwerkwijzer.dto;

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
@Schema(description = "User representation (never includes password)")
public class UserDto {

    @Schema(description = "User ID")
    private Long id;

    @Schema(description = "Email address")
    private String email;

    @Schema(description = "Assigned role")
    private UserRole role;

    @Schema(description = "Linked employer ID (only for ROLE_EMPLOYER)")
    private Long employerId;

    @Schema(description = "Account creation timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Whether Two-Factor Authentication is enabled for this account")
    private boolean twoFactorEnabled;
}
