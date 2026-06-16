package nl.zorgwerkwijzer.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "employer_credit_transactions")
@Getter
@Setter
@NoArgsConstructor
public class EmployerCreditTransaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employer_id", nullable = false)
    private Employer employer;

    @Column(nullable = false)
    private Integer creditsAdded = 0;

    @Column(nullable = false)
    private Integer creditsUsed = 0;

    @Column(length = 200)
    private String reason;

    @Column(length = 200)
    private String stripePaymentIntent;

    @Column(length = 50)
    private String bundleType;
}
