package nl.zorgwerkwijzer.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.dto.ContactMessageDto;
import nl.zorgwerkwijzer.dto.ContactMessageStatsDto;
import nl.zorgwerkwijzer.dto.ContactReplyDto;
import nl.zorgwerkwijzer.dto.ContactReplyRequest;
import nl.zorgwerkwijzer.model.ContactMessage;
import nl.zorgwerkwijzer.model.ContactMessageStatus;
import nl.zorgwerkwijzer.model.ContactReply;
import nl.zorgwerkwijzer.repository.ContactMessageRepository;
import nl.zorgwerkwijzer.repository.ContactMessageSpecification;
import nl.zorgwerkwijzer.repository.ContactReplyRepository;
import nl.zorgwerkwijzer.service.ContactMessageService;
import nl.zorgwerkwijzer.service.EmailService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContactMessageServiceImpl implements ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;
    private final ContactReplyRepository contactReplyRepository;
    private final EmailService emailService;

    @Override
    @Transactional
    public ContactMessage save(String name, String email, String message) {
        ContactMessage entity = new ContactMessage();
        entity.setName(name);
        entity.setEmail(email);
        entity.setMessage(message);
        entity.setStatus(ContactMessageStatus.NEW);
        ContactMessage saved = contactMessageRepository.save(entity);
        log.info("[CONTACT] Bericht opgeslagen in database met id={}", saved.getId());
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ContactMessageDto> findAll(Pageable pageable) {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public ContactMessageDto findById(Long id) {
        return contactMessageRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contactbericht niet gevonden"));
    }

    @Override
    @Transactional
    public ContactMessageDto updateStatus(Long id, ContactMessageStatus status) {
        ContactMessage entity = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contactbericht niet gevonden"));
        ContactMessageStatus oldStatus = entity.getStatus();
        entity.setStatus(status);
        ContactMessage saved = contactMessageRepository.save(entity);
        log.info("[CONTACT] Status gewijzigd voor bericht id={}: {} -> {}", id, oldStatus, status);
        return toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ContactMessageStatsDto getStats() {
        long total = contactMessageRepository.count();
        long newCount = contactMessageRepository.countByStatus(ContactMessageStatus.NEW);
        long inProgressCount = contactMessageRepository.countByStatus(ContactMessageStatus.IN_PROGRESS);
        long resolvedCount = contactMessageRepository.countByStatus(ContactMessageStatus.RESOLVED);
        return ContactMessageStatsDto.builder()
                .total(total)
                .newCount(newCount)
                .inProgressCount(inProgressCount)
                .resolvedCount(resolvedCount)
                .build();
    }

    @Override
    @Transactional
    public ContactReplyDto addReply(Long messageId, ContactReplyRequest request, Long adminUserId, String adminEmail) {
        log.info("[CONTACT] addReply aangeroepen: messageId={}, adminUserId={}, adminEmail={}, subject={}", messageId, adminUserId, adminEmail, request.getSubject());
        ContactMessage contactMessage = contactMessageRepository.findById(messageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contactbericht niet gevonden"));

        ContactReply reply = new ContactReply();
        reply.setContactMessage(contactMessage);
        reply.setAdminUserId(adminUserId);
        reply.setAdminEmail(adminEmail);
        reply.setSubject(request.getSubject());
        reply.setMessage(request.getMessage());
        ContactReply saved = contactReplyRepository.save(reply);

        contactMessage.setStatus(ContactMessageStatus.RESOLVED);
        contactMessageRepository.save(contactMessage);

        try {
            emailService.sendContactReply(contactMessage.getEmail(), contactMessage.getName(),
                    request.getSubject(), request.getMessage());
            log.info("[CONTACT] Antwoord verstuurd naar {} voor bericht id={}", contactMessage.getEmail(), messageId);
        } catch (Exception e) {
            log.error("[CONTACT] Versturen antwoord mislukt voor bericht id={}: {}", messageId, e.getMessage());
        }

        return toReplyDto(saved);
    }

    @Override
    public java.util.List<ContactMessageDto> getRecent() {
        return contactMessageRepository.findTop5ByOrderByCreatedAtDesc()
                .stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ContactMessageDto> search(String q, ContactMessageStatus status, LocalDateTime from, Pageable pageable) {
        String query = (q != null && !q.isBlank()) ? q.trim() : null;
        log.info("[CONTACT_SEARCH] q={}", query);
        log.info("[CONTACT_SEARCH] status={}", status);
        log.info("[CONTACT_SEARCH] from={}", from);
        Page<ContactMessage> results = contactMessageRepository.findAll(
                ContactMessageSpecification.search(query, status, from), pageable);
        log.info("[CONTACT_SEARCH] results={}", results.getTotalElements());
        return results.map(this::toDto);
    }

    private ContactMessageDto toDto(ContactMessage entity) {
        java.util.List<ContactReplyDto> replies = contactReplyRepository
                .findByContactMessageIdOrderByCreatedAtAsc(entity.getId())
                .stream().map(this::toReplyDto).toList();
        return ContactMessageDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .email(entity.getEmail())
                .message(entity.getMessage())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .replies(replies)
                .build();
    }

    private ContactReplyDto toReplyDto(ContactReply reply) {
        return ContactReplyDto.builder()
                .id(reply.getId())
                .adminEmail(reply.getAdminEmail())
                .subject(reply.getSubject())
                .message(reply.getMessage())
                .createdAt(reply.getCreatedAt())
                .build();
    }
}
