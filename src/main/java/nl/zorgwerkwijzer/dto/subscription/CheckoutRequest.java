package nl.zorgwerkwijzer.dto.subscription;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CheckoutRequest {

    @NotNull(message = "packageId is verplicht")
    private Long packageId;

    @NotBlank(message = "billingInterval is verplicht")
    @Pattern(regexp = "MONTHLY|YEARLY", message = "billingInterval moet MONTHLY of YEARLY zijn")
    private String billingInterval;

    @NotBlank(message = "successUrl is verplicht")
    private String successUrl;

    @NotBlank(message = "cancelUrl is verplicht")
    private String cancelUrl;
}
