package nl.zorgwerkwijzer.service.impl;

import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.dto.OrtCalculationRequestDto;
import nl.zorgwerkwijzer.dto.OrtCalculationResponseDto;
import nl.zorgwerkwijzer.service.OrtService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class OrtServiceImpl implements OrtService {

    private static final BigDecimal EVENING_RATE = new BigDecimal("0.22");
    private static final BigDecimal NIGHT_RATE = new BigDecimal("0.44");
    private static final BigDecimal SATURDAY_RATE = new BigDecimal("0.38");
    private static final BigDecimal SUNDAY_RATE = new BigDecimal("0.60");
    private static final BigDecimal HOLIDAY_RATE = new BigDecimal("0.60");

    @Override
    public OrtCalculationResponseDto calculateOrt(OrtCalculationRequestDto request) {
        BigDecimal hourlyWage = request.getHourlyWage();

        BigDecimal eveningAllowance = calculateAllowance(request.getEveningHours(), hourlyWage, EVENING_RATE);
        BigDecimal nightAllowance = calculateAllowance(request.getNightHours(), hourlyWage, NIGHT_RATE);
        BigDecimal saturdayAllowance = calculateAllowance(request.getSaturdayHours(), hourlyWage, SATURDAY_RATE);
        BigDecimal sundayAllowance = calculateAllowance(request.getSundayHours(), hourlyWage, SUNDAY_RATE);
        BigDecimal holidayAllowance = calculateAllowance(request.getHolidayHours(), hourlyWage, HOLIDAY_RATE);

        BigDecimal totalOrt = eveningAllowance
                .add(nightAllowance)
                .add(saturdayAllowance)
                .add(sundayAllowance)
                .add(holidayAllowance);

        return OrtCalculationResponseDto.builder()
                .eveningAllowance(eveningAllowance)
                .nightAllowance(nightAllowance)
                .saturdayAllowance(saturdayAllowance)
                .sundayAllowance(sundayAllowance)
                .holidayAllowance(holidayAllowance)
                .totalOrt(totalOrt)
                .build();
    }

    private BigDecimal calculateAllowance(BigDecimal hours, BigDecimal hourlyWage, BigDecimal rate) {
        if (hours == null) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
        return hours.multiply(hourlyWage).multiply(rate).setScale(2, RoundingMode.HALF_UP);
    }
}
