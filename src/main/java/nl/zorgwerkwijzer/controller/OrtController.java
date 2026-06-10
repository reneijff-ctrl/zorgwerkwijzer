package nl.zorgwerkwijzer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.OrtCalculationRequestDto;
import nl.zorgwerkwijzer.dto.OrtCalculationResponseDto;
import nl.zorgwerkwijzer.service.OrtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ort")
@RequiredArgsConstructor
@Tag(name = "ORT Calculator", description = "Calculations for onregelmatigheidstoeslag (ORT)")
public class OrtController {

    private final OrtService ortService;

    @Operation(summary = "Calculate ORT", description = "Calculates the total onregelmatigheidstoeslag based on hours worked and hourly wage.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Calculation successful"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping("/calculate")
    public ResponseEntity<OrtCalculationResponseDto> calculateOrt(
            @Valid @RequestBody OrtCalculationRequestDto request) {
        return ResponseEntity.ok(ortService.calculateOrt(request));
    }
}
