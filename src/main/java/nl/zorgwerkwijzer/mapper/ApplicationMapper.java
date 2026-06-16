package nl.zorgwerkwijzer.mapper;

import nl.zorgwerkwijzer.dto.ApplicationResponseDto;
import nl.zorgwerkwijzer.model.Application;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ApplicationMapper {

    @Mapping(source = "vacancy.id",           target = "vacancyId")
    @Mapping(source = "vacancy.title",        target = "vacancyTitle")
    @Mapping(source = "vacancy.slug",         target = "vacancySlug")
    @Mapping(source = "vacancy.employer.name",target = "employerName")
    @Mapping(source = "profile.id",           target = "profileId")
    @Mapping(expression = "java(application.getProfile().getFirstName() + \" \" + application.getProfile().getLastName())",
             target = "profileName")
    ApplicationResponseDto toDto(Application application);
}
