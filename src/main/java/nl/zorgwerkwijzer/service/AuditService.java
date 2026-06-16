package nl.zorgwerkwijzer.service;

/**
 * Audit logging service voor security-relevante events.
 */
public interface AuditService {

    void logLoginSuccess(String email, String ipAddress);

    void logLoginFailed(String email, String ipAddress, String reason);

    void logRegister(String email, String role, String ipAddress);

    void logVacancyCreated(long vacancyId, String title, String createdByEmail);

    void logApplicationSubmitted(long applicationId, String candidateEmail, long vacancyId);
}
