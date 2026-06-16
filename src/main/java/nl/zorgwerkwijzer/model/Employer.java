package nl.zorgwerkwijzer.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "employers")
@Getter
@Setter
@NoArgsConstructor
public class Employer extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false, unique = true)
    private String email;

    private String phoneNumber;

    @Column(length = 500)
    private String address;

    @Column(columnDefinition = "TEXT")
    private String logoUrl;

    @Column(columnDefinition = "TEXT")
    private String websiteUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String coverImageUrl;

    private String city;

    private String province;

    private String postalCode;

    private String employeeCount;

    private Integer foundedYear;

    @Column(nullable = false)
    private Boolean isPremium = Boolean.FALSE;

    @Column(nullable = false)
    private Integer vacancyCredits = 0;

    // Navigatie naar abonnement — geen FK-kolom in deze tabel (geen circulaire FK)
    @OneToOne(mappedBy = "employer", fetch = FetchType.LAZY)
    private EmployerSubscription subscription;

    private String seoTitle;

    @Column(columnDefinition = "TEXT")
    private String seoDescription;

    @Column(name = "kvk_number", length = 8, unique = true)
    private String kvkNumber;
}
