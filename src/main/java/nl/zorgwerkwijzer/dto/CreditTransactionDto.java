package nl.zorgwerkwijzer.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class CreditTransactionDto {
    private Long id;
    private Integer creditsAdded;
    private Integer creditsUsed;
    private String reason;
    private String bundleType;
    private LocalDateTime createdAt;
}
