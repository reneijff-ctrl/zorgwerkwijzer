package nl.zorgwerkwijzer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TwoFactorLoginRequest {

    @NotBlank(message = "tempToken is verplicht")
    private String tempToken;

    @NotBlank(message = "code is verplicht")
    private String code;
}
