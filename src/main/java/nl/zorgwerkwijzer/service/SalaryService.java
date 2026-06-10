package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.EndOfYearCalculationRequestDto;
import nl.zorgwerkwijzer.dto.EndOfYearCalculationResponseDto;
import nl.zorgwerkwijzer.dto.SalaryCalculationRequestDto;
import nl.zorgwerkwijzer.dto.SalaryCalculationResponseDto;

public interface SalaryService {
    SalaryCalculationResponseDto calculateSalary(SalaryCalculationRequestDto request);
    EndOfYearCalculationResponseDto calculateEndOfYearBonus(EndOfYearCalculationRequestDto request);
}
