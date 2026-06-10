package nl.zorgwerkwijzer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(description = "Response for end-of-year bonus calculation")
public class EndOfYearCalculationResponseDto {

    @Schema(description = "Total expected end-of-year bonus (8.33%)", example = "3150.00")
    private Double totalBonus;

    @Schema(description = "Estimated monthly accrual", example = "262.50")
    private Double monthlyAccrual;

    @Schema(description = "The percentage used for the calculation", example = "8.33")
    private Double percentage;

    @Schema(description = "Total basis for calculation (Salary + ORT if applicable)", example = "37800.00")
    private Double calculationBasis;

    @Schema(description = "The part of the bonus attributed to ORT", example = "150.00")
    private Double ortContribution;
}
