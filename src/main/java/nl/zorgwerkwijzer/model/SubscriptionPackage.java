package nl.zorgwerkwijzer.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "subscription_packages")
@Getter
@Setter
@NoArgsConstructor
public class SubscriptionPackage extends BaseEntity {

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(nullable = false, length = 100)
    private String displayName;

    @Column(name = "price_monthly_cents", nullable = false)
    private Integer priceMonthly;

    @Column(name = "price_yearly_cents", nullable = false)
    private Integer priceYearly;

    @Column(length = 100)
    private String stripePriceIdMonthly;

    @Column(length = 100)
    private String stripePriceIdYearly;

    // NULL = onbeperkt (PREMIUM)
    private Integer maxActiveVacancies;

    @Column(nullable = false)
    private Boolean canViewCv = Boolean.FALSE;

    @Column(nullable = false)
    private Boolean canSeeApplicantContact = Boolean.FALSE;

    @Column(nullable = false)
    private Boolean isFeaturedIncluded = Boolean.FALSE;

    @Column(nullable = false)
    private Boolean isActive = Boolean.TRUE;
}
