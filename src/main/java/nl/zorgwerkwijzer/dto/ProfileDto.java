package nl.zorgwerkwijzer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Profile of a job-seeking care professional")
public class ProfileDto {

    @Schema(description = "Unique identifier", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Schema(description = "First name", example = "Anna")
    private String firstName;

    @NotBlank
    @Size(max = 100)
    @Schema(description = "Last name", example = "de Vries")
    private String lastName;

    @NotBlank
    @Email
    @Schema(description = "Email address", example = "anna.devries@email.nl")
    private String email;

    @Schema(description = "Phone number", example = "0612345678")
    private String phoneNumber;

    @Schema(description = "URL to uploaded CV document")
    private String cvUrl;

    @Schema(description = "ID of the current occupation")
    private Long currentOccupationId;

    @Schema(description = "Whether the candidate is actively searching", example = "true")
    private Boolean isSearching;

    @Schema(description = "City of residence", example = "Maastricht")
    private String city;

    @Schema(description = "Postal code", example = "6211 AB")
    private String postalCode;

    @Schema(description = "Job title / profession", example = "Verpleegkundige")
    private String profession;

    @Schema(description = "Highest completed education", example = "HBO Verpleegkunde")
    private String education;

    @Schema(description = "Years of work experience", example = "5")
    private Integer experienceYears;

    @Schema(description = "Short bio / personal introduction")
    private String bio;

    @Schema(description = "LinkedIn profile URL", example = "https://linkedin.com/in/anna-devries")
    private String linkedinUrl;

    @Schema(description = "Available from / availability description", example = "Per direct")
    private String availability;

    @Schema(description = "Desired working hours per week", example = "32")
    private Integer desiredHours;

    @Schema(description = "Timestamp of creation", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;
}
