package nl.zorgwerkwijzer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.NewsArticleDto;
import nl.zorgwerkwijzer.service.NewsArticleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/news")
@RequiredArgsConstructor
@Tag(name = "Nieuws", description = "Endpoints voor het beheren van nieuwsartikelen")
public class NewsArticleController {

    private final NewsArticleService newsArticleService;

    @GetMapping
    @Operation(summary = "Alle gepubliceerde artikelen ophalen",
               description = "Retourneert een gepagineerde lijst van alle gepubliceerde nieuwsartikelen, optioneel gefilterd op categorie.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lijst succesvol opgehaald")
    })
    public ResponseEntity<Page<NewsArticleDto>> findAll(
            @RequestParam(required = false) String category,
            @PageableDefault(size = 20, sort = "publishedAt") Pageable pageable) {

        Page<NewsArticleDto> page = (category != null && !category.isBlank())
                ? newsArticleService.findAllPublishedByCategory(category, pageable)
                : newsArticleService.findAllPublished(pageable);

        return ResponseEntity.ok(page);
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Artikel ophalen op slug",
               description = "Retourneert één gepubliceerd artikel op basis van de SEO-slug.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Artikel gevonden"),
            @ApiResponse(responseCode = "404", description = "Artikel niet gevonden")
    })
    public ResponseEntity<NewsArticleDto> findBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(newsArticleService.findBySlug(slug));
    }

    @PostMapping
    @Operation(summary = "Nieuw artikel aanmaken (admin)",
               description = "Maakt een nieuw nieuwsartikel aan. Vereist admin-rechten.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Artikel aangemaakt"),
            @ApiResponse(responseCode = "400", description = "Ongeldige invoer"),
            @ApiResponse(responseCode = "409", description = "Slug is al in gebruik")
    })
    public ResponseEntity<NewsArticleDto> create(@Valid @RequestBody NewsArticleDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(newsArticleService.create(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Artikel bijwerken (admin)",
               description = "Werkt een bestaand nieuwsartikel bij. Vereist admin-rechten.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Artikel bijgewerkt"),
            @ApiResponse(responseCode = "400", description = "Ongeldige invoer"),
            @ApiResponse(responseCode = "404", description = "Artikel niet gevonden"),
            @ApiResponse(responseCode = "409", description = "Slug is al in gebruik")
    })
    public ResponseEntity<NewsArticleDto> update(@PathVariable Long id,
                                                  @Valid @RequestBody NewsArticleDto dto) {
        return ResponseEntity.ok(newsArticleService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Artikel verwijderen (admin)",
               description = "Verwijdert een nieuwsartikel definitief. Vereist admin-rechten.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Artikel verwijderd"),
            @ApiResponse(responseCode = "404", description = "Artikel niet gevonden")
    })
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        newsArticleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
