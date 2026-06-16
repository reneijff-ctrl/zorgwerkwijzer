package nl.zorgwerkwijzer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Registration request. Role is always set to USER by the server.")
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 255)
    @Schema(description = "Email address", example = "user@example.com")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    @Pattern(
        regexp = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$",
        message = "Password must contain at least one letter, one digit and one special character"
    )
    @Schema(description = "Password (min 8 chars, requires letter, digit and special char)", example = "Secur3Pass!")
    private String password;

    @Size(max = 100)
    @Schema(description = "First name", example = "Jan")
    private String firstName;

    @Size(max = 100)
    @Schema(description = "Last name", example = "de Vries")
    private String lastName;

    @Size(max = 50)
    @Schema(description = "Phone number", example = "+31612345678")
    private String phoneNumber;
}
