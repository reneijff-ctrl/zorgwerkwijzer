package nl.zorgwerkwijzer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.EndOfYearCalculationRequestDto;
import nl.zorgwerkwijzer.dto.EndOfYearCalculationResponseDto;
import nl.zorgwerkwijzer.dto.SalaryCalculationRequestDto;
import nl.zorgwerkwijzer.dto.SalaryCalculationResponseDto;
import nl.zorgwerkwijzer.service.SalaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/salary")
@RequiredArgsConstructor
@Tag(name = "Salary Calculator", description = "Calculations for gross salary and bonuses")
public class SalaryController {

    private final SalaryService salaryService;

    @Operation(summary = "Calculate gross salary", description = "Calculates monthly/yearly gross salary and holiday/bonus allowances.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Calculation successful"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping("/calculate")
    public ResponseEntity<SalaryCalculationResponseDto> calculateSalary(
            @Valid @RequestBody SalaryCalculationRequestDto request) {
        return ResponseEntity.ok(salaryService.calculateSalary(request));
    }

    @Operation(summary = "Calculate end-of-year bonus", description = "Calculates the expected end-of-year bonus (13th month) based on CAO VVT rules.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Calculation successful"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping("/calculate-end-of-year")
    public ResponseEntity<EndOfYearCalculationResponseDto> calculateEndOfYearBonus(
            @Valid @RequestBody EndOfYearCalculationRequestDto request) {
        return ResponseEntity.ok(salaryService.calculateEndOfYearBonus(request));
    }
}
