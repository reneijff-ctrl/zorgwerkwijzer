package nl.zorgwerkwijzer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.ApplicationRequestDto;
import nl.zorgwerkwijzer.dto.ApplicationResponseDto;
import nl.zorgwerkwijzer.exception.ResourceNotFoundException;
import nl.zorgwerkwijzer.model.Application;
import nl.zorgwerkwijzer.model.ApplicationStatus;
import nl.zorgwerkwijzer.repository.ApplicationRepository;
import nl.zorgwerkwijzer.repository.ProfileRepository;
import nl.zorgwerkwijzer.service.ApplicationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
@Tag(name = "Applications", description = "Operations for managing job applications")
public class ApplicationController {

    private final ApplicationService    applicationService;
    private final ApplicationRepository applicationRepository;
    private final ProfileRepository     profileRepository;

    @PostMapping
    @Operation(summary = "Submit a new job application")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Application submitted"),
            @ApiResponse(responseCode = "400", description = "Invalid input or inactive vacancy"),
            @ApiResponse(responseCode = "404", description = "Vacancy or profile not found"),
            @ApiResponse(responseCode = "409", description = "Already applied to this vacancy")
    })
    public ResponseEntity<ApplicationResponseDto> create(@Valid @RequestBody ApplicationRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.create(dto));
    }

    @GetMapping
    @Operation(summary = "Get applications filtered by profileId or vacancyId")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Applications retrieved"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Page<ApplicationResponseDto>> getAll(
            @Parameter(description = "Filter by profile ID") @RequestParam(required = false) Long profileId,
            @Parameter(description = "Filter by vacancy ID") @RequestParam(required = false) Long vacancyId,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable,
            @AuthenticationPrincipal UserDetails principal) {

        if (profileId != null) {
            // Kandidaat mag alleen eigen sollicitaties opvragen
            if (!isAdminOrEmployer(principal)) {
                Long ownProfileId = resolveProfileId(principal);
                if (!ownProfileId.equals(profileId)) {
                    throw new AccessDeniedException("You can only view your own applications");
                }
            }
            return ResponseEntity.ok(applicationService.findByProfile(profileId, pageable));
        }
        if (vacancyId != null) {
            // Werkgever en admin mogen sollicitaties per vacature opvragen
            if (!isAdminOrEmployer(principal)) {
                throw new AccessDeniedException("Only employers and admins can view applications by vacancy");
            }
            return ResponseEntity.ok(applicationService.findByVacancy(vacancyId, pageable));
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get application by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Application found"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Application not found")
    })
    public ResponseEntity<ApplicationResponseDto> getById(
            @Parameter(description = "Application ID") @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        if (!isAdminOrEmployer(principal)) {
            checkApplicationOwnership(id, principal);
        }
        return ResponseEntity.ok(applicationService.findById(id));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    @Operation(summary = "Update the status of an application (employer or admin only)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Status updated"),
            @ApiResponse(responseCode = "403", description = "Access denied — employer or admin required"),
            @ApiResponse(responseCode = "404", description = "Application not found")
    })
    public ResponseEntity<ApplicationResponseDto> updateStatus(
            @Parameter(description = "Application ID") @PathVariable Long id,
            @Parameter(description = "New status") @RequestParam ApplicationStatus status) {
        return ResponseEntity.ok(applicationService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an application (own application or admin)")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Application deleted"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Application not found")
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "Application ID") @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        if (!isAdminOrEmployer(principal)) {
            checkApplicationOwnership(id, principal);
        }
        applicationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────────────────────────────────

    private void checkApplicationOwnership(Long applicationId, UserDetails principal) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));
        String ownerEmail = application.getProfile().getEmail();
        if (!ownerEmail.equalsIgnoreCase(principal.getUsername())) {
            throw new AccessDeniedException("You can only access your own applications");
        }
    }

    private Long resolveProfileId(UserDetails principal) {
        return profileRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + principal.getUsername()))
                .getId();
    }

    private boolean isAdminOrEmployer(UserDetails principal) {
        return principal != null && principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                            || a.getAuthority().equals("ROLE_EMPLOYER"));
    }
}
