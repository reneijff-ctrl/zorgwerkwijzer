package nl.zorgwerkwijzer.service.impl;

import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.EndOfYearCalculationRequestDto;
import nl.zorgwerkwijzer.dto.EndOfYearCalculationResponseDto;
import nl.zorgwerkwijzer.dto.SalaryCalculationRequestDto;
import nl.zorgwerkwijzer.dto.SalaryCalculationResponseDto;
import nl.zorgwerkwijzer.service.SalaryService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class SalaryServiceImpl implements SalaryService {

    private static final BigDecimal WEEKS_PER_YEAR = new BigDecimal("52");
    private static final BigDecimal MONTHS_PER_YEAR = new BigDecimal("12");
    private static final BigDecimal HOLIDAY_ALLOWANCE_PERCENTAGE = new BigDecimal("0.08");
    private static final BigDecimal END_OF_YEAR_BONUS_PERCENTAGE = new BigDecimal("0.0833");

    @Override
    public SalaryCalculationResponseDto calculateSalary(SalaryCalculationRequestDto request) {
        BigDecimal hourlySalary = request.getHourlySalary();
        BigDecimal weeklyHours = request.getWeeklyHours();

        BigDecimal yearlyGrossSalary = hourlySalary
                .multiply(weeklyHours)
                .multiply(WEEKS_PER_YEAR)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal monthlyGrossSalary = yearlyGrossSalary
                .divide(MONTHS_PER_YEAR, 2, RoundingMode.HALF_UP);

        BigDecimal holidayAllowance = yearlyGrossSalary
                .multiply(HOLIDAY_ALLOWANCE_PERCENTAGE)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal endOfYearBonus = yearlyGrossSalary
                .multiply(END_OF_YEAR_BONUS_PERCENTAGE)
                .setScale(2, RoundingMode.HALF_UP);

        return SalaryCalculationResponseDto.builder()
                .monthlyGrossSalary(monthlyGrossSalary)
                .yearlyGrossSalary(yearlyGrossSalary)
                .holidayAllowance(holidayAllowance)
                .endOfYearBonus(endOfYearBonus)
                .build();
    }

    @Override
    public EndOfYearCalculationResponseDto calculateEndOfYearBonus(EndOfYearCalculationRequestDto request) {
        BigDecimal monthlySalary = BigDecimal.valueOf(request.getMonthlyGrossSalary());
        BigDecimal weeklyHours = BigDecimal.valueOf(request.getWeeklyHours());
        BigDecimal fulltimeHours = BigDecimal.valueOf(request.getFulltimeHours());
        BigDecimal monthsWorked = BigDecimal.valueOf(request.getMonthsWorked());
        BigDecimal averageMonthlyOrt = BigDecimal.valueOf(request.getAverageMonthlyOrt());
        
        // In CAO VVT the end-of-year bonus is calculated over the actual earned salary (including ORT)
        // Part-time factor is usually already reflected in the monthly salary if provided as "actual" salary,
        // but here we might need to adjust if monthlySalary is "fulltime basis". 
        // Standard approach for this tool: assume monthlySalary is the actual gross salary for the contract hours.
        
        BigDecimal monthlyBasis = monthlySalary;
        if (Boolean.TRUE.equals(request.getIncludeOrt())) {
            monthlyBasis = monthlyBasis.add(averageMonthlyOrt);
        }
        
        BigDecimal yearlyBasis = monthlyBasis.multiply(monthsWorked);
        
        BigDecimal totalBonus = yearlyBasis
                .multiply(END_OF_YEAR_BONUS_PERCENTAGE)
                .setScale(2, RoundingMode.HALF_UP);
        
        BigDecimal monthlyAccrual = totalBonus
                .divide(monthsWorked, 2, RoundingMode.HALF_UP);

        BigDecimal ortContribution = BigDecimal.ZERO;
        if (Boolean.TRUE.equals(request.getIncludeOrt()) && averageMonthlyOrt.compareTo(BigDecimal.ZERO) > 0) {
            ortContribution = averageMonthlyOrt
                    .multiply(monthsWorked)
                    .multiply(END_OF_YEAR_BONUS_PERCENTAGE)
                    .setScale(2, RoundingMode.HALF_UP);
        }

        return EndOfYearCalculationResponseDto.builder()
                .totalBonus(totalBonus.doubleValue())
                .monthlyAccrual(monthlyAccrual.doubleValue())
                .percentage(8.33)
                .calculationBasis(yearlyBasis.doubleValue())
                .ortContribution(ortContribution.doubleValue())
                .build();
    }
}
