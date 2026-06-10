package nl.zorgwerkwijzer.repository;

import nl.zorgwerkwijzer.model.HealthcareProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HealthcareProviderRepository extends JpaRepository<HealthcareProvider, Long> {
    Optional<HealthcareProvider> findByEmail(String email);
}
