package nl.zorgwerkwijzer.mapper;

import nl.zorgwerkwijzer.dto.HealthcareProviderDto;
import nl.zorgwerkwijzer.model.HealthcareProvider;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface HealthcareProviderMapper {
    HealthcareProviderDto toDto(HealthcareProvider provider);
    HealthcareProvider toEntity(HealthcareProviderDto providerDto);
}
