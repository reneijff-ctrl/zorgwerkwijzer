package nl.zorgwerkwijzer.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "employer_subscriptions")
@Getter
@Setter
@NoArgsConstructor
public class EmployerSubscription extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false, unique = true)
    private Employer employer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    private SubscriptionPackage subscriptionPackage;

    @Column(length = 100, unique = true)
    private String stripeCustomerId;

    @Column(length = 100, unique = true)
    private String stripeSubscriptionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private SubscriptionStatus status = SubscriptionStatus.INACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BillingInterval billingInterval = BillingInterval.MONTHLY;

    private LocalDateTime currentPeriodStart;
    private LocalDateTime currentPeriodEnd;
    private LocalDateTime trialEnd;
    private LocalDateTime canceledAt;

    @Column(nullable = false)
    private boolean cancelAtPeriodEnd = false;
}
