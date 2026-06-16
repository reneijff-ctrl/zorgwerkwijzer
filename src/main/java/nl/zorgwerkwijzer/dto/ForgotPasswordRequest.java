package nl.zorgwerkwijzer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Schema(description = "Request to initiate the password reset flow")
public class ForgotPasswordRequest {

    @NotBlank(message = "E-mailadres is verplicht")
    @Email(message = "Ongeldig e-mailadres")
    @Schema(description = "Registered email address", example = "jan@voorbeeld.nl")
    private String email;
}
