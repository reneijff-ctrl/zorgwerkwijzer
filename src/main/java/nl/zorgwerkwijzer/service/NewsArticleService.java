package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.NewsArticleDto;
import nl.zorgwerkwijzer.dto.news.AiAnalyzeRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NewsArticleService {
    Page<NewsArticleDto> findAllPublished(Pageable pageable);
    Page<NewsArticleDto> findAllPublishedByCategory(String category, Pageable pageable);
    Page<NewsArticleDto> findAllByStatus(String status, Pageable pageable);
    Page<NewsArticleDto> findAll(Pageable pageable);
    NewsArticleDto findById(Long id);
    NewsArticleDto findBySlug(String slug);
    NewsArticleDto create(NewsArticleDto dto);
    NewsArticleDto update(Long id, NewsArticleDto dto);
    NewsArticleDto publish(Long id);
    NewsArticleDto unpublish(Long id);
    void delete(Long id);
    NewsArticleDto analyzeAndCreate(AiAnalyzeRequest request);
    long countByStatus(String status);
}
