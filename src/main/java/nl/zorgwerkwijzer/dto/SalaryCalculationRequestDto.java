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
@Schema(description = "Request for gross salary calculation")
public class SalaryCalculationRequestDto {

    @NotNull(message = "Hourly salary is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Hourly salary must be greater than 0")
    @Schema(description = "Base hourly salary", example = "25.50")
    private BigDecimal hourlySalary;

    @NotNull(message = "Weekly hours is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Weekly hours must be greater than 0")
    @Schema(description = "Contractual weekly hours", example = "36.0")
    private BigDecimal weeklyHours;
}
