package nl.zorgwerkwijzer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.VacancyCreateUpdateDto;
import nl.zorgwerkwijzer.dto.VacancyDetailDto;
import nl.zorgwerkwijzer.dto.VacancyListDto;
import nl.zorgwerkwijzer.model.EducationLevel;
import nl.zorgwerkwijzer.model.EmploymentType;
import nl.zorgwerkwijzer.service.VacancyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/v1/vacancies")
@RequiredArgsConstructor
@Tag(name = "Vacancies", description = "Management and search of healthcare vacancies (zorgvacatures)")
public class VacancyController {

    private final VacancyService vacancyService;

    @Operation(summary = "Get all active vacancies", description = "Returns a paginated list of all active vacancies, sorted by newest first.")
    @ApiResponse(responseCode = "200", description = "List retrieved successfully")
    @GetMapping
    public ResponseEntity<Page<VacancyListDto>> getAll(
            @Parameter(description = "Pagination and sorting")
            @PageableDefault(size = 20, sort = {"isFeatured", "publishedAt"}, direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(vacancyService.findAll(pageable));
    }

    @Operation(summary = "Search and filter vacancies",
               description = "Returns a filtered, paginated list. All parameters are optional and combinable.")
    @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    @GetMapping("/search")
    public ResponseEntity<Page<VacancyListDto>> search(
            @Parameter(description = "Free text search on job title", example = "verpleegkundige")
            @RequestParam(required = false) String q,
            @Parameter(description = "Filter by city ID", example = "5")
            @RequestParam(required = false) Long cityId,
            @Parameter(description = "Filter by occupation ID", example = "3")
            @RequestParam(required = false) Long occupationId,
            @Parameter(description = "Filter by employment type", example = "VAST")
            @RequestParam(required = false) EmploymentType employmentType,
            @Parameter(description = "Filter by education level", example = "HBO")
            @RequestParam(required = false) EducationLevel educationLevel,
            @Parameter(description = "Pagination and sorting") @PageableDefault(size = 20, sort = {"isFeatured", "publishedAt"}, direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(
                vacancyService.search(q, cityId, occupationId, employmentType, educationLevel, pageable));
    }

    @Operation(summary = "Get vacancy by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vacancy found"),
            @ApiResponse(responseCode = "404", description = "Vacancy not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<VacancyDetailDto> getById(
            @Parameter(description = "ID of the vacancy", example = "1") @PathVariable Long id) {
        return ResponseEntity.ok(vacancyService.findById(id));
    }

    @Operation(summary = "Get vacancy by slug", description = "Primary endpoint for the frontend vacancy detail page.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vacancy found"),
            @ApiResponse(responseCode = "404", description = "Vacancy not found")
    })
    @GetMapping("/slug/{slug}")
    public ResponseEntity<VacancyDetailDto> getBySlug(
            @Parameter(description = "SEO slug of the vacancy", example = "verpleegkundige-ouderenzorg-amsterdam-buurtzorg")
            @PathVariable String slug) {
        return ResponseEntity.ok(vacancyService.findBySlug(slug));
    }

    @Operation(summary = "Get vacancies by employer")
    @ApiResponse(responseCode = "200", description = "List retrieved successfully")
    @GetMapping("/employer/{employerId}")
    public ResponseEntity<Page<VacancyListDto>> getByEmployer(
            @Parameter(description = "ID of the employer", example = "1") @PathVariable Long employerId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(vacancyService.findByEmployer(employerId, pageable));
    }

    @Operation(summary = "Get vacancies by city")
    @ApiResponse(responseCode = "200", description = "List retrieved successfully")
    @GetMapping("/city/{cityId}")
    public ResponseEntity<Page<VacancyListDto>> getByCity(
            @Parameter(description = "ID of the city", example = "5") @PathVariable Long cityId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(vacancyService.findByCity(cityId, pageable));
    }

    @Operation(summary = "Get vacancies by occupation")
    @ApiResponse(responseCode = "200", description = "List retrieved successfully")
    @GetMapping("/occupation/{occupationId}")
    public ResponseEntity<Page<VacancyListDto>> getByOccupation(
            @Parameter(description = "ID of the occupation", example = "3") @PathVariable Long occupationId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(vacancyService.findByOccupation(occupationId, pageable));
    }

    @Operation(summary = "Create a new vacancy")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Vacancy created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "404", description = "Employer not found"),
            @ApiResponse(responseCode = "409", description = "Slug already in use")
    })
    @PostMapping
    public ResponseEntity<VacancyDetailDto> create(@Valid @RequestBody VacancyCreateUpdateDto dto) {
        return new ResponseEntity<>(vacancyService.create(dto), HttpStatus.CREATED);
    }

    @Operation(summary = "Update an existing vacancy")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vacancy updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "404", description = "Vacancy or employer not found"),
            @ApiResponse(responseCode = "409", description = "Slug already in use")
    })
    @PutMapping("/{id}")
    public ResponseEntity<VacancyDetailDto> update(
            @Parameter(description = "ID of the vacancy to update", example = "1") @PathVariable Long id,
            @Valid @RequestBody VacancyCreateUpdateDto dto) {
        return ResponseEntity.ok(vacancyService.update(id, dto));
    }

    @Operation(summary = "Delete a vacancy")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Vacancy deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Vacancy not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID of the vacancy to delete", example = "1") @PathVariable Long id) {
        vacancyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
