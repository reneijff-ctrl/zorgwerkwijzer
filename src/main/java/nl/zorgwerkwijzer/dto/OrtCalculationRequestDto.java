package nl.zorgwerkwijzer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request for ORT (Onregelmatigheidstoeslag) calculation")
public class OrtCalculationRequestDto {

    @NotNull(message = "Evening hours is required")
    @DecimalMin(value = "0.0", message = "Evening hours cannot be negative")
    @Schema(description = "Number of evening hours worked", example = "4.0")
    private BigDecimal eveningHours;

    @NotNull(message = "Night hours is required")
    @DecimalMin(value = "0.0", message = "Night hours cannot be negative")
    @Schema(description = "Number of night hours worked", example = "8.0")
    private BigDecimal nightHours;

    @NotNull(message = "Saturday hours is required")
    @DecimalMin(value = "0.0", message = "Saturday hours cannot be negative")
    @Schema(description = "Number of Saturday hours worked", example = "0.0")
    private BigDecimal saturdayHours;

    @NotNull(message = "Sunday hours is required")
    @DecimalMin(value = "0.0", message = "Sunday hours cannot be negative")
    @Schema(description = "Number of Sunday hours worked", example = "0.0")
    private BigDecimal sundayHours;

    @NotNull(message = "Holiday hours is required")
    @DecimalMin(value = "0.0", message = "Holiday hours cannot be negative")
    @Schema(description = "Number of holiday hours worked", example = "0.0")
    private BigDecimal holidayHours;

    @NotNull(message = "Hourly wage is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Hourly wage must be greater than 0")
    @Schema(description = "Base hourly wage", example = "25.50")
    private BigDecimal hourlyWage;
}
