package nl.zorgwerkwijzer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Authentication response containing access token and user info")
public class AuthResponse {

    @Schema(description = "JWT access token")
    private String accessToken;

    @Schema(description = "Token type", example = "Bearer")
    @Builder.Default
    private String tokenType = "Bearer";

    @Schema(description = "Access token expiration in milliseconds", example = "900000")
    private long expiresIn;

    @Schema(description = "Authenticated user info")
    private UserDto user;

    @Schema(description = "True when admin has 2FA enabled and must complete TOTP verification")
    @Builder.Default
    private boolean requiresTwoFactor = false;

    @Schema(description = "Temporary token used to complete 2FA verification (short-lived, no access)")
    private String tempToken;
}
