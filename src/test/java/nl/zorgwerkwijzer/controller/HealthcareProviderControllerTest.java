package nl.zorgwerkwijzer.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import nl.zorgwerkwijzer.dto.HealthcareProviderDto;
import nl.zorgwerkwijzer.service.HealthcareProviderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(HealthcareProviderController.class)
class HealthcareProviderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private HealthcareProviderService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getAll_ShouldReturnPage() throws Exception {
        HealthcareProviderDto dto = new HealthcareProviderDto();
        dto.setId(1L);
        dto.setName("Test Provider");
        dto.setEmail("test@example.com");

        Page<HealthcareProviderDto> page = new PageImpl<>(List.of(dto), PageRequest.of(0, 20), 1);

        when(service.findAll(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/v1/providers")
                        .param("page", "0")
                        .param("size", "20")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Test Provider"))
                .andExpect(jsonPath("$.page.totalElements").value(1));
    }

    @Test
    void getById_ShouldReturnProvider() throws Exception {
        HealthcareProviderDto dto = new HealthcareProviderDto();
        dto.setId(1L);
        dto.setName("Test Provider");

        when(service.findById(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/v1/providers/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Provider"));
    }

    @Test
    void create_ShouldReturnCreated() throws Exception {
        HealthcareProviderDto dto = new HealthcareProviderDto();
        dto.setName("New Provider");
        dto.setEmail("new@example.com");

        HealthcareProviderDto savedDto = new HealthcareProviderDto();
        savedDto.setId(1L);
        savedDto.setName("New Provider");
        savedDto.setEmail("new@example.com");

        when(service.create(any(HealthcareProviderDto.class))).thenReturn(savedDto);

        mockMvc.perform(post("/api/v1/providers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("New Provider"));
    }

    @Test
    void delete_ShouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/api/v1/providers/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void create_WithInvalidData_ShouldReturnApiError() throws Exception {
        HealthcareProviderDto dto = new HealthcareProviderDto();
        dto.setName(""); // Invalid: NotBlank
        dto.setEmail("invalid-email"); // Invalid: Email

        mockMvc.perform(post("/api/v1/providers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.validationErrors.name").exists())
                .andExpect(jsonPath("$.validationErrors.email").exists());
    }
}
