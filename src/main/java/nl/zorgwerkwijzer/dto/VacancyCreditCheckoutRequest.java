package nl.zorgwerkwijzer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VacancyCreditCheckoutRequest {

    @NotBlank(message = "bundleType is verplicht")
    @Pattern(regexp = "single|bundle3|bundle5", message = "bundleType moet single, bundle3 of bundle5 zijn")
    private String bundleType;
}
