package nl.zorgwerkwijzer.service.impl;

import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.service.AuditService;
import org.springframework.stereotype.Service;

/**
 * Implementatie van AuditService die security-events logt via SLF4J.
 * Logs worden door het logging-framework (Logback/Log4j2) weggeschreven
 * naar console én bestand, zodat ze in productie door SIEM/monitoring
 * kunnen worden opgepikt.
 */
@Service
@Slf4j
public class AuditServiceImpl implements AuditService {

    private static final String AUDIT_MARKER = "[AUDIT]";

    @Override
    public void logLoginSuccess(String email, String ipAddress) {
        log.info("{} LOGIN_SUCCESS email={} ip={}", AUDIT_MARKER, email, ipAddress);
    }

    @Override
    public void logLoginFailed(String email, String ipAddress, String reason) {
        log.warn("{} LOGIN_FAILED email={} ip={} reason={}", AUDIT_MARKER, email, ipAddress, reason);
    }

    @Override
    public void logRegister(String email, String role, String ipAddress) {
        log.info("{} REGISTER email={} role={} ip={}", AUDIT_MARKER, email, role, ipAddress);
    }

    @Override
    public void logVacancyCreated(long vacancyId, String title, String createdByEmail) {
        log.info("{} VACANCY_CREATED id={} title=\"{}\" by={}", AUDIT_MARKER, vacancyId, title, createdByEmail);
    }

    @Override
    public void logApplicationSubmitted(long applicationId, String candidateEmail, long vacancyId) {
        log.info("{} APPLICATION_SUBMITTED id={} candidate={} vacancyId={}",
                AUDIT_MARKER, applicationId, candidateEmail, vacancyId);
    }
}
