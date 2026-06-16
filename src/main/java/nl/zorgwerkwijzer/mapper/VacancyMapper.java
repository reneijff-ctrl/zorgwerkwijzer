package nl.zorgwerkwijzer.mapper;

import nl.zorgwerkwijzer.dto.VacancyDetailDto;
import nl.zorgwerkwijzer.dto.VacancyListDto;
import nl.zorgwerkwijzer.model.Vacancy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface VacancyMapper {

    @Mapping(source = "employer.name",    target = "employerName")
    @Mapping(source = "employer.slug",    target = "employerSlug")
    @Mapping(source = "employer.logoUrl", target = "employerLogoUrl")
    @Mapping(target = "cityName",         ignore = true)
    @Mapping(target = "occupationName",   ignore = true)
    VacancyListDto toListDto(Vacancy vacancy);

    @Mapping(source = "employer.name",       target = "employerName")
    @Mapping(source = "employer.slug",       target = "employerSlug")
    @Mapping(source = "employer.logoUrl",    target = "employerLogoUrl")
    @Mapping(source = "employer.websiteUrl", target = "employerWebsiteUrl")
    @Mapping(target = "cityName",            ignore = true)
    @Mapping(target = "occupationName",      ignore = true)
    VacancyDetailDto toDetailDto(Vacancy vacancy);

    @Mapping(target = "id",           ignore = true)
    @Mapping(target = "employer",     ignore = true)
    @Mapping(target = "createdAt",    ignore = true)
    @Mapping(target = "updatedAt",    ignore = true)
    void updateEntityFromDto(nl.zorgwerkwijzer.dto.VacancyCreateUpdateDto dto, @MappingTarget Vacancy vacancy);
}
