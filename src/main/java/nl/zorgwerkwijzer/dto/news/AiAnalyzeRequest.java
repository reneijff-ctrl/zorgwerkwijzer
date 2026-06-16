package nl.zorgwerkwijzer.dto.news;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Schema(description = "Request voor AI-analyse van een nieuwsbron")
public class AiAnalyzeRequest {

    @Schema(description = "URL van het te analyseren artikel")
    private String url;

    @Schema(description = "Geplakte tekst om te analyseren")
    @Size(max = 50000, message = "Tekst mag maximaal 50.000 tekens bevatten")
    private String text;

    @Schema(description = "Naam van de bronpublicatie", example = "NOS Nieuws")
    private String sourceName;

    @Schema(description = "Publicatiedatum van het originele bericht (ISO-8601)", example = "2026-06-15T10:00:00")
    private String sourcePublishedAt;
}
