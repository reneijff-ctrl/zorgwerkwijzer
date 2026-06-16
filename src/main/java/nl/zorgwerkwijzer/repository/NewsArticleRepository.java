package nl.zorgwerkwijzer.repository;

import nl.zorgwerkwijzer.model.NewsArticle;
import nl.zorgwerkwijzer.model.NewsArticleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, Long> {
    Optional<NewsArticle> findBySlug(String slug);
    Page<NewsArticle> findAllByIsPublishedTrue(Pageable pageable);
    Page<NewsArticle> findAllByCategoryAndIsPublishedTrue(String category, Pageable pageable);
    Page<NewsArticle> findAllByStatus(NewsArticleStatus status, Pageable pageable);
    boolean existsBySlug(String slug);
    long countByStatus(NewsArticleStatus status);
}
