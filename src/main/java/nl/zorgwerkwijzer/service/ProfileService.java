package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.ProfileDto;

public interface ProfileService {

    ProfileDto findById(Long id);

    ProfileDto findByEmail(String email);

    ProfileDto create(ProfileDto dto);

    ProfileDto update(Long id, ProfileDto dto);

    void delete(Long id);
}
