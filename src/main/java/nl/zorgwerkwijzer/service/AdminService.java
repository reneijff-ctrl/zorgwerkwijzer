package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.admin.*;
import nl.zorgwerkwijzer.model.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;

public interface AdminService {

    // ── Statistieken ──────────────────────────────────────────────────────────
    AdminStatsDto getStats();

    // ── Gebruikers ────────────────────────────────────────────────────────────
    Page<AdminUserDto> getUsers(String q, UserRole role, Pageable pageable);

    AdminUserDto getUserById(Long id);

    void deleteUser(Long id);

    // ── Werkgevers ────────────────────────────────────────────────────────────
    Page<AdminEmployerDto> getEmployers(String q, Pageable pageable);

    AdminEmployerDetailDto getEmployerById(Long id);

    // ── Abonnementen ──────────────────────────────────────────────────────────
    Page<AdminSubscriptionDto> getSubscriptions(String status, Long packageId, Boolean canceledLast30Days, Pageable pageable);

    // ── Vacatures ─────────────────────────────────────────────────────────────
    Page<AdminVacancyDto> getVacancies(String q, Boolean isActive, Boolean isFeatured, Pageable pageable);

    AdminVacancyDetailDto getVacancyById(Long id);

    AdminVacancyDto toggleVacancyFeatured(Long id);

    AdminVacancyDto toggleVacancyActive(Long id);

    void deleteVacancy(Long id);
}
