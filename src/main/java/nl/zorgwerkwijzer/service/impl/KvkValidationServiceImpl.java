package nl.zorgwerkwijzer.service.impl;

import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.service.KvkValidationService;
import org.springframework.stereotype.Service;

/**
 * Placeholder implementatie van {@link KvkValidationService}.
 *
 * <p>Voert uitsluitend lokale formaat-validatie uit (exact 8 cijfers).
 * Externe KvK API-verificatie is nog niet geïmplementeerd.
 *
 * <p><strong>TODO — KvK API integratie:</strong>
 * <ol>
 *   <li>Voeg {@code KVK_API_KEY} toe als environment variable en in {@code application.yaml}</li>
 *   <li>Vervang de body van {@link #isActiveRegistration(String)} door een HTTP-aanroep naar:
 *       {@code GET https://api.kvk.nl/api/v1/basisprofielen/{kvkNummer}}</li>
 *   <li>Gebruik Spring {@code RestClient} of {@code WebClient} met de API-sleutel als header:
 *       {@code apikey: <KVK_API_KEY>}</li>
 *   <li>Verwerk de response: controleer of {@code status == "ACTIEF"} in het JSON-antwoord</li>
 *   <li>Voeg foutafhandeling toe voor: 404 (niet gevonden), 429 (rate limit), 5xx (KvK API down)</li>
 * </ol>
 */
@Slf4j
@Service
public class KvkValidationServiceImpl implements KvkValidationService {

    private static final String KVK_FORMAT_REGEX = "\\d{8}";

    @Override
    public boolean isValidFormat(String kvkNumber) {
        if (kvkNumber == null) return false;
        return kvkNumber.matches(KVK_FORMAT_REGEX);
    }

    /**
     * Placeholder — retourneert altijd {@code true}.
     * Vervang door echte KvK API-aanroep zodra API-sleutel beschikbaar is.
     */
    @Override
    public boolean isActiveRegistration(String kvkNumber) {
        log.debug("[KVK] isActiveRegistration aangeroepen voor {} — placeholder retourneert true", kvkNumber);
        // TODO: implementeer KvK API-aanroep (zie klasse-documentatie)
        return true;
    }
}
