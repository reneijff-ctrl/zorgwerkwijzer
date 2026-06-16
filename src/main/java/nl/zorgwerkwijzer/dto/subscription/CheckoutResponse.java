package nl.zorgwerkwijzer.dto.subscription;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CheckoutResponse {
    private String checkoutUrl;
}
