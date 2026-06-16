package nl.zorgwerkwijzer.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.config.OpenAiProperties;
import nl.zorgwerkwijzer.dto.news.AiAnalyzeRequest;
import nl.zorgwerkwijzer.service.NewsArticleService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class NewsScanner {

    private final NewsArticleService newsArticleService;
    private final OpenAiProperties openAiProperties;

    /**
     * Zoekonderwerpen voor de dagelijkse nieuwsscan.
     * Elke query wordt omgezet naar een Google News RSS-feed URL.
     */
    private static final List<String> SEARCH_QUERIES = List.of(
            "CAO zorg 2025",
            "CAO VVT verpleging verzorging",
            "CAO GGZ geestelijke gezondheidszorg",
            "verpleegkundige salaris Nederland",
            "helpende plus salaris zorg",
            "personeelstekort zorg Nederland",
            "arbeidsmarkt zorg 2025",
            "ouderenzorg nieuws",
            "ziekenhuizen personeel",
            "wetgeving zorg Nederland"
    );

    /**
     * Dagelijkse scan om 02:00 's nachts.
     * Haalt Google News RSS-feeds op per zoekterm en analyseert nieuwe artikelen via AI.
     */
    @Scheduled(cron = "0 0 2 * * *")
    public void scanDailyNews() {
        if (!openAiProperties.isConfigured()) {
            log.info("[SCANNER] OpenAI niet geconfigureerd — dagelijkse scan overgeslagen");
            return;
        }

        log.info("[SCANNER] Dagelijkse nieuwsscan gestart — {} zoektermen", SEARCH_QUERIES.size());
        int imported = 0;

        for (String query : SEARCH_QUERIES) {
            try {
                imported += scanQuery(query);
            } catch (Exception e) {
                log.warn("[SCANNER] Fout bij scannen van '{}': {}", query, e.getMessage());
            }
        }

        log.info("[SCANNER] Dagelijkse nieuwsscan voltooid — {} nieuwe concepten aangemaakt", imported);
    }

    private int scanQuery(String query) {
        String rssUrl = buildGoogleNewsRssUrl(query);
        log.debug("[SCANNER] RSS ophalen: {}", rssUrl);

        try {
            // Haal RSS-feed op
            org.springframework.web.client.RestClient client =
                    org.springframework.web.client.RestClient.create();
            String rssContent = client.get()
                    .uri(rssUrl)
                    .header("User-Agent", "ZorgWerkwijzer-NewsBot/1.0")
                    .retrieve()
                    .body(String.class);

            if (rssContent == null || rssContent.isBlank()) return 0;

            // Extraheer eerste artikel-URL uit RSS
            String articleUrl = extractFirstArticleUrl(rssContent);
            String articleTitle = extractFirstArticleTitle(rssContent);
            if (articleUrl == null) return 0;

            log.info("[SCANNER] Nieuw artikel gevonden voor '{}': {}", query, articleTitle);

            AiAnalyzeRequest request = new AiAnalyzeRequest();
            request.setUrl(articleUrl);
            request.setSourceName(extractSourceName(rssContent));

            newsArticleService.analyzeAndCreate(request);
            return 1;

        } catch (Exception e) {
            log.warn("[SCANNER] RSS verwerking mislukt voor query '{}': {}", query, e.getMessage());
            return 0;
        }
    }

    private String buildGoogleNewsRssUrl(String query) {
        String encoded = query.replace(" ", "+");
        return "https://news.google.com/rss/search?q=" + encoded + "&hl=nl&gl=NL&ceid=NL:nl";
    }

    private String extractFirstArticleUrl(String rssXml) {
        // Eenvoudige XML-extractie zonder externe parser
        int linkStart = rssXml.indexOf("<link>", rssXml.indexOf("<item>"));
        if (linkStart == -1) return null;
        int linkEnd = rssXml.indexOf("</link>", linkStart);
        if (linkEnd == -1) return null;
        String url = rssXml.substring(linkStart + 6, linkEnd).trim();
        return url.startsWith("http") ? url : null;
    }

    private String extractFirstArticleTitle(String rssXml) {
        int itemStart = rssXml.indexOf("<item>");
        if (itemStart == -1) return "Onbekend";
        int titleStart = rssXml.indexOf("<title>", itemStart);
        if (titleStart == -1) return "Onbekend";
        int titleEnd = rssXml.indexOf("</title>", titleStart);
        if (titleEnd == -1) return "Onbekend";
        return rssXml.substring(titleStart + 7, titleEnd)
                .replaceAll("<!\\[CDATA\\[|]]>", "").trim();
    }

    private String extractSourceName(String rssXml) {
        int sourceStart = rssXml.indexOf("<source");
        if (sourceStart == -1) return null;
        int sourceEnd = rssXml.indexOf("</source>", sourceStart);
        if (sourceEnd == -1) return null;
        return rssXml.substring(rssXml.indexOf(">", sourceStart) + 1, sourceEnd).trim();
    }
}
