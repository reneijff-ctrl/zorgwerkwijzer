package nl.zorgwerkwijzer.dto.subscription;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SubscriptionPackageDto {

    private Long id;
    private String name;
    private String displayName;
    private Integer priceMonthly;
    private Integer priceYearly;
    private Integer maxActiveVacancies;
    private Boolean canViewCv;
    private Boolean canSeeApplicantContact;
    private Boolean isFeaturedIncluded;
}
