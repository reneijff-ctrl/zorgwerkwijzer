package nl.zorgwerkwijzer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.ContactRequestDto;
import nl.zorgwerkwijzer.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/contact")
@RequiredArgsConstructor
@Tag(name = "Contact", description = "Endpoint voor het versturen van contactberichten")
public class ContactController {

    private final ContactService contactService;

    @Operation(summary = "Verstuur een contactbericht", description = "Stuurt een contactbericht door naar de ZorgWerkwijzer admin via e-mail.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Bericht succesvol verzonden"),
            @ApiResponse(responseCode = "400", description = "Ongeldige invoer")
    })
    @PostMapping
    public ResponseEntity<Map<String, String>> sendContactMessage(@Valid @RequestBody ContactRequestDto request) {
        contactService.sendContactMessage(request);
        return ResponseEntity.ok(Map.of("message", "Uw bericht is succesvol verzonden. We nemen zo snel mogelijk contact met u op."));
    }
}
