package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.OrtCalculationRequestDto;
import nl.zorgwerkwijzer.dto.OrtCalculationResponseDto;

public interface OrtService {
    OrtCalculationResponseDto calculateOrt(OrtCalculationRequestDto request);
}
