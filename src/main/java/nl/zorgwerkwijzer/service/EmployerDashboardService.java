package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.UserDto;
import nl.zorgwerkwijzer.dto.dashboard.DashboardApplicationDto;
import nl.zorgwerkwijzer.dto.dashboard.DashboardVacancyCreateRequest;
import nl.zorgwerkwijzer.dto.dashboard.DashboardVacancyDto;
import nl.zorgwerkwijzer.dto.dashboard.LinkEmployerRequest;
import nl.zorgwerkwijzer.dto.dashboard.VacancyDeleteResultDto;
import nl.zorgwerkwijzer.model.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EmployerDashboardService {

    /**
     * Koppelt een werkgever-account aan de ingelogde gebruiker en geeft ROLE_EMPLOYER.
     * Alleen uitvoerbaar door ROLE_ADMIN.
     */
    UserDto linkEmployer(Long userId, LinkEmployerRequest request);

    /**
     * Geeft alle vacatures van de werkgever die gekoppeld is aan de ingelogde gebruiker.
     */
    Page<DashboardVacancyDto> getMyVacancies(String email, Pageable pageable);

    /**
     * Maakt een nieuwe vacature aan voor de ingelogde werkgever.
     */
    DashboardVacancyDto createVacancy(String email, DashboardVacancyCreateRequest request);

    /**
     * Werkt een vacature bij van de ingelogde werkgever.
     * Gooit AccessDeniedException als de vacature niet van diens employer is.
     */
    DashboardVacancyDto updateVacancy(String email, Long vacancyId, DashboardVacancyCreateRequest request);

    /**
     * Verwijdert een vacature van de ingelogde werkgever.
     * Als er sollicitaties aan gekoppeld zijn, wordt de vacature gedeactiveerd (isActive=false)
     * in plaats van verwijderd.
     * Gooit AccessDeniedException als de vacature niet van diens employer is.
     */
    VacancyDeleteResultDto deleteVacancy(String email, Long vacancyId);

    /**
     * Geeft alle sollicitaties voor alle vacatures van de ingelogde werkgever.
     */
    Page<DashboardApplicationDto> getMyApplications(String email, Pageable pageable);

    /**
     * Geeft één sollicitatie op basis van ID, mits de sollicitatie bij een vacature
     * van de ingelogde werkgever hoort.
     */
    DashboardApplicationDto getApplicationById(String email, Long applicationId);

    /**
     * Werkt de status van een sollicitatie bij.
     * Gooit AccessDeniedException als de sollicitatie niet bij een vacature van diens employer hoort.
     */
    DashboardApplicationDto updateApplicationStatus(String email, Long applicationId, ApplicationStatus status);

    /**
     * Zet de featured-status van een vacature aan of uit voor de ingelogde werkgever.
     * Vereist dat het pakket van de werkgever isFeaturedIncluded = true heeft (PREMIUM).
     * Gooit SubscriptionLimitException als featured niet is inbegrepen.
     * Gooit AccessDeniedException als de vacature niet van diens employer is.
     */
    DashboardVacancyDto toggleFeatured(String email, Long vacancyId);
}
