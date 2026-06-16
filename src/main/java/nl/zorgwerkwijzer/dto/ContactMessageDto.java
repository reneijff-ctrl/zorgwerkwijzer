package nl.zorgwerkwijzer.dto;

import nl.zorgwerkwijzer.model.ContactMessageStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ContactMessageDto {
    private Long id;
    private String name;
    private String email;
    private String message;
    private ContactMessageStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ContactReplyDto> replies;
}
