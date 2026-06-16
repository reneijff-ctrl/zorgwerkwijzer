package nl.zorgwerkwijzer.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.ContactMessageDto;
import nl.zorgwerkwijzer.dto.ContactMessageStatsDto;
import nl.zorgwerkwijzer.dto.ContactReplyDto;
import nl.zorgwerkwijzer.dto.ContactReplyRequest;
import nl.zorgwerkwijzer.model.AuditAction;
import nl.zorgwerkwijzer.model.AdminAuditLog;
import nl.zorgwerkwijzer.model.ContactMessageStatus;
import nl.zorgwerkwijzer.model.User;
import nl.zorgwerkwijzer.repository.AdminAuditLogRepository;
import nl.zorgwerkwijzer.repository.UserRepository;
import nl.zorgwerkwijzer.service.ContactMessageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.time.LocalDateTime;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/contact-messages")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class ContactMessageController {

    private final ContactMessageService contactMessageService;
    private final AdminAuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<ContactMessageDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(contactMessageService.findAll(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ContactMessageDto>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "ALL") String dateRange,
            @RequestParam(required = false, defaultValue = "DESC") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        ContactMessageStatus statusEnum = (status != null && !status.isBlank()) ? ContactMessageStatus.valueOf(status) : null;
        LocalDateTime from = switch (dateRange) {
            case "TODAY" -> LocalDateTime.now().toLocalDate().atStartOfDay();
            case "WEEK" -> LocalDateTime.now().minusDays(7);
            case "MONTH" -> LocalDateTime.now().minusDays(30);
            default -> null;
        };
        Sort.Direction direction = "ASC".equalsIgnoreCase(sort) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "createdAt"));
        try {
            return ResponseEntity.ok(contactMessageService.search(q, statusEnum, from, pageable));
        } catch (Exception ex) {
            log.error("[CONTACT_SEARCH_ERROR] q={} status={} dateRange={} sort={} page={} size={}",
                    q, status, dateRange, sort, page, size, ex);
            throw ex;
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<ContactMessageStatsDto> getStats() {
        return ResponseEntity.ok(contactMessageService.getStats());
    }

    @GetMapping("/recent")
    public ResponseEntity<java.util.List<ContactMessageDto>> getRecent() {
        return ResponseEntity.ok(contactMessageService.getRecent());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactMessageDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(contactMessageService.findById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ContactMessageDto> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        ContactMessageStatus status = ContactMessageStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(contactMessageService.updateStatus(id, status));
    }

    @PostMapping("/{id}/reply")
    public ResponseEntity<ContactReplyDto> reply(
            @PathVariable Long id,
            @Valid @RequestBody ContactReplyRequest request,
            @AuthenticationPrincipal UserDetails principal) {
        User admin = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.UNAUTHORIZED, "Admin niet gevonden"));
        ContactReplyDto reply = contactMessageService.addReply(id, request, admin.getId(), admin.getEmail());
        auditLogRepository.save(AdminAuditLog.builder()
                .adminUserId(admin.getId())
                .adminEmail(admin.getEmail())
                .action(AuditAction.CONTACT_REPLY_SENT)
                .entityType("ContactMessage")
                .entityId(id)
                .entityName("Contactbericht #" + id)
                .newValue("Admin " + admin.getEmail() + " heeft geantwoord op contactbericht #" + id)
                .build());
        return ResponseEntity.ok(reply);
    }
}
