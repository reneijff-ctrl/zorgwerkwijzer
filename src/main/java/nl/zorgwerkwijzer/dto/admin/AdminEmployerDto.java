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
@Schema(description = "Employer representation for admin list view")
public class AdminEmployerDto {

    @Schema(description = "Employer ID")
    private Long id;

    @Schema(description = "Employer name")
    private String name;

    @Schema(description = "Employer email")
    private String email;

    @Schema(description = "Employer slug")
    private String slug;

    @Schema(description = "City")
    private String city;

    @Schema(description = "Subscription status (ACTIVE, TRIALING, PAST_DUE, CANCELED, INACTIVE, or null if no subscription)")
    private String subscriptionStatus;

    @Schema(description = "Package name (STARTER, PROFESSIONAL, PREMIUM, or null if no subscription)")
    private String packageName;

    @Schema(description = "Number of active vacancies")
    private long activeVacancyCount;

    @Schema(description = "Account creation timestamp")
    private LocalDateTime createdAt;
}
