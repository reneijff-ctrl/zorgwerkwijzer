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
@Schema(description = "Response containing gross salary calculation results")
public class SalaryCalculationResponseDto {
    @Schema(description = "Calculated monthly gross salary", example = "3978.00")
    private BigDecimal monthlyGrossSalary;

    @Schema(description = "Calculated yearly gross salary (excluding allowances)", example = "47736.00")
    private BigDecimal yearlyGrossSalary;

    @Schema(description = "Calculated annual holiday allowance (typically 8%)", example = "3818.88")
    private BigDecimal holidayAllowance;

    @Schema(description = "Calculated annual end-of-year bonus (typically 8.33%)", example = "3976.41")
    private BigDecimal endOfYearBonus;
}
