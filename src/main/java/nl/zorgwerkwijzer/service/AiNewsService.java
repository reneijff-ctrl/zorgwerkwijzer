package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.NewsArticleDto;
import nl.zorgwerkwijzer.dto.news.AiAnalyzeRequest;

public interface AiNewsService {
    /**
     * Analyseert de opgegeven bron (URL of tekst) via OpenAI en retourneert
     * een vooraf ingevuld NewsArticleDto met status DRAFT.
     */
    NewsArticleDto analyze(AiAnalyzeRequest request);

    /**
     * Haalt de inhoud op van een externe URL (voor URL-gebaseerde analyse).
     */
    String fetchUrlContent(String url);
}
