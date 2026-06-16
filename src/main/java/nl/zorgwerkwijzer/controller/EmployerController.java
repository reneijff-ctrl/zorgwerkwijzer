package nl.zorgwerkwijzer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.EmployerDto;
import nl.zorgwerkwijzer.dto.VacancyListDto;
import nl.zorgwerkwijzer.service.EmployerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/employers")
@RequiredArgsConstructor
@Tag(name = "Employers", description = "Management of healthcare employers (werkgevers)")
public class EmployerController {

    private final EmployerService employerService;

    @Operation(summary = "Get all employers", description = "Returns a paginated list of all employers.")
    @ApiResponse(responseCode = "200", description = "List retrieved successfully")
    @GetMapping
    public ResponseEntity<Page<EmployerDto>> getAll(
            @Parameter(description = "Pagination and sorting") @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(employerService.findAll(pageable));
    }

    @Operation(summary = "Get all premium employers", description = "Returns a paginated list of premium employers.")
    @ApiResponse(responseCode = "200", description = "List retrieved successfully")
    @GetMapping("/premium")
    public ResponseEntity<Page<EmployerDto>> getPremium(
            @Parameter(description = "Pagination and sorting") @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(employerService.findPremiumEmployers(pageable));
    }

    @Operation(summary = "Get employer by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Employer found"),
            @ApiResponse(responseCode = "404", description = "Employer not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<EmployerDto> getById(
            @Parameter(description = "ID of the employer", example = "1") @PathVariable Long id) {
        return ResponseEntity.ok(employerService.findById(id));
    }

    @Operation(summary = "Get employer by slug", description = "Used for SEO employer profile pages.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Employer found"),
            @ApiResponse(responseCode = "404", description = "Employer not found")
    })
    @GetMapping("/slug/{slug}")
    public ResponseEntity<EmployerDto> getBySlug(
            @Parameter(description = "URL slug of the employer", example = "buurtzorg-nederland") @PathVariable String slug) {
        return ResponseEntity.ok(employerService.findBySlug(slug));
    }

    @Operation(summary = "Get active vacancies for employer by slug")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vacancies retrieved"),
            @ApiResponse(responseCode = "404", description = "Employer not found")
    })
    @GetMapping("/slug/{slug}/vacancies")
    public ResponseEntity<Page<VacancyListDto>> getVacanciesBySlug(
            @Parameter(description = "URL slug of the employer", example = "buurtzorg-nederland") @PathVariable String slug,
            @Parameter(description = "Pagination and sorting") @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(employerService.findVacanciesBySlug(slug, pageable));
    }

    @Operation(summary = "Create a new employer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Employer created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "409", description = "Slug or email already in use")
    })
    @PostMapping
    public ResponseEntity<EmployerDto> create(@Valid @RequestBody EmployerDto dto) {
        return new ResponseEntity<>(employerService.create(dto), HttpStatus.CREATED);
    }

    @Operation(summary = "Update employer profile (own profile, EMPLOYER role)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Employer updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "403", description = "Not allowed to update this employer"),
            @ApiResponse(responseCode = "404", description = "Employer not found"),
            @ApiResponse(responseCode = "409", description = "Slug or email already in use")
    })
    @PreAuthorize("hasAnyRole('EMPLOYER','ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<EmployerDto> update(
            @Parameter(description = "ID of the employer to update", example = "1") @PathVariable Long id,
            @Valid @RequestBody EmployerDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(employerService.updateOwnProfile(id, userDetails.getUsername(), dto));
    }

    @Operation(summary = "Delete an employer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Employer deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Employer not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID of the employer to delete", example = "1") @PathVariable Long id) {
        employerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
