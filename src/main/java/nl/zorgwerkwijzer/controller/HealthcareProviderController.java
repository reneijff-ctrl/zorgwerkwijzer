package nl.zorgwerkwijzer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.HealthcareProviderDto;
import nl.zorgwerkwijzer.service.HealthcareProviderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/providers")
@RequiredArgsConstructor
@Tag(name = "Healthcare Providers", description = "Management of healthcare providers")
public class HealthcareProviderController {

    private final HealthcareProviderService service;

    @Operation(summary = "Get all healthcare providers", description = "Retrieves a paginated list of all healthcare providers.")
    @GetMapping
    public ResponseEntity<Page<HealthcareProviderDto>> getAll(
            @Parameter(description = "Pagination and sorting information") @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(service.findAll(pageable));
    }

    @Operation(summary = "Get a healthcare provider by ID", description = "Retrieves details of a single healthcare provider.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Provider found"),
            @ApiResponse(responseCode = "404", description = "Provider not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<HealthcareProviderDto> getById(
            @Parameter(description = "ID of the provider to retrieve", example = "1") @PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @Operation(summary = "Create a new healthcare provider", description = "Adds a new healthcare provider to the system.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Provider created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping
    public ResponseEntity<HealthcareProviderDto> create(@Valid @RequestBody HealthcareProviderDto dto) {
        return new ResponseEntity<>(service.create(dto), HttpStatus.CREATED);
    }

    @Operation(summary = "Update an existing healthcare provider", description = "Updates the details of an existing healthcare provider.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Provider updated successfully"),
            @ApiResponse(responseCode = "404", description = "Provider not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PutMapping("/{id}")
    public ResponseEntity<HealthcareProviderDto> update(
            @Parameter(description = "ID of the provider to update", example = "1") @PathVariable Long id,
            @Valid @RequestBody HealthcareProviderDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @Operation(summary = "Delete a healthcare provider", description = "Removes a healthcare provider from the system.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Provider deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Provider not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID of the provider to delete", example = "1") @PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
