package nl.zorgwerkwijzer.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.dto.NewsArticleDto;
import nl.zorgwerkwijzer.dto.news.AiAnalyzeRequest;
import nl.zorgwerkwijzer.service.NewsArticleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/news")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class AdminNewsController {

    private final NewsArticleService newsArticleService;

    @GetMapping
    public ResponseEntity<Page<NewsArticleDto>> findAll(
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        Page<NewsArticleDto> page = (status != null && !status.isBlank())
                ? newsArticleService.findAllByStatus(status, pageable)
                : newsArticleService.findAll(pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = Map.of(
                "draft", newsArticleService.countByStatus("DRAFT"),
                "published", newsArticleService.countByStatus("PUBLISHED"),
                "scheduled", newsArticleService.countByStatus("SCHEDULED"),
                "total", newsArticleService.countByStatus("DRAFT")
                        + newsArticleService.countByStatus("PUBLISHED")
                        + newsArticleService.countByStatus("SCHEDULED")
        );
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsArticleDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(newsArticleService.findById(id));
    }

    @PostMapping
    public ResponseEntity<NewsArticleDto> create(@Valid @RequestBody NewsArticleDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(newsArticleService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsArticleDto> update(@PathVariable Long id,
                                                  @Valid @RequestBody NewsArticleDto dto) {
        return ResponseEntity.ok(newsArticleService.update(id, dto));
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<NewsArticleDto> publish(@PathVariable Long id) {
        return ResponseEntity.ok(newsArticleService.publish(id));
    }

    @PostMapping("/{id}/unpublish")
    public ResponseEntity<NewsArticleDto> unpublish(@PathVariable Long id) {
        return ResponseEntity.ok(newsArticleService.unpublish(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        newsArticleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/ai/analyze")
    public ResponseEntity<NewsArticleDto> analyzeAndCreate(@RequestBody AiAnalyzeRequest request) {
        log.info("[ADMIN-NEWS] AI-analyse aangevraagd door admin");
        NewsArticleDto result = newsArticleService.analyzeAndCreate(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}
