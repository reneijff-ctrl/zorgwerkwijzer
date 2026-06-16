package nl.zorgwerkwijzer.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.config.OpenAiProperties;
import nl.zorgwerkwijzer.dto.NewsArticleDto;
import nl.zorgwerkwijzer.dto.news.AiAnalyzeRequest;
import nl.zorgwerkwijzer.model.NewsArticleStatus;
import nl.zorgwerkwijzer.service.AiNewsService;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiNewsServiceImpl implements AiNewsService {

    private final OpenAiProperties openAiProperties;
    private final ObjectMapper objectMapper;

    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";

    private static final String SYSTEM_PROMPT = """
            Je bent een professionele zorgredacteur voor ZorgWerkwijzer.nl.
            Analyseer de aangeleverde tekst en genereer een nieuwsartikel in het Nederlands.
            
            BELANGRIJK - AUTEURSRECHT:
            - Kopieer NOOIT volledige teksten van derden.
            - Schrijf altijd een UNIEK artikel gebaseerd op de feiten uit de bron.
            - Verwijs naar de originele bron.
            
            Retourneer UITSLUITEND een geldig JSON-object met deze velden:
            {
              "title": "Pakkende Nederlandse titel (max 100 tekens)",
              "excerpt": "Korte samenvatting van 2-3 zinnen",
              "content": "Volledig uniek artikel in HTML (minimaal 300 woorden, gebruik <h2>, <p>, <ul> tags)",
              "metaTitle": "SEO titel (max 60 tekens)",
              "metaDescription": "SEO beschrijving (max 160 tekens)",
              "slug": "seo-vriendelijke-slug-zonder-speciale-tekens",
              "category": "Een van: cao-nieuws, salaris, arbeidsmarkt, ouderenzorg, ggz, gehandicaptenzorg, ziekenhuizen, jeugdzorg, opleidingen, wetgeving",
              "tags": "komma-gescheiden relevante tags (max 8)",
              "readingTime": 3,
              "featuredQuote": "Een krachtige uitgelichte quote uit het artikel (optioneel)"
            }
            """;

    @Override
    public NewsArticleDto analyze(AiAnalyzeRequest request) {
        if (!openAiProperties.isConfigured()) {
            log.warn("[AI] OpenAI niet geconfigureerd — retourneer leeg concept");
            return buildEmptyDraft(request);
        }

        String sourceText = resolveSourceText(request);
        if (sourceText == null || sourceText.isBlank()) {
            log.warn("[AI] Geen bruikbare brontekst gevonden");
            return buildEmptyDraft(request);
        }

        // Beperk tekst tot max 8000 tekens voor API-kosten
        if (sourceText.length() > 8000) {
            sourceText = sourceText.substring(0, 8000) + "...";
        }

        log.info("[AI] Analyse gestart voor bron: {}", request.getSourceName() != null ? request.getSourceName() : "onbekend");

        try {
            String jsonResponse = callOpenAi(sourceText);
            NewsArticleDto dto = parseAiResponse(jsonResponse);
            enrichWithSourceInfo(dto, request);

            // Kwaliteitsvalidatie
            if (!validateQuality(dto)) {
                log.warn("[AI] Kwaliteitsvalidatie mislukt — concept niet opgeslagen");
                return buildEmptyDraft(request);
            }

            log.info("[AI] Analyse voltooid — titel: {}", dto.getTitle());
            return dto;
        } catch (Exception e) {
            log.error("[AI] Analyse mislukt: {}", e.getMessage(), e);
            return buildEmptyDraft(request);
        }
    }

    @Override
    public String fetchUrlContent(String url) {
        try {
            log.info("[AI] URL ophalen: {}", url);
            RestClient client = RestClient.create();
            String html = client.get()
                    .uri(url)
                    .header("User-Agent", "ZorgWerkwijzer-NewsBot/1.0")
                    .retrieve()
                    .body(String.class);
            if (html == null) return "";
            // Verwijder HTML-tags voor ruwe tekst
            return html.replaceAll("<[^>]+>", " ")
                    .replaceAll("\\s+", " ")
                    .trim();
        } catch (Exception e) {
            log.warn("[AI] URL ophalen mislukt voor {}: {}", url, e.getMessage());
            return "";
        }
    }

    private String resolveSourceText(AiAnalyzeRequest request) {
        if (request.getText() != null && !request.getText().isBlank()) {
            return request.getText();
        }
        if (request.getUrl() != null && !request.getUrl().isBlank()) {
            return fetchUrlContent(request.getUrl());
        }
        return null;
    }

    private String callOpenAi(String sourceText) {
        RestClient client = RestClient.create();

        Map<String, Object> userMessage = Map.of(
                "role", "user",
                "content", "Analyseer en schrijf een artikel over:\n\n" + sourceText
        );
        Map<String, Object> systemMessage = Map.of(
                "role", "system",
                "content", SYSTEM_PROMPT
        );
        Map<String, Object> body = Map.of(
                "model", openAiProperties.getModel(),
                "messages", new Object[]{systemMessage, userMessage},
                "max_tokens", openAiProperties.getMaxTokens(),
                "temperature", 0.7,
                "response_format", Map.of("type", "json_object")
        );

        String response = client.post()
                .uri(OPENAI_URL)
                .header("Authorization", "Bearer " + openAiProperties.getApiKey())
                .header("Content-Type", "application/json")
                .body(body)
                .retrieve()
                .body(String.class);

        // Extraheer de content uit de OpenAI response
        JsonNode root = parseJson(response);
        return root.path("choices").get(0).path("message").path("content").asText();
    }

    private NewsArticleDto parseAiResponse(String jsonContent) {
        JsonNode node = parseJson(jsonContent);
        NewsArticleDto dto = new NewsArticleDto();
        dto.setTitle(node.path("title").asText("Nieuw artikel"));
        dto.setExcerpt(node.path("excerpt").asText(null));
        dto.setContent(node.path("content").asText(""));
        dto.setMetaTitle(node.path("metaTitle").asText(null));
        dto.setMetaDescription(node.path("metaDescription").asText(null));
        dto.setSlug(node.path("slug").asText(null));
        dto.setCategory(node.path("category").asText(null));
        dto.setTags(node.path("tags").asText(null));
        dto.setFeaturedQuote(node.path("featuredQuote").asText(null));
        int readingTime = node.path("readingTime").asInt(0);
        dto.setReadingTime(readingTime > 0 ? readingTime : estimateReadingTime(dto.getContent()));
        dto.setStatus(NewsArticleStatus.DRAFT);
        dto.setAiGenerated(true);
        dto.setIsPublished(false);
        dto.setAuthor("Redactie ZorgWerkwijzer");
        return dto;
    }

    private void enrichWithSourceInfo(NewsArticleDto dto, AiAnalyzeRequest request) {
        dto.setSourceName(request.getSourceName());
        dto.setSourceUrl(request.getUrl());
        dto.setImportedAt(LocalDateTime.now());
        if (request.getSourcePublishedAt() != null && !request.getSourcePublishedAt().isBlank()) {
            try {
                dto.setSourcePublishedAt(LocalDateTime.parse(request.getSourcePublishedAt()));
            } catch (DateTimeParseException e) {
                log.warn("[AI] Kon sourcePublishedAt niet parsen: {}", request.getSourcePublishedAt());
            }
        }
    }

    private boolean validateQuality(NewsArticleDto dto) {
        if (dto.getTitle() == null || dto.getTitle().length() < 20) {
            log.warn("[AI] Validatie: titel te kort ({} tekens, min 20)", dto.getTitle() == null ? 0 : dto.getTitle().length());
            return false;
        }
        if (dto.getExcerpt() == null || dto.getExcerpt().length() < 100) {
            log.warn("[AI] Validatie: samenvatting te kort ({} tekens, min 100)", dto.getExcerpt() == null ? 0 : dto.getExcerpt().length());
            return false;
        }
        String plainContent = dto.getContent() == null ? "" : dto.getContent().replaceAll("<[^>]+>", " ").replaceAll("\\s+", " ").trim();
        int wordCount = plainContent.isBlank() ? 0 : plainContent.split("\\s+").length;
        if (wordCount < 500) {
            log.warn("[AI] Validatie: inhoud te kort ({} woorden, min 500)", wordCount);
            return false;
        }
        if (dto.getMetaTitle() != null && dto.getMetaTitle().length() > 60) {
            log.warn("[AI] Validatie: SEO titel te lang ({} tekens, max 60) — wordt afgekapt", dto.getMetaTitle().length());
            dto.setMetaTitle(dto.getMetaTitle().substring(0, 60));
        }
        if (dto.getMetaDescription() != null && dto.getMetaDescription().length() > 160) {
            log.warn("[AI] Validatie: meta description te lang ({} tekens, max 160) — wordt afgekapt", dto.getMetaDescription().length());
            dto.setMetaDescription(dto.getMetaDescription().substring(0, 160));
        }
        return true;
    }

    private NewsArticleDto buildEmptyDraft(AiAnalyzeRequest request) {
        NewsArticleDto dto = new NewsArticleDto();
        dto.setTitle("Nieuw concept");
        dto.setContent("");
        dto.setStatus(NewsArticleStatus.DRAFT);
        dto.setAiGenerated(false);
        dto.setIsPublished(false);
        dto.setSourceName(request.getSourceName());
        dto.setSourceUrl(request.getUrl());
        dto.setImportedAt(LocalDateTime.now());
        dto.setAuthor("Redactie ZorgWerkwijzer");
        return dto;
    }

    private int estimateReadingTime(String content) {
        if (content == null || content.isBlank()) return 1;
        int wordCount = content.split("\\s+").length;
        return Math.max(1, wordCount / 200);
    }

    private JsonNode parseJson(String json) {
        try {
            return objectMapper.readTree(json);
        } catch (Exception e) {
            throw new RuntimeException("JSON parsen mislukt: " + e.getMessage(), e);
        }
    }
}
