package nl.zorgwerkwijzer.dto.admin;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Full employer detail for admin detail view including subscription and linked data")
public class AdminEmployerDetailDto {

    // ── Basisinfo ─────────────────────────────────────────────────────────────
    @Schema(description = "Employer ID")
    private Long id;

    @Schema(description = "Employer name")
    private String name;

    @Schema(description = "Employer email")
    private String email;

    @Schema(description = "Employer slug")
    private String slug;

    @Schema(description = "Phone number")
    private String phoneNumber;

    @Schema(description = "Address")
    private String address;

    @Schema(description = "City")
    private String city;

    @Schema(description = "Province")
    private String province;

    @Schema(description = "Postal code")
    private String postalCode;

    @Schema(description = "Website URL")
    private String websiteUrl;

    @Schema(description = "Logo URL")
    private String logoUrl;

    @Schema(description = "Employee count range")
    private String employeeCount;

    @Schema(description = "Founded year")
    private Integer foundedYear;

    @Schema(description = "Account creation timestamp")
    private LocalDateTime createdAt;

    // ── Subscription ──────────────────────────────────────────────────────────
    @Schema(description = "Subscription status (or null if no subscription)")
    private String subscriptionStatus;

    @Schema(description = "Package name (or null if no subscription)")
    private String packageName;

    @Schema(description = "Package display name (or null if no subscription)")
    private String packageDisplayName;

    @Schema(description = "Billing interval: MONTHLY or YEARLY (or null)")
    private String billingInterval;

    @Schema(description = "Stripe Customer ID (or null)")
    private String stripeCustomerId;

    @Schema(description = "Stripe Subscription ID (or null)")
    private String stripeSubscriptionId;

    @Schema(description = "Current billing period start (or null)")
    private LocalDateTime currentPeriodStart;

    @Schema(description = "Current billing period end (or null)")
    private LocalDateTime currentPeriodEnd;

    @Schema(description = "Subscription cancellation timestamp (or null)")
    private LocalDateTime canceledAt;

    // ── Gekoppelde data ───────────────────────────────────────────────────────
    @Schema(description = "Vacancies belonging to this employer")
    private List<AdminVacancySummaryDto> vacancies;

    @Schema(description = "Users linked to this employer")
    private List<AdminUserDto> linkedUsers;
}
