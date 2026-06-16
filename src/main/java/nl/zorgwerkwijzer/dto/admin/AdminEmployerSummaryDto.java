package nl.zorgwerkwijzer.dto.admin;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Compact employer representation for lists and recent activity")
public class AdminEmployerSummaryDto {

    @Schema(description = "Employer ID")
    private Long id;

    @Schema(description = "Employer name")
    private String name;

    @Schema(description = "Employer slug")
    private String slug;

    @Schema(description = "Subscription status (ACTIVE, TRIALING, PAST_DUE, CANCELED, INACTIVE, or null)")
    private String subscriptionStatus;

    @Schema(description = "Account creation timestamp")
    private LocalDateTime createdAt;
}
