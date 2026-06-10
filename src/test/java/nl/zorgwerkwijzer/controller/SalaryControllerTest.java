package nl.zorgwerkwijzer.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import nl.zorgwerkwijzer.dto.SalaryCalculationRequestDto;
import nl.zorgwerkwijzer.dto.SalaryCalculationResponseDto;
import nl.zorgwerkwijzer.service.SalaryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SalaryController.class)
class SalaryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SalaryService salaryService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void calculateSalary_ShouldReturnOk() throws Exception {
        // Given
        SalaryCalculationRequestDto request = SalaryCalculationRequestDto.builder()
                .hourlySalary(new BigDecimal("20.00"))
                .weeklyHours(new BigDecimal("36.00"))
                .build();

        SalaryCalculationResponseDto response = SalaryCalculationResponseDto.builder()
                .monthlyGrossSalary(new BigDecimal("3120.00"))
                .yearlyGrossSalary(new BigDecimal("37440.00"))
                .holidayAllowance(new BigDecimal("2995.20"))
                .endOfYearBonus(new BigDecimal("3118.75"))
                .build();

        when(salaryService.calculateSalary(any(SalaryCalculationRequestDto.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/v1/salary/calculate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.monthlyGrossSalary").value(3120.00))
                .andExpect(jsonPath("$.yearlyGrossSalary").value(37440.00))
                .andExpect(jsonPath("$.holidayAllowance").value(2995.20))
                .andExpect(jsonPath("$.endOfYearBonus").value(3118.75));
    }

    @Test
    void calculateSalary_WithInvalidRequest_ShouldReturnBadRequest() throws Exception {
        // Given
        SalaryCalculationRequestDto request = SalaryCalculationRequestDto.builder()
                .hourlySalary(new BigDecimal("-10.00")) // Invalid
                .weeklyHours(new BigDecimal("36.00"))
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/salary/calculate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
