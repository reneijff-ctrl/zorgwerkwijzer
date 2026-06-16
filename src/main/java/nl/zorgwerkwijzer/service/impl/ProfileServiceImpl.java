package nl.zorgwerkwijzer.service.impl;

import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.ProfileDto;
import nl.zorgwerkwijzer.exception.ResourceNotFoundException;
import nl.zorgwerkwijzer.mapper.ProfileMapper;
import nl.zorgwerkwijzer.model.Profile;
import nl.zorgwerkwijzer.repository.ProfileRepository;
import nl.zorgwerkwijzer.service.ProfileService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;

    @Override
    @Transactional(readOnly = true)
    public ProfileDto findById(Long id) {
        return profileMapper.toDto(getProfileOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public ProfileDto findByEmail(String email) {
        Profile profile = profileRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with email: " + email));
        return profileMapper.toDto(profile);
    }

    @Override
    @Transactional
    public ProfileDto create(ProfileDto dto) {
        if (profileRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + dto.getEmail());
        }
        Profile profile = profileMapper.toEntity(dto);
        return profileMapper.toDto(profileRepository.save(profile));
    }

    @Override
    @Transactional
    public ProfileDto update(Long id, ProfileDto dto) {
        Profile profile = getProfileOrThrow(id);
        if (!profile.getEmail().equals(dto.getEmail()) && profileRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + dto.getEmail());
        }
        profileMapper.updateEntityFromDto(dto, profile);
        return profileMapper.toDto(profileRepository.save(profile));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!profileRepository.existsById(id)) {
            throw new ResourceNotFoundException("Profile not found with id: " + id);
        }
        profileRepository.deleteById(id);
    }

    private Profile getProfileOrThrow(Long id) {
        return profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + id));
    }
}
