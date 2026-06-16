package nl.zorgwerkwijzer.dto.dashboard;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Resultaat van een vacatureverwijderingsverzoek")
public class VacancyDeleteResultDto {

    @Schema(description = "true als de operatie geslaagd is", example = "true")
    private boolean success;

    @Schema(description = "'deleted' of 'deactivated'", example = "deactivated")
    private String action;

    @Schema(description = "Beschrijving van de uitgevoerde actie",
            example = "Vacature gedeactiveerd omdat er sollicitaties gekoppeld zijn.")
    private String message;
}
