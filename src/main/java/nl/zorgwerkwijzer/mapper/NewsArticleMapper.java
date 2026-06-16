package nl.zorgwerkwijzer.mapper;

import nl.zorgwerkwijzer.dto.NewsArticleDto;
import nl.zorgwerkwijzer.model.NewsArticle;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface NewsArticleMapper {

    NewsArticleDto toDto(NewsArticle entity);

    NewsArticle toEntity(NewsArticleDto dto);

    void updateEntityFromDto(NewsArticleDto dto, @MappingTarget NewsArticle entity);
}
