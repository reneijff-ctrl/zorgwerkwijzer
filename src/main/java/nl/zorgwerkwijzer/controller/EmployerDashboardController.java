package nl.zorgwerkwijzer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.UserDto;
import nl.zorgwerkwijzer.dto.dashboard.DashboardApplicationDto;
import nl.zorgwerkwijzer.dto.dashboard.DashboardVacancyCreateRequest;
import nl.zorgwerkwijzer.dto.dashboard.DashboardVacancyDto;
import nl.zorgwerkwijzer.dto.dashboard.LinkEmployerRequest;
import nl.zorgwerkwijzer.dto.dashboard.VacancyDeleteResultDto;
import nl.zorgwerkwijzer.dto.dashboard.UpdateApplicationStatusRequest;
import nl.zorgwerkwijzer.service.EmployerDashboardService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/employer-dashboard")
@RequiredArgsConstructor
@Tag(name = "Employer Dashboard", description = "Vacature- en sollicitatiebeheer voor werkgevers")
@SecurityRequirement(name = "bearerAuth")
public class EmployerDashboardController {

    private final EmployerDashboardService employerDashboardService;

    // ── Werkgever koppelen (admin only) ────────────────────────────────────────

    @PutMapping("/users/{userId}/link-employer")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Koppel werkgever aan gebruiker",
        description = "Admin-only: koppelt een werkgever-ID aan een bestaande gebruiker en wijst ROLE_EMPLOYER toe."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Gebruiker bijgewerkt"),
        @ApiResponse(responseCode = "404", description = "Gebruiker of werkgever niet gevonden"),
        @ApiResponse(responseCode = "403", description = "Geen beheerdersrechten")
    })
    public ResponseEntity<UserDto> linkEmployer(
            @PathVariable Long userId,
            @Valid @RequestBody LinkEmployerRequest request) {
        return ResponseEntity.ok(employerDashboardService.linkEmployer(userId, request));
    }

    // ── Vacatures ──────────────────────────────────────────────────────────────

    @GetMapping("/vacancies")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Haal eigen vacatures op")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lijst met vacatures"),
        @ApiResponse(responseCode = "403", description = "Geen werkgeversrechten")
    })
    public ResponseEntity<Page<DashboardVacancyDto>> getMyVacancies(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(employerDashboardService.getMyVacancies(principal.getUsername(), pageable));
    }

    @PostMapping("/vacancies")
    @PreAuthorize("hasRole('EMPLOYER')")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Maak nieuwe vacature aan")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Vacature aangemaakt"),
        @ApiResponse(responseCode = "400", description = "Validatiefout"),
        @ApiResponse(responseCode = "403", description = "Geen werkgeversrechten"),
        @ApiResponse(responseCode = "409", description = "Slug al in gebruik")
    })
    public ResponseEntity<DashboardVacancyDto> createVacancy(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody DashboardVacancyCreateRequest request) {
        DashboardVacancyDto created = employerDashboardService.createVacancy(principal.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/vacancies/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Werk bestaande vacature bij")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Vacature bijgewerkt"),
        @ApiResponse(responseCode = "400", description = "Validatiefout"),
        @ApiResponse(responseCode = "403", description = "Geen toegang tot deze vacature"),
        @ApiResponse(responseCode = "404", description = "Vacature niet gevonden")
    })
    public ResponseEntity<DashboardVacancyDto> updateVacancy(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id,
            @Valid @RequestBody DashboardVacancyCreateRequest request) {
        return ResponseEntity.ok(employerDashboardService.updateVacancy(principal.getUsername(), id, request));
    }

    @PatchMapping("/vacancies/{id}/featured")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(
        summary = "Zet featured-status aan of uit",
        description = "Vereist een actief Premium-abonnement. Retourneert HTTP 402 als featured niet is inbegrepen."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Featured-status gewijzigd"),
        @ApiResponse(responseCode = "402", description = "Featured niet inbegrepen in pakket — upgrade vereist"),
        @ApiResponse(responseCode = "403", description = "Geen toegang tot deze vacature"),
        @ApiResponse(responseCode = "404", description = "Vacature niet gevonden")
    })
    public ResponseEntity<DashboardVacancyDto> toggleFeatured(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(employerDashboardService.toggleFeatured(principal.getUsername(), id));
    }

    @DeleteMapping("/vacancies/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Verwijder vacature",
               description = "Verwijdert de vacature hard als er geen sollicitaties zijn. "
                           + "Deactiveert de vacature (isActive=false) als er wel sollicitaties zijn.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Vacature verwijderd of gedeactiveerd"),
        @ApiResponse(responseCode = "403", description = "Geen toegang tot deze vacature"),
        @ApiResponse(responseCode = "404", description = "Vacature niet gevonden")
    })
    public ResponseEntity<VacancyDeleteResultDto> deleteVacancy(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id) {
        VacancyDeleteResultDto result = employerDashboardService.deleteVacancy(principal.getUsername(), id);
        return ResponseEntity.ok(result);
    }

    // ── Sollicitaties ──────────────────────────────────────────────────────────

    @GetMapping("/applications")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Haal sollicitaties op voor alle eigen vacatures")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lijst met sollicitaties"),
        @ApiResponse(responseCode = "403", description = "Geen werkgeversrechten")
    })
    public ResponseEntity<Page<DashboardApplicationDto>> getMyApplications(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(employerDashboardService.getMyApplications(principal.getUsername(), pageable));
    }

    @GetMapping("/applications/{id}")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Haal sollicitatiedetails op")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Sollicitatie gevonden"),
        @ApiResponse(responseCode = "403", description = "Geen toegang tot deze sollicitatie"),
        @ApiResponse(responseCode = "404", description = "Sollicitatie niet gevonden")
    })
    public ResponseEntity<DashboardApplicationDto> getApplicationById(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(employerDashboardService.getApplicationById(principal.getUsername(), id));
    }

    @PatchMapping("/applications/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Werk sollicitatiestatus bij")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Status bijgewerkt"),
        @ApiResponse(responseCode = "400", description = "Ongeldige status"),
        @ApiResponse(responseCode = "403", description = "Geen toegang tot deze sollicitatie"),
        @ApiResponse(responseCode = "404", description = "Sollicitatie niet gevonden")
    })
    public ResponseEntity<DashboardApplicationDto> updateApplicationStatus(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id,
            @Valid @RequestBody UpdateApplicationStatusRequest request) {
        return ResponseEntity.ok(
                employerDashboardService.updateApplicationStatus(principal.getUsername(), id, request.getStatus()));
    }
}
