package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.AuthResponse;
import nl.zorgwerkwijzer.dto.EmployerRegistrationRequest;
import nl.zorgwerkwijzer.dto.ForgotPasswordRequest;
import nl.zorgwerkwijzer.dto.LoginRequest;
import nl.zorgwerkwijzer.dto.RegisterRequest;
import nl.zorgwerkwijzer.dto.ResetPasswordRequest;
import nl.zorgwerkwijzer.dto.UserDto;
import nl.zorgwerkwijzer.model.UserRole;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse registerEmployer(EmployerRegistrationRequest request);

    UserDto updateRole(Long userId, UserRole newRole);

    /**
     * Initieert de wachtwoord-reset flow: genereert een token en verstuurt een e-mail.
     * Altijd HTTP 200 — om te voorkomen dat e-mail-adressen gelekt worden.
     */
    void forgotPassword(ForgotPasswordRequest request, String frontendUrl);

    /**
     * Valideert het token en slaat het nieuwe wachtwoord op.
     */
    void resetPassword(ResetPasswordRequest request);

    /**
     * Verifieert het e-mailadres van een gebruiker via het verificatietoken.
     */
    void verifyEmail(String token);

    /**
     * Verstuurt een nieuwe verificatiemail naar het opgegeven e-mailadres.
     */
    void resendVerificationEmail(String email);

    /**
     * Tweede stap van de admin 2FA login-flow.
     * Valideert het tempToken + TOTP-code en geeft een volledige JWT terug.
     */
    AuthResponse verifyTwoFactorLogin(String tempToken, String totpCode);

    /**
     * Retourneert de actuele user-state op basis van e-mailadres (uit JWT).
     */
    UserDto getCurrentUser(String email);
}
