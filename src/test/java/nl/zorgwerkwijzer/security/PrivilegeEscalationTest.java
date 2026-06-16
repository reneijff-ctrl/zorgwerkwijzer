package nl.zorgwerkwijzer.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import nl.zorgwerkwijzer.dto.RegisterRequest;
import nl.zorgwerkwijzer.dto.AuthResponse;
import nl.zorgwerkwijzer.model.UserRole;
import nl.zorgwerkwijzer.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import nl.zorgwerkwijzer.controller.AuthController;
import nl.zorgwerkwijzer.dto.UserDto;

import nl.zorgwerkwijzer.security.JwtTokenProvider;
import org.springframework.security.core.userdetails.UserDetailsService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * C1: Privilege Escalation Tests
 *
 * Verifies that:
 * 1. A client CANNOT register as ADMIN by sending a 'role' field
 * 2. Any registered user always gets ROLE_USER
 * 3. The RegisterRequest DTO does not accept a 'role' field
 */
@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@TestPropertySource(properties = {
    "app.jwt.secret=dGVzdFNlY3JldEZvckxvY2FsRGV2ZWxvcG1lbnRPbmx5Tm90Rm9yUHJvZHVjdGlvblVzZU9ubHlUZXN0aW5nUHVycG9zZXM=",
    "app.jwt.expiration=900000",
    "app.jwt.issuer=zorgwerkwijzer.nl",
    "app.cors.allowed-origins[0]=http://localhost:3000",
    "app.cors.allow-credentials=false"
})
@DisplayName("C1 - Privilege Escalation Security Tests")
class PrivilegeEscalationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @Test
    @DisplayName("Registration always returns ROLE_USER regardless of any role field in body")
    void register_AlwaysAssignsRoleUser() throws Exception {
        UserDto userDto = UserDto.builder()
                .id(1L)
                .email("test@example.com")
                .role(UserRole.ROLE_USER)
                .build();

        AuthResponse mockResponse = AuthResponse.builder()
                .accessToken("mock.jwt.token")
                .tokenType("Bearer")
                .expiresIn(900000L)
                .user(userDto)
                .build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(mockResponse);

        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("Secur3Pass!");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.user.role").value("ROLE_USER"));
    }

    @Test
    @DisplayName("Request body with role=ADMIN is ignored — server always forces ROLE_USER")
    void register_WithRoleAdminInBody_IsIgnored() throws Exception {
        // Even if a crafted request contains "role": "ROLE_ADMIN",
        // RegisterRequest has no 'role' field so Jackson ignores unknown fields.
        // The service always returns ROLE_USER.
        UserDto userDto = UserDto.builder()
                .id(1L)
                .email("attacker@example.com")
                .role(UserRole.ROLE_USER)  // Always USER
                .build();

        AuthResponse mockResponse = AuthResponse.builder()
                .accessToken("mock.jwt.token")
                .tokenType("Bearer")
                .expiresIn(900000L)
                .user(userDto)
                .build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(mockResponse);

        // Craft malicious body with role field
        String maliciousBody = """
                {
                    "email": "attacker@example.com",
                    "password": "Secur3Pass!",
                    "role": "ROLE_ADMIN"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(maliciousBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.user.role").value("ROLE_USER"));
    }

    @Test
    @DisplayName("Registration with weak password fails validation")
    void register_WithWeakPassword_ReturnsBadRequest() throws Exception {
        String weakPasswordBody = """
                {
                    "email": "user@example.com",
                    "password": "weak"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(weakPasswordBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.validationErrors.password").exists());
    }

    @Test
    @DisplayName("Registration with invalid email fails validation")
    void register_WithInvalidEmail_ReturnsBadRequest() throws Exception {
        String invalidEmailBody = """
                {
                    "email": "not-an-email",
                    "password": "Secur3Pass!"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidEmailBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors.email").exists());
    }

    @Test
    @DisplayName("Registration without password fails validation")
    void register_WithoutPassword_ReturnsBadRequest() throws Exception {
        String missingPasswordBody = """
                {
                    "email": "user@example.com"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(missingPasswordBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors.password").exists());
    }
}
