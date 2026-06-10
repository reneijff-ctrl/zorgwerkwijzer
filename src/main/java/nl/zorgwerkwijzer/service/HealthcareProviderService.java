package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.HealthcareProviderDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface HealthcareProviderService {
    Page<HealthcareProviderDto> findAll(Pageable pageable);
    HealthcareProviderDto findById(Long id);
    HealthcareProviderDto create(HealthcareProviderDto providerDto);
    HealthcareProviderDto update(Long id, HealthcareProviderDto providerDto);
    void delete(Long id);
}
