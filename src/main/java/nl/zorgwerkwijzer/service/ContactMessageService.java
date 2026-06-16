package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.ContactMessageDto;
import nl.zorgwerkwijzer.dto.ContactMessageStatsDto;
import nl.zorgwerkwijzer.dto.ContactReplyDto;
import nl.zorgwerkwijzer.dto.ContactReplyRequest;
import nl.zorgwerkwijzer.model.ContactMessage;
import nl.zorgwerkwijzer.model.ContactMessageStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;

public interface ContactMessageService {

    ContactMessage save(String name, String email, String message);

    Page<ContactMessageDto> findAll(Pageable pageable);

    ContactMessageDto findById(Long id);

    ContactMessageDto updateStatus(Long id, ContactMessageStatus status);

    ContactMessageStatsDto getStats();

    ContactReplyDto addReply(Long messageId, ContactReplyRequest request, Long adminUserId, String adminEmail);

    java.util.List<ContactMessageDto> getRecent();

    Page<ContactMessageDto> search(String q, ContactMessageStatus status, LocalDateTime from, Pageable pageable);
}
