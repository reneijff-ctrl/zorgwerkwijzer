package nl.zorgwerkwijzer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContactRequestDto {

    @NotBlank(message = "Naam is verplicht")
    @Size(max = 100, message = "Naam mag maximaal 100 tekens bevatten")
    private String name;

    @NotBlank(message = "E-mailadres is verplicht")
    @Email(message = "Ongeldig e-mailadres")
    @Size(max = 255, message = "E-mailadres mag maximaal 255 tekens bevatten")
    private String email;

    @NotBlank(message = "Bericht is verplicht")
    @Size(min = 10, max = 5000, message = "Bericht moet tussen 10 en 5000 tekens bevatten")
    private String message;
}
