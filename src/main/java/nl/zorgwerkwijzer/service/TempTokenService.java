package nl.zorgwerkwijzer.service;

/**
 * Short-lived token service used during the 2FA login flow.
 * After password verification succeeds for an admin with 2FA enabled,
 * a temp token is issued. The admin must exchange it (+ TOTP code) for a real JWT.
 */
public interface TempTokenService {

    /** Generate a new temp token for the given user id. Valid for 5 minutes. */
    String generateTempToken(Long userId);

    /**
     * Validate the temp token and return the associated user id.
     * Throws IllegalArgumentException when invalid or expired.
     */
    Long validateTempToken(String token);

    /** Invalidate (consume) a temp token so it cannot be reused. */
    void invalidateTempToken(String token);
}
