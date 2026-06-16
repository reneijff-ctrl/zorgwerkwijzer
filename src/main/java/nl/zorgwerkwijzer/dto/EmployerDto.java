package nl.zorgwerkwijzer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
@Schema(description = "Employer (werkgever) information")
public class EmployerDto {

    @Schema(description = "Unique identifier", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    @Schema(description = "Name of the employer", example = "Buurtzorg Nederland")
    private String name;

    @Pattern(regexp = "^[a-z0-9-]*$", message = "Slug may only contain lowercase letters, digits and hyphens")
    @Schema(description = "SEO-friendly URL slug, auto-generated if left empty", example = "buurtzorg-nederland")
    private String slug;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Schema(description = "Contact email address", example = "contact@buurtzorg.nl")
    private String email;

    @Schema(description = "Contact phone number", example = "+31 88 070 0800")
    private String phoneNumber;

    @Schema(description = "Office address", example = "Transistorstraat 40, 1322 CG Almere")
    private String address;

    @Size(max = 2048, message = "Logo URL must not exceed 2048 characters")
    @Schema(description = "URL of the company logo", example = "https://cdn.buurtzorg.nl/logo.png")
    private String logoUrl;

    @Size(max = 2048, message = "Website URL must not exceed 2048 characters")
    @Schema(description = "Company website URL", example = "https://www.buurtzorg.nl")
    private String websiteUrl;

    @Schema(description = "Company description")
    private String description;

    @Size(max = 2048, message = "Cover image URL must not exceed 2048 characters")
    @Schema(description = "URL of the cover/header image", example = "https://cdn.example.nl/cover.jpg")
    private String coverImageUrl;

    @Schema(description = "City where the employer is located", example = "Almere")
    private String city;

    @Schema(description = "Province where the employer is located", example = "Flevoland")
    private String province;

    @Schema(description = "Postal code", example = "1322 CG")
    private String postalCode;

    @Schema(description = "Number of employees", example = "1000-5000")
    private String employeeCount;

    @Schema(description = "Year the company was founded", example = "2006")
    private Integer foundedYear;

    @Schema(description = "Whether this is a premium employer", accessMode = Schema.AccessMode.READ_ONLY)
    private Boolean isPremium;

    @Size(max = 255, message = "SEO title must not exceed 255 characters")
    @Schema(description = "SEO meta title for the employer profile page")
    private String seoTitle;

    @Schema(description = "SEO meta description for the employer profile page")
    private String seoDescription;

    @Schema(description = "Number of active vacancies", accessMode = Schema.AccessMode.READ_ONLY)
    private Integer vacancyCount;

    @Schema(description = "Creation timestamp", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;

    @Schema(description = "Last update timestamp", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime updatedAt;
}
