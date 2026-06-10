package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.SalaryCalculationRequestDto;
import nl.zorgwerkwijzer.dto.SalaryCalculationResponseDto;
import nl.zorgwerkwijzer.service.impl.SalaryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.math.RoundingMode;

import static org.assertj.core.api.Assertions.assertThat;

class SalaryServiceTest {

    private SalaryService salaryService;

    @BeforeEach
    void setUp() {
        salaryService = new SalaryServiceImpl();
    }

    @Test
    void calculateSalary_ShouldReturnCorrectValues() {
        // Given
        BigDecimal hourlySalary = new BigDecimal("20.00");
        BigDecimal weeklyHours = new BigDecimal("36.00");
        SalaryCalculationRequestDto request = SalaryCalculationRequestDto.builder()
                .hourlySalary(hourlySalary)
                .weeklyHours(weeklyHours)
                .build();

        // Calculations for expectation:
        // Yearly: 20 * 36 * 52 = 37440.00
        // Monthly: 37440 / 12 = 3120.00
        // Holiday Allowance: 37440 * 0.08 = 2995.20
        // End of Year Bonus: 37440 * 0.0833 = 3118.75

        // When
        SalaryCalculationResponseDto result = salaryService.calculateSalary(request);

        // Then
        assertThat(result.getYearlyGrossSalary()).isEqualByComparingTo(new BigDecimal("37440.00"));
        assertThat(result.getMonthlyGrossSalary()).isEqualByComparingTo(new BigDecimal("3120.00"));
        assertThat(result.getHolidayAllowance()).isEqualByComparingTo(new BigDecimal("2995.20"));
        assertThat(result.getEndOfYearBonus()).isEqualByComparingTo(new BigDecimal("3118.75"));
    }
}
