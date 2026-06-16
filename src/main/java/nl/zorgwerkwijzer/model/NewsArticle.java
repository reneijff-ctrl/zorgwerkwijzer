package nl.zorgwerkwijzer.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "news_articles")
@Getter
@Setter
@NoArgsConstructor
public class NewsArticle extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 300, unique = true)
    private String slug;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String excerpt;

    @Column(length = 100)
    private String category;

    @Column(length = 255)
    private String author;

    @Column(name = "featured_image_url", columnDefinition = "TEXT")
    private String featuredImageUrl;

    @Column(name = "is_published", nullable = false)
    private Boolean isPublished = false;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "meta_title", length = 255)
    private String metaTitle;

    @Column(name = "meta_description", columnDefinition = "TEXT")
    private String metaDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NewsArticleStatus status = NewsArticleStatus.DRAFT;

    @Column(columnDefinition = "TEXT")
    private String tags;

    @Column(name = "source_name", length = 255)
    private String sourceName;

    @Column(name = "source_url", columnDefinition = "TEXT")
    private String sourceUrl;

    @Column(name = "source_published_at")
    private LocalDateTime sourcePublishedAt;

    @Column(name = "imported_at")
    private LocalDateTime importedAt;

    @Column(name = "ai_generated", nullable = false)
    private Boolean aiGenerated = false;

    @Column(name = "reading_time")
    private Integer readingTime;

    @Column(name = "featured_quote", columnDefinition = "TEXT")
    private String featuredQuote;

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;
}
