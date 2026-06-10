package nl.zorgwerkwijzer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response containing ORT calculation results")
public class OrtCalculationResponseDto {
    @Schema(description = "Allowance for evening hours", example = "10.50")
    private BigDecimal eveningAllowance;

    @Schema(description = "Allowance for night hours", example = "45.20")
    private BigDecimal nightAllowance;

    @Schema(description = "Allowance for Saturday hours", example = "0.00")
    private BigDecimal saturdayAllowance;

    @Schema(description = "Allowance for Sunday hours", example = "0.00")
    private BigDecimal sundayAllowance;

    @Schema(description = "Allowance for holiday hours", example = "0.00")
    private BigDecimal holidayAllowance;

    @Schema(description = "Total ORT allowance calculated", example = "55.70")
    private BigDecimal totalOrt;
}
