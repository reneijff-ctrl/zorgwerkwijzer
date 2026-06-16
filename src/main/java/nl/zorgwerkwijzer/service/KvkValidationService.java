package nl.zorgwerkwijzer.service;

/**
 * Service interface voor KvK-nummer validatie.
 *
 * <p>Huidige implementatie: {@link nl.zorgwerkwijzer.service.impl.KvkValidationServiceImpl}
 * voert alleen lokale formaat-validatie uit (exact 8 cijfers).
 *
 * <p>Toekomstige integratie met de officiële KvK API (https://developers.kvk.nl/):
 * <ul>
 *   <li>Endpoint: {@code GET https://api.kvk.nl/api/v1/basisprofielen/{kvkNummer}}</li>
 *   <li>Vereist: API-sleutel via {@code KVK_API_KEY} environment variable</li>
 *   <li>Ophaalbare data: bedrijfsnaam, rechtsvorm, vestigingsadres, SBI-codes, status (actief/opgeheven)</li>
 *   <li>Implementeer in {@link nl.zorgwerkwijzer.service.impl.KvkValidationServiceImpl}
 *       door de placeholder te vervangen door een {@code RestClient} of {@code WebClient} aanroep</li>
 * </ul>
 */
public interface KvkValidationService {

    /**
     * Valideert of het opgegeven KvK-nummer een geldig formaat heeft (exact 8 cijfers).
     *
     * @param kvkNumber het te valideren KvK-nummer
     * @return {@code true} als het formaat geldig is, anders {@code false}
     */
    boolean isValidFormat(String kvkNumber);

    /**
     * Controleert of een KvK-nummer actief geregistreerd staat in het Handelsregister.
     *
     * <p><strong>TODO:</strong> Implementeer via de officiële KvK API zodra een API-sleutel
     * beschikbaar is. Huidige implementatie retourneert altijd {@code true} (placeholder).
     *
     * @param kvkNumber het te controleren KvK-nummer (moet geldig formaat hebben)
     * @return {@code true} als het nummer actief is (of als de API nog niet beschikbaar is)
     */
    boolean isActiveRegistration(String kvkNumber);
}
