package nl.zorgwerkwijzer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContactReplyRequest {
    @NotBlank
    @Size(max = 500)
    private String subject;

    @NotBlank
    private String message;
}
