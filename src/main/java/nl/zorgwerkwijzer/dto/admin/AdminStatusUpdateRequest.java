package nl.zorgwerkwijzer.dto.admin;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request body for manually updating a subscription status")
public class AdminStatusUpdateRequest {

    @NotBlank(message = "Status mag niet leeg zijn")
    @Schema(description = "New subscription status", allowableValues = {"ACTIVE", "TRIALING", "PAST_DUE", "CANCELED", "INACTIVE"})
    private String status;
}
