package nl.zorgwerkwijzer.service.impl;

import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.SavedJobDto;
import nl.zorgwerkwijzer.exception.ResourceNotFoundException;
import nl.zorgwerkwijzer.mapper.SavedJobMapper;
import nl.zorgwerkwijzer.model.Profile;
import nl.zorgwerkwijzer.model.SavedJob;
import nl.zorgwerkwijzer.model.Vacancy;
import nl.zorgwerkwijzer.repository.ProfileRepository;
import nl.zorgwerkwijzer.repository.SavedJobRepository;
import nl.zorgwerkwijzer.repository.VacancyRepository;
import nl.zorgwerkwijzer.service.SavedJobService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SavedJobServiceImpl implements SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final VacancyRepository  vacancyRepository;
    private final ProfileRepository  profileRepository;
    private final SavedJobMapper     savedJobMapper;

    @Override
    @Transactional
    public SavedJobDto save(Long vacancyId, Long profileId) {
        Vacancy vacancy = vacancyRepository.findById(vacancyId)
                .orElseThrow(() -> new ResourceNotFoundException("Vacancy not found with id: " + vacancyId));

        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + profileId));

        if (savedJobRepository.existsByVacancyIdAndProfileId(vacancyId, profileId)) {
            throw new IllegalArgumentException("Vacancy already saved");
        }

        SavedJob savedJob = new SavedJob();
        savedJob.setVacancy(vacancy);
        savedJob.setProfile(profile);

        return savedJobMapper.toDto(savedJobRepository.save(savedJob));
    }

    @Override
    @Transactional
    public void remove(Long vacancyId, Long profileId) {
        if (!savedJobRepository.existsByVacancyIdAndProfileId(vacancyId, profileId)) {
            throw new ResourceNotFoundException("Saved job not found for vacancyId: " + vacancyId + " and profileId: " + profileId);
        }
        savedJobRepository.deleteByVacancyIdAndProfileId(vacancyId, profileId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SavedJobDto> findByProfile(Long profileId, Pageable pageable) {
        return savedJobRepository.findAllByProfileId(profileId, pageable)
                .map(savedJobMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isSaved(Long vacancyId, Long profileId) {
        return savedJobRepository.existsByVacancyIdAndProfileId(vacancyId, profileId);
    }
}
