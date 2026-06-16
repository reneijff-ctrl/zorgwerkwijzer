package nl.zorgwerkwijzer.service;

/**
 * Service voor TOTP (Time-based One-Time Password) beheer voor Admin 2FA.
 * Compatibel met Google Authenticator, Microsoft Authenticator en Authy.
 */
public interface TotpService {

    /**
     * Genereert een nieuw TOTP-secret voor een admin gebruiker.
     *
     * @return Base32-gecodeerd secret (32 tekens)
     */
    String generateSecret();

    /**
     * Genereert een otpauth:// URI voor QR-code weergave.
     *
     * @param secret    het TOTP-secret
     * @param email     e-mailadres van de admin (label in authenticator app)
     * @return otpauth URI geschikt voor QR-code generatie
     */
    String generateOtpAuthUri(String secret, String email);

    /**
     * Genereert een Base64-gecodeerde QR-code afbeelding (PNG) als data URI.
     *
     * @param otpAuthUri de otpauth:// URI
     * @return data:image/png;base64,... string voor directe weergave in &lt;img&gt;
     */
    String generateQrCodeDataUri(String otpAuthUri);

    /**
     * Verifieert een TOTP-code ingevoerd door de gebruiker.
     * Accepteert codes van het huidige tijdvenster ± 1 venster (30 seconden tolerantie).
     *
     * @param secret het TOTP-secret van de gebruiker
     * @param code   de 6-cijferige code uit de authenticator app
     * @return {@code true} als de code geldig is
     */
    boolean verifyCode(String secret, String code);
}
