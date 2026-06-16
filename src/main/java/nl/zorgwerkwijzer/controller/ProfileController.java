package nl.zorgwerkwijzer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.ProfileDto;
import nl.zorgwerkwijzer.exception.ResourceNotFoundException;
import nl.zorgwerkwijzer.model.Profile;
import nl.zorgwerkwijzer.repository.ProfileRepository;
import nl.zorgwerkwijzer.service.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/profiles")
@RequiredArgsConstructor
@Tag(name = "Profiles", description = "Operations for managing candidate profiles")
public class ProfileController {

    private final ProfileService     profileService;
    private final ProfileRepository  profileRepository;

    @GetMapping("/{id}")
    @Operation(summary = "Get profile by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profile found"),
            @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    public ResponseEntity<ProfileDto> getById(
            @Parameter(description = "Profile ID") @PathVariable Long id) {
        return ResponseEntity.ok(profileService.findById(id));
    }

    @GetMapping("/by-email")
    @Operation(summary = "Get profile by email address (authenticated users only)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profile found"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    public ResponseEntity<ProfileDto> getByEmail(
            @Parameter(description = "Email address") @RequestParam String email,
            @AuthenticationPrincipal UserDetails principal) {
        if (principal == null) {
            throw new AccessDeniedException("Authentication required");
        }
        // Kandidaat mag alleen eigen profiel opvragen; werkgever en admin mogen alles
        if (!isAdminOrEmployer(principal) && !principal.getUsername().equalsIgnoreCase(email)) {
            throw new AccessDeniedException("You can only view your own profile");
        }
        return ResponseEntity.ok(profileService.findByEmail(email));
    }

    @PostMapping
    @Operation(summary = "Create a new candidate profile")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Profile created"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "409", description = "Email already in use")
    })
    public ResponseEntity<ProfileDto> create(@Valid @RequestBody ProfileDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(profileService.create(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing profile (own profile or admin)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profile updated"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Profile not found"),
            @ApiResponse(responseCode = "409", description = "Email already in use")
    })
    public ResponseEntity<ProfileDto> update(
            @Parameter(description = "Profile ID") @PathVariable Long id,
            @Valid @RequestBody ProfileDto dto,
            @AuthenticationPrincipal UserDetails principal) {
        checkOwnershipStrict(id, principal);
        return ResponseEntity.ok(profileService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a profile (own profile or admin)")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Profile deleted"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "Profile ID") @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        checkOwnershipStrict(id, principal);
        profileService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Schrijf-operaties (PUT / DELETE): alleen de eigenaar zelf of een ROLE_ADMIN
     * mag het profiel wijzigen/verwijderen.
     * ROLE_EMPLOYER heeft hier bewust GEEN bypass — werkgevers mogen nooit
     * andermans kandidaatprofiel wijzigen of verwijderen.
     */
    private void checkOwnershipStrict(Long profileId, UserDetails principal) {
        if (principal == null) {
            throw new AccessDeniedException("Authentication required");
        }
        if (isAdmin(principal)) {
            return; // alleen admin mag altijd
        }
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + profileId));
        if (!profile.getEmail().equalsIgnoreCase(principal.getUsername())) {
            throw new AccessDeniedException("You can only modify your own profile");
        }
    }

    private boolean isAdmin(UserDetails principal) {
        return principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    private boolean isAdminOrEmployer(UserDetails principal) {
        return principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                            || a.getAuthority().equals("ROLE_EMPLOYER"));
    }
}
