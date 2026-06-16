package nl.zorgwerkwijzer.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "profiles")
@Getter
@Setter
@NoArgsConstructor
public class Profile extends BaseEntity {

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number", length = 50)
    private String phoneNumber;

    @Column(name = "cv_url", columnDefinition = "TEXT")
    private String cvUrl;

    @Column(name = "current_occupation_id")
    private Long currentOccupationId;

    @Column(name = "is_searching", nullable = false)
    private Boolean isSearching = Boolean.TRUE;

    @Column(name = "city", length = 150)
    private String city;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "profession", length = 150)
    private String profession;

    @Column(name = "education", length = 150)
    private String education;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "linkedin_url", length = 500)
    private String linkedinUrl;

    @Column(name = "availability", length = 100)
    private String availability;

    @Column(name = "desired_hours")
    private Integer desiredHours;
}
