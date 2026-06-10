package nl.zorgwerkwijzer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import nl.zorgwerkwijzer.dto.HealthResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/health")
@Tag(name = "Health", description = "Endpoints for checking application health")
public class HealthController {

    @Operation(summary = "Get application health status", description = "Returns the current status of the application, including name and version.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved health status")
    })
    @GetMapping
    public ResponseEntity<HealthResponseDto> getHealth() {
        HealthResponseDto response = HealthResponseDto.builder()
                .status("UP")
                .application("ZorgWerkWijzer")
                .version("1.0.0")
                .build();
        return ResponseEntity.ok(response);
    }
}
