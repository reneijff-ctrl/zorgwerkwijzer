package nl.zorgwerkwijzer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class EmployerRegistrationRequest {

    @NotBlank(message = "Company name is required")
    @Size(min = 2, max = 255, message = "Company name must be between 2 and 255 characters")
    private String companyName;

    @NotBlank(message = "Contact name is required")
    @Size(min = 2, max = 255, message = "Contact name must be between 2 and 255 characters")
    private String contactName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[0-9]).{8,}$",
        message = "Password must contain at least one uppercase letter and one digit"
    )
    private String password;

    @Size(max = 50, message = "Phone number must be at most 50 characters")
    private String phoneNumber;

    @Size(max = 500, message = "Website URL must be at most 500 characters")
    private String website;

    @NotBlank(message = "KvK-nummer is verplicht")
    @Pattern(regexp = "\\d{8}", message = "KvK-nummer moet exact 8 cijfers bevatten")
    private String kvkNumber;
}
