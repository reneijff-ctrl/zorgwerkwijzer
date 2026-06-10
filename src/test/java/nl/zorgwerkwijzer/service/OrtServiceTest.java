package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.OrtCalculationRequestDto;
import nl.zorgwerkwijzer.dto.OrtCalculationResponseDto;
import nl.zorgwerkwijzer.service.impl.OrtServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class OrtServiceTest {

    private OrtService ortService;

    @BeforeEach
    void setUp() {
        ortService = new OrtServiceImpl();
    }

    @Test
    void calculateOrt_ShouldReturnCorrectValues() {
        // Given
        OrtCalculationRequestDto request = OrtCalculationRequestDto.builder()
                .eveningHours(new BigDecimal("10.00"))
                .nightHours(new BigDecimal("10.00"))
                .saturdayHours(new BigDecimal("10.00"))
                .sundayHours(new BigDecimal("10.00"))
                .holidayHours(new BigDecimal("10.00"))
                .hourlyWage(new BigDecimal("20.00"))
                .build();

        // When
        OrtCalculationResponseDto result = ortService.calculateOrt(request);

        // Then
        assertThat(result.getEveningAllowance()).isEqualByComparingTo(new BigDecimal("44.00"));
        assertThat(result.getNightAllowance()).isEqualByComparingTo(new BigDecimal("88.00"));
        assertThat(result.getSaturdayAllowance()).isEqualByComparingTo(new BigDecimal("76.00"));
        assertThat(result.getSundayAllowance()).isEqualByComparingTo(new BigDecimal("120.00"));
        assertThat(result.getHolidayAllowance()).isEqualByComparingTo(new BigDecimal("120.00"));
        assertThat(result.getTotalOrt()).isEqualByComparingTo(new BigDecimal("448.00"));
    }
    
    @Test
    void calculateOrt_WithZeroHours_ShouldReturnZeroAllowances() {
        // Given
        OrtCalculationRequestDto request = OrtCalculationRequestDto.builder()
                .eveningHours(BigDecimal.ZERO)
                .nightHours(BigDecimal.ZERO)
                .saturdayHours(BigDecimal.ZERO)
                .sundayHours(BigDecimal.ZERO)
                .holidayHours(BigDecimal.ZERO)
                .hourlyWage(new BigDecimal("20.00"))
                .build();

        // When
        OrtCalculationResponseDto result = ortService.calculateOrt(request);

        // Then
        assertThat(result.getTotalOrt()).isEqualByComparingTo(BigDecimal.ZERO);
    }
}
