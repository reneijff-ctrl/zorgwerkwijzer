package nl.zorgwerkwijzer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "Request for end-of-year bonus calculation")
public class EndOfYearCalculationRequestDto {

    @NotNull(message = "Monthly gross salary is required")
    @DecimalMin(value = "0.0", message = "Monthly gross salary must be greater than 0")
    @Schema(description = "Monthly gross salary", example = "3000.00")
    private Double monthlyGrossSalary;

    @NotNull(message = "Weekly hours is required")
    @DecimalMin(value = "0.0", message = "Weekly hours must be greater than 0")
    @Schema(description = "Weekly contract hours", example = "36.0")
    private Double weeklyHours;

    @NotNull(message = "Fulltime hours is required")
    @DecimalMin(value = "0.1", message = "Fulltime hours must be greater than 0")
    @Schema(description = "Standard fulltime hours per week", example = "36.0")
    private Double fulltimeHours;

    @Min(value = 1, message = "Months worked must be at least 1")
    @Max(value = 12, message = "Months worked cannot exceed 12")
    @Schema(description = "Number of months worked this calendar year", example = "12")
    private Integer monthsWorked = 12;

    @Schema(description = "Estimated monthly ORT (Onregelmatigheidstoeslag)", example = "150.00")
    private Double averageMonthlyOrt = 0.0;

    @Schema(description = "Whether to include ORT in the calculation (standard in VVT)", example = "true")
    private Boolean includeOrt = true;
}
