package nl.zorgwerkwijzer.service.impl;

import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.HealthcareProviderDto;
import nl.zorgwerkwijzer.exception.ResourceNotFoundException;
import nl.zorgwerkwijzer.mapper.HealthcareProviderMapper;
import nl.zorgwerkwijzer.model.HealthcareProvider;
import nl.zorgwerkwijzer.repository.HealthcareProviderRepository;
import nl.zorgwerkwijzer.service.HealthcareProviderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class HealthcareProviderServiceImpl implements HealthcareProviderService {

    private final HealthcareProviderRepository repository;
    private final HealthcareProviderMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public Page<HealthcareProviderDto> findAll(Pageable pageable) {
        return repository.findAll(pageable)
                .map(mapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public HealthcareProviderDto findById(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + id));
    }

    @Override
    public HealthcareProviderDto create(HealthcareProviderDto providerDto) {
        HealthcareProvider provider = mapper.toEntity(providerDto);
        return mapper.toDto(repository.save(provider));
    }

    @Override
    public HealthcareProviderDto update(Long id, HealthcareProviderDto providerDto) {
        HealthcareProvider existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + id));
        
        existing.setName(providerDto.getName());
        existing.setEmail(providerDto.getEmail());
        existing.setPhoneNumber(providerDto.getPhoneNumber());
        existing.setAddress(providerDto.getAddress());
        
        return mapper.toDto(repository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Provider not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
