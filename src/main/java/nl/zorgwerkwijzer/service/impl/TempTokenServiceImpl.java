package nl.zorgwerkwijzer.service.impl;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.extern.slf4j.Slf4j;
import nl.zorgwerkwijzer.service.TempTokenService;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

/**
 * In-memory temp token store backed by Caffeine.
 * Tokens expire automatically after 5 minutes and are single-use.
 */
@Slf4j
@Service
public class TempTokenServiceImpl implements TempTokenService {

    private static final int TOKEN_BYTES   = 32;
    private static final int TTL_MINUTES   = 5;

    private final SecureRandom secureRandom = new SecureRandom();

    // token → userId
    private final Cache<String, Long> tokenCache = Caffeine.newBuilder()
            .expireAfterWrite(TTL_MINUTES, TimeUnit.MINUTES)
            .maximumSize(1_000)
            .build();

    @Override
    public String generateTempToken(Long userId) {
        byte[] bytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        tokenCache.put(token, userId);
        log.debug("[2FA] Temp token aangemaakt voor userId={}", userId);
        return token;
    }

    @Override
    public Long validateTempToken(String token) {
        Long userId = tokenCache.getIfPresent(token);
        if (userId == null) {
            throw new IllegalArgumentException("Ongeldig of verlopen 2FA-token.");
        }
        return userId;
    }

    @Override
    public void invalidateTempToken(String token) {
        tokenCache.invalidate(token);
    }
}
