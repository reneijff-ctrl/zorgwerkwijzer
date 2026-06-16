package nl.zorgwerkwijzer.dto.dashboard;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nl.zorgwerkwijzer.model.ApplicationStatus;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Application summary for the employer dashboard")
public class DashboardApplicationDto {

    private Long id;
    private Long vacancyId;
    private String vacancyTitle;
    private String vacancySlug;
    private Long profileId;
    private String applicantName;
    private String applicantEmail;
    private ApplicationStatus status;
    private String coverLetter;
    private LocalDateTime appliedAt;

    // Profieldetails (voor sollicitatiedetailpagina)
    private String applicantPhone;
    private String applicantCity;
    private String applicantProfession;
    private String applicantEducation;
    private Integer applicantExperienceYears;
    private String applicantBio;
    private String applicantLinkedinUrl;
    private String applicantCvUrl;
    private String applicantAvailability;
    private Integer applicantDesiredHours;
}
