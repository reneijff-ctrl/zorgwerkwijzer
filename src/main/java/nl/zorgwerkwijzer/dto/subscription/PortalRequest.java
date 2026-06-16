package nl.zorgwerkwijzer.dto.subscription;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PortalRequest {

    @NotBlank(message = "returnUrl is verplicht")
    private String returnUrl;
}
