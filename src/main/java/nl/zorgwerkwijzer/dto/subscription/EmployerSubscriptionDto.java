package nl.zorgwerkwijzer.dto.subscription;

import lombok.Builder;
import lombok.Getter;
import nl.zorgwerkwijzer.model.BillingInterval;
import nl.zorgwerkwijzer.model.SubscriptionStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class EmployerSubscriptionDto {

    private Long id;
    private String packageName;
    private String packageDisplayName;
    private Integer packagePriceMonthly;
    private Integer packagePriceYearly;
    private Integer maxActiveVacancies;
    private Boolean canViewCv;
    private Boolean canSeeApplicantContact;
    private Boolean isFeaturedIncluded;
    private SubscriptionStatus status;
    private BillingInterval billingInterval;
    private LocalDateTime currentPeriodStart;
    private LocalDateTime currentPeriodEnd;
    private LocalDateTime trialEnd;
    private LocalDateTime canceledAt;
    private String stripeCustomerId;
    private String stripeSubscriptionId;
    private boolean cancelAtPeriodEnd;
    private LocalDate periodEndDate;
}
