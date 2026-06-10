package nl.zorgwerkwijzer.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import nl.zorgwerkwijzer.dto.OrtCalculationRequestDto;
import nl.zorgwerkwijzer.dto.OrtCalculationResponseDto;
import nl.zorgwerkwijzer.service.OrtService;
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

@WebMvcTest(OrtController.class)
class OrtControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private OrtService ortService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void calculateOrt_ShouldReturnOk() throws Exception {
        // Given
        OrtCalculationRequestDto request = OrtCalculationRequestDto.builder()
                .eveningHours(new BigDecimal("10.00"))
                .nightHours(new BigDecimal("10.00"))
                .saturdayHours(new BigDecimal("10.00"))
                .sundayHours(new BigDecimal("10.00"))
                .holidayHours(new BigDecimal("10.00"))
                .hourlyWage(new BigDecimal("20.00"))
                .build();

        OrtCalculationResponseDto response = OrtCalculationResponseDto.builder()
                .eveningAllowance(new BigDecimal("44.00"))
                .nightAllowance(new BigDecimal("88.00"))
                .saturdayAllowance(new BigDecimal("76.00"))
                .sundayAllowance(new BigDecimal("120.00"))
                .holidayAllowance(new BigDecimal("120.00"))
                .totalOrt(new BigDecimal("448.00"))
                .build();

        when(ortService.calculateOrt(any(OrtCalculationRequestDto.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/v1/ort/calculate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.eveningAllowance").value(44.00))
                .andExpect(jsonPath("$.nightAllowance").value(88.00))
                .andExpect(jsonPath("$.saturdayAllowance").value(76.00))
                .andExpect(jsonPath("$.sundayAllowance").value(120.00))
                .andExpect(jsonPath("$.holidayAllowance").value(120.00))
                .andExpect(jsonPath("$.totalOrt").value(448.00));
    }

    @Test
    void calculateOrt_WithInvalidRequest_ShouldReturnBadRequest() throws Exception {
        // Given
        OrtCalculationRequestDto request = OrtCalculationRequestDto.builder()
                .eveningHours(new BigDecimal("-1.00")) // Invalid
                .nightHours(new BigDecimal("10.00"))
                .saturdayHours(new BigDecimal("10.00"))
                .sundayHours(new BigDecimal("10.00"))
                .holidayHours(new BigDecimal("10.00"))
                .hourlyWage(new BigDecimal("20.00"))
                .build();

        // When & Then
        mockMvc.perform(post("/api/v1/ort/calculate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
