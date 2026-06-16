package nl.zorgwerkwijzer.mapper;

import nl.zorgwerkwijzer.dto.ProfileDto;
import nl.zorgwerkwijzer.model.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProfileMapper {

    ProfileDto toDto(Profile profile);

    Profile toEntity(ProfileDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(ProfileDto dto, @MappingTarget Profile profile);
}
