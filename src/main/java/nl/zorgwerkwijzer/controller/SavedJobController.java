package nl.zorgwerkwijzer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.SavedJobDto;
import nl.zorgwerkwijzer.exception.ResourceNotFoundException;
import nl.zorgwerkwijzer.repository.ProfileRepository;
import nl.zorgwerkwijzer.service.SavedJobService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/saved-jobs")
@RequiredArgsConstructor
@Tag(name = "Saved Jobs", description = "Operations for saving and managing bookmarked vacancies")
public class SavedJobController {

    private final SavedJobService   savedJobService;
    private final ProfileRepository profileRepository;

    @PostMapping
    @Operation(summary = "Save a vacancy to a profile's bookmarks")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Vacancy saved"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Vacancy or profile not found"),
            @ApiResponse(responseCode = "409", description = "Vacancy already saved")
    })
    public ResponseEntity<SavedJobDto> save(
            @Valid @RequestBody SavedJobDto dto,
            @AuthenticationPrincipal UserDetails principal) {
        checkProfileOwnership(dto.getProfileId(), principal);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedJobService.save(dto.getVacancyId(), dto.getProfileId()));
    }

    @DeleteMapping("/{vacancyId}")
    @Operation(summary = "Remove a saved vacancy from a profile's bookmarks (own bookmarks or admin)")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Saved job removed"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Saved job not found")
    })
    public ResponseEntity<Void> remove(
            @Parameter(description = "Vacancy ID to remove") @PathVariable Long vacancyId,
            @Parameter(description = "Profile ID") @RequestParam Long profileId,
            @AuthenticationPrincipal UserDetails principal) {
        checkProfileOwnership(profileId, principal);
        savedJobService.remove(vacancyId, profileId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Operation(summary = "Get all saved vacancies for a profile (own bookmarks or admin)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Saved jobs retrieved"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Page<SavedJobDto>> getByProfile(
            @Parameter(description = "Profile ID") @RequestParam Long profileId,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable,
            @AuthenticationPrincipal UserDetails principal) {
        checkProfileOwnership(profileId, principal);
        return ResponseEntity.ok(savedJobService.findByProfile(profileId, pageable));
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Verifieer dat de ingelogde gebruiker eigenaar is van het gevraagde profiel,
     * of ROLE_ADMIN heeft. ROLE_EMPLOYER wordt niet toegestaan (werkgevers slaan
     * geen vacatures op namens kandidaten).
     */
    private void checkProfileOwnership(Long profileId, UserDetails principal) {
        if (principal == null) {
            throw new AccessDeniedException("Authentication required");
        }
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) {
            return;
        }
        Long ownProfileId = profileRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + principal.getUsername()))
                .getId();
        if (!ownProfileId.equals(profileId)) {
            throw new AccessDeniedException("You can only access your own saved jobs");
        }
    }
}
