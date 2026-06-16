package nl.zorgwerkwijzer.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.dto.ContactRequestDto;
import nl.zorgwerkwijzer.service.ContactMessageService;
import nl.zorgwerkwijzer.service.ContactService;
import nl.zorgwerkwijzer.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContactServiceImpl implements ContactService {

    private final EmailService emailService;
    private final ContactMessageService contactMessageService;

    @Value("${app.mail.admin:admin@zorgwerkwijzer.nl}")
    private String adminEmail;

    @Override
    public void sendContactMessage(ContactRequestDto request) {
        log.info("[CONTACT] Nieuw contactbericht ontvangen van {}", request.getEmail());

        try {
            contactMessageService.save(request.getName(), request.getEmail(), request.getMessage());
        } catch (Exception ex) {
            log.error("[CONTACT] Opslaan in database mislukt voor {}: {}", request.getEmail(), ex.getMessage());
        }

        try {
            emailService.sendContactMessage(request.getName(), request.getEmail(), request.getMessage(), adminEmail);
            log.info("[CONTACT] Admin notificatie verzonden naar {}", adminEmail);
        } catch (Exception ex) {
            log.error("[CONTACT] Verzenden admin notificatie mislukt voor {}: {}", request.getEmail(), ex.getMessage());
        }

        try {
            emailService.sendContactConfirmation(request.getEmail(), request.getName(), request.getMessage());
            log.info("[CONTACT] Bevestigingsmail verzonden naar {}", request.getEmail());
        } catch (Exception ex) {
            log.error("[CONTACT] Verzenden bevestigingsmail mislukt voor {}: {}", request.getEmail(), ex.getMessage());
        }
    }
}
