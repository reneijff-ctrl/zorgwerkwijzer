package nl.zorgwerkwijzer.mapper;

import nl.zorgwerkwijzer.dto.EmployerDto;
import nl.zorgwerkwijzer.model.Employer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EmployerMapper {

    @Mapping(target = "vacancyCount", ignore = true)
    EmployerDto toDto(Employer employer);

    @Mapping(target = "isPremium", ignore = true)
    Employer toEntity(EmployerDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isPremium", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(EmployerDto dto, @MappingTarget Employer employer);
}
