package nl.zorgwerkwijzer.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.dto.NewsArticleDto;
import nl.zorgwerkwijzer.dto.news.AiAnalyzeRequest;
import nl.zorgwerkwijzer.exception.ResourceNotFoundException;
import nl.zorgwerkwijzer.mapper.NewsArticleMapper;
import nl.zorgwerkwijzer.model.NewsArticle;
import nl.zorgwerkwijzer.model.NewsArticleStatus;
import nl.zorgwerkwijzer.repository.NewsArticleRepository;
import nl.zorgwerkwijzer.service.AiNewsService;
import nl.zorgwerkwijzer.service.NewsArticleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class NewsArticleServiceImpl implements NewsArticleService {

    private final NewsArticleRepository newsArticleRepository;
    private final NewsArticleMapper newsArticleMapper;
    private final AiNewsService aiNewsService;

    @Override
    public Page<NewsArticleDto> findAllPublished(Pageable pageable) {
        return newsArticleRepository.findAllByIsPublishedTrue(pageable)
                .map(newsArticleMapper::toDto);
    }

    @Override
    public Page<NewsArticleDto> findAllPublishedByCategory(String category, Pageable pageable) {
        return newsArticleRepository.findAllByCategoryAndIsPublishedTrue(category, pageable)
                .map(newsArticleMapper::toDto);
    }

    @Override
    public Page<NewsArticleDto> findAllByStatus(String status, Pageable pageable) {
        try {
            NewsArticleStatus s = NewsArticleStatus.valueOf(status.toUpperCase());
            return newsArticleRepository.findAllByStatus(s, pageable)
                    .map(newsArticleMapper::toDto);
        } catch (IllegalArgumentException e) {
            return newsArticleRepository.findAll(pageable).map(newsArticleMapper::toDto);
        }
    }

    @Override
    public Page<NewsArticleDto> findAll(Pageable pageable) {
        return newsArticleRepository.findAll(pageable).map(newsArticleMapper::toDto);
    }

    @Override
    public NewsArticleDto findById(Long id) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nieuwsartikel niet gevonden met id: " + id));
        return newsArticleMapper.toDto(article);
    }

    @Override
    public NewsArticleDto findBySlug(String slug) {
        NewsArticle article = newsArticleRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Nieuwsartikel niet gevonden met slug: " + slug));
        return newsArticleMapper.toDto(article);
    }

    @Override
    @Transactional
    public NewsArticleDto create(NewsArticleDto dto) {
        if (dto.getSlug() == null || dto.getSlug().isBlank()) {
            dto.setSlug(generateSlug(dto.getTitle()));
        }
        ensureUniqueSlug(dto);
        syncPublishedState(dto, null);
        NewsArticle article = newsArticleMapper.toEntity(dto);
        return newsArticleMapper.toDto(newsArticleRepository.save(article));
    }

    @Override
    @Transactional
    public NewsArticleDto update(Long id, NewsArticleDto dto) {
        NewsArticle existing = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nieuwsartikel niet gevonden met id: " + id));
        if (dto.getSlug() != null && !dto.getSlug().equals(existing.getSlug())
                && newsArticleRepository.existsBySlug(dto.getSlug())) {
            throw new IllegalArgumentException("Slug is al in gebruik: " + dto.getSlug());
        }
        syncPublishedState(dto, existing);
        newsArticleMapper.updateEntityFromDto(dto, existing);
        return newsArticleMapper.toDto(newsArticleRepository.save(existing));
    }

    @Override
    @Transactional
    public NewsArticleDto publish(Long id) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nieuwsartikel niet gevonden met id: " + id));
        article.setStatus(NewsArticleStatus.PUBLISHED);
        article.setIsPublished(true);
        if (article.getPublishedAt() == null) {
            article.setPublishedAt(LocalDateTime.now());
        }
        log.info("[NEWS] Artikel gepubliceerd: id={} titel={}", id, article.getTitle());
        return newsArticleMapper.toDto(newsArticleRepository.save(article));
    }

    @Override
    @Transactional
    public NewsArticleDto unpublish(Long id) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nieuwsartikel niet gevonden met id: " + id));
        article.setStatus(NewsArticleStatus.DRAFT);
        article.setIsPublished(false);
        log.info("[NEWS] Artikel teruggeplaatst naar concept: id={}", id);
        return newsArticleMapper.toDto(newsArticleRepository.save(article));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!newsArticleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Nieuwsartikel niet gevonden met id: " + id);
        }
        newsArticleRepository.deleteById(id);
        log.info("[NEWS] Artikel verwijderd: id={}", id);
    }

    @Override
    @Transactional
    public NewsArticleDto analyzeAndCreate(AiAnalyzeRequest request) {
        log.info("[NEWS] AI-analyse gestart voor bron: {}", request.getSourceName());
        NewsArticleDto analyzed = aiNewsService.analyze(request);
        // Sla op als DRAFT
        return create(analyzed);
    }

    @Override
    public long countByStatus(String status) {
        try {
            return newsArticleRepository.countByStatus(NewsArticleStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            return 0;
        }
    }

    // --- helpers ---

    private void ensureUniqueSlug(NewsArticleDto dto) {
        if (newsArticleRepository.existsBySlug(dto.getSlug())) {
            dto.setSlug(dto.getSlug() + "-" + System.currentTimeMillis());
        }
    }

    private void syncPublishedState(NewsArticleDto dto, NewsArticle existing) {
        if (dto.getStatus() == NewsArticleStatus.PUBLISHED) {
            dto.setIsPublished(true);
            if (dto.getPublishedAt() == null
                    && (existing == null || existing.getPublishedAt() == null)) {
                dto.setPublishedAt(LocalDateTime.now());
            }
        } else if (dto.getStatus() == NewsArticleStatus.DRAFT) {
            dto.setIsPublished(false);
        }
        // Backward compat: isPublished=true zonder status
        if (Boolean.TRUE.equals(dto.getIsPublished()) && dto.getStatus() == null) {
            dto.setStatus(NewsArticleStatus.PUBLISHED);
            if (dto.getPublishedAt() == null) dto.setPublishedAt(LocalDateTime.now());
        }
    }

    private String generateSlug(String title) {
        String normalized = Normalizer.normalize(title, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        return normalized.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }
}
