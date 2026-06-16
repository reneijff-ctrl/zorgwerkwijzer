package nl.zorgwerkwijzer.mapper;

import nl.zorgwerkwijzer.dto.SavedJobDto;
import nl.zorgwerkwijzer.model.SavedJob;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SavedJobMapper {

    @Mapping(source = "vacancy.id",            target = "vacancyId")
    @Mapping(source = "vacancy.title",         target = "vacancyTitle")
    @Mapping(source = "vacancy.slug",          target = "vacancySlug")
    @Mapping(source = "vacancy.employer.name", target = "employerName")
    @Mapping(source = "profile.id",            target = "profileId")
    @Mapping(source = "createdAt",             target = "savedAt")
    SavedJobDto toDto(SavedJob savedJob);
}
