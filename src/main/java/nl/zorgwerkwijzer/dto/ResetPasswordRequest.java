package nl.zorgwerkwijzer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Schema(description = "Request to reset a password using a valid token")
public class ResetPasswordRequest {

    @NotBlank(message = "Token is verplicht")
    @Schema(description = "Password-reset token received via email")
    private String token;

    @NotBlank(message = "Nieuw wachtwoord is verplicht")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*\\d).{8,}$",
            message = "Wachtwoord moet minimaal 8 tekens, één hoofdletter en één cijfer bevatten"
    )
    @Schema(description = "New password — minimum 8 characters, one uppercase, one digit",
            example = "Veilig1234")
    private String newPassword;
}
