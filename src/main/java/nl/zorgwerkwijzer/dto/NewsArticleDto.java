package nl.zorgwerkwijzer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.zorgwerkwijzer.model.NewsArticleStatus;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Schema(description = "Nieuwsartikel data transfer object")
public class NewsArticleDto {

    @Schema(description = "Uniek ID", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotBlank(message = "Titel is verplicht")
    @Size(max = 255, message = "Titel mag maximaal 255 tekens bevatten")
    @Schema(description = "Titel van het artikel", example = "Nieuwe CAO VVT 2025 gepubliceerd")
    private String title;

    @Size(max = 300, message = "Slug mag maximaal 300 tekens bevatten")
    @Schema(description = "SEO-slug (auto-gegenereerd indien leeg)", example = "nieuwe-cao-vvt-2025-gepubliceerd")
    private String slug;

    @NotBlank(message = "Inhoud is verplicht")
    @Schema(description = "Volledige inhoud van het artikel (HTML of Markdown)")
    private String content;

    @Schema(description = "Korte samenvatting voor overzichtspagina's")
    private String excerpt;

    @Size(max = 100, message = "Categorie mag maximaal 100 tekens bevatten")
    @Schema(description = "Categorie van het artikel", example = "cao")
    private String category;

    @Size(max = 255, message = "Auteur mag maximaal 255 tekens bevatten")
    @Schema(description = "Naam van de auteur", example = "Redactie ZorgWerkwijzer")
    private String author;

    @Schema(description = "URL van de uitgelichte afbeelding")
    private String featuredImageUrl;

    @Schema(description = "Gepubliceerd status")
    private Boolean isPublished = false;

    @Schema(description = "Datum en tijd van publicatie")
    private LocalDateTime publishedAt;

    @Size(max = 255, message = "Meta title mag maximaal 255 tekens bevatten")
    @Schema(description = "SEO meta title")
    private String metaTitle;

    @Schema(description = "SEO meta description")
    private String metaDescription;

    @Schema(description = "Aanmaakdatum", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;

    @Schema(description = "Laatste wijzigingsdatum", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime updatedAt;

    @Schema(description = "Status van het artikel: DRAFT, PUBLISHED, SCHEDULED")
    private NewsArticleStatus status = NewsArticleStatus.DRAFT;

    @Schema(description = "Komma-gescheiden tags", example = "cao-vvt,verpleegkundige,salaris")
    private String tags;

    @Schema(description = "Naam van de bronpublicatie")
    private String sourceName;

    @Schema(description = "URL van het originele bronbericht")
    private String sourceUrl;

    @Schema(description = "Publicatiedatum bij de bron")
    private LocalDateTime sourcePublishedAt;

    @Schema(description = "Datum waarop het bericht geïmporteerd is", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime importedAt;

    @Schema(description = "Of het artikel door AI is gegenereerd")
    private Boolean aiGenerated = false;

    @Schema(description = "Geschatte leesduur in minuten")
    private Integer readingTime;

    @Schema(description = "Uitgelichte quote uit het artikel")
    private String featuredQuote;

    @Schema(description = "Geplande publicatiedatum (voor SCHEDULED status)")
    private LocalDateTime scheduledAt;
}
