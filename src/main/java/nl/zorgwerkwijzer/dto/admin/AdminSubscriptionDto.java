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
@Schema(description = "Employer subscription representation for admin management")
public class AdminSubscriptionDto {

    @Schema(description = "Subscription ID")
    private Long id;

    @Schema(description = "Employer ID")
    private Long employerId;

    @Schema(description = "Employer name")
    private String employerName;

    @Schema(description = "Employer email")
    private String employerEmail;

    @Schema(description = "Package name (STARTER, PROFESSIONAL, PREMIUM)")
    private String packageName;

    @Schema(description = "Package display name")
    private String packageDisplayName;

    @Schema(description = "Monthly price in cents")
    private Integer priceMonthly;

    @Schema(description = "Subscription status")
    private String status;

    @Schema(description = "Billing interval: MONTHLY or YEARLY")
    private String billingInterval;

    @Schema(description = "Current billing period end")
    private LocalDateTime currentPeriodEnd;

    @Schema(description = "Cancellation timestamp (or null)")
    private LocalDateTime canceledAt;

    @Schema(description = "Trial end timestamp (or null)")
    private LocalDateTime trialEnd;

    @Schema(description = "Yearly price in cents (or null)")
    private Integer priceYearly;

    @Schema(description = "Stripe Subscription ID (or null)")
    private String stripeSubscriptionId;

    @Schema(description = "Stripe Customer ID (or null)")
    private String stripeCustomerId;

    @Schema(description = "Record creation timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Whether the subscription will cancel at period end")
    private boolean cancelAtPeriodEnd;

    @Schema(description = "Lifetime revenue from this employer in cents (subscriptions + credits)")
    private long lifetimeRevenue;
}
