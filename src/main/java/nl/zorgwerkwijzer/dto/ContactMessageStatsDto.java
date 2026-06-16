package nl.zorgwerkwijzer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ContactMessageStatsDto {
    private long total;
    private long newCount;
    private long inProgressCount;
    private long resolvedCount;
}
