package nl.zorgwerkwijzer.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class VacancyCreditStatusDto {
    private Integer availableCredits;
    private List<CreditTransactionDto> recentTransactions;
}
