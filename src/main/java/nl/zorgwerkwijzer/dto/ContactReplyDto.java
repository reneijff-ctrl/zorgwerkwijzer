package nl.zorgwerkwijzer.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ContactReplyDto {
    private Long id;
    private String adminEmail;
    private String subject;
    private String message;
    private LocalDateTime createdAt;
}
