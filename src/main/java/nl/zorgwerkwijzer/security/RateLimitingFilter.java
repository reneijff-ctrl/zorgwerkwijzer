package nl.zorgwerkwijzer.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Rate limiting filter using Bucket4j (token-bucket algorithm) with Caffeine in-memory cache.
 *
 * Limits per IP address:
 *   POST /api/v1/auth/login          → 5 requests per minute
 *   POST /api/v1/auth/register       → 3 requests per hour
 *   POST /api/v1/auth/register-employer → 3 requests per hour
 *   POST /api/v1/auth/forgot-password → 3 requests per hour
 */
@Component
@Slf4j
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final String LOGIN_PATH            = "/api/v1/auth/login";
    private static final String REGISTER_PATH         = "/api/v1/auth/register";
    private static final String REGISTER_EMPLOYER_PATH = "/api/v1/auth/register-employer";
    private static final String FORGOT_PASSWORD_PATH  = "/api/v1/auth/forgot-password";

    // Cache keyed by "<endpoint-key>:<ip>" — entries expire after 2 hours (covers the longest window)
    private final Cache<String, Bucket> bucketCache = Caffeine.newBuilder()
            .expireAfterAccess(2, TimeUnit.HOURS)
            .maximumSize(50_000)
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        String path = request.getRequestURI();
        return !path.equals(LOGIN_PATH)
                && !path.equals(REGISTER_PATH)
                && !path.equals(REGISTER_EMPLOYER_PATH)
                && !path.equals(FORGOT_PASSWORD_PATH);
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        String ip   = extractClientIp(request);
        String path = request.getRequestURI();
        String key  = resolveKey(path, ip);

        Bucket bucket = bucketCache.get(key, k -> createBucket(path));

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            log.warn("Rate limit exceeded for IP={} path={}", ip, path);
            sendTooManyRequestsResponse(response);
        }
    }

    // --- helpers ---

    private String resolveKey(String path, String ip) {
        String endpointKey = switch (path) {
            case LOGIN_PATH             -> "login";
            case REGISTER_PATH          -> "register";
            case REGISTER_EMPLOYER_PATH -> "register-employer";
            case FORGOT_PASSWORD_PATH   -> "forgot-password";
            default                     -> path;
        };
        return endpointKey + ":" + ip;
    }

    private Bucket createBucket(String path) {
        Bandwidth limit = switch (path) {
            case LOGIN_PATH ->
                // 5 requests per minute
                Bandwidth.builder()
                        .capacity(5)
                        .refillGreedy(5, Duration.ofMinutes(1))
                        .build();
            default ->
                // 3 requests per hour (register, register-employer, forgot-password)
                Bandwidth.builder()
                        .capacity(3)
                        .refillGreedy(3, Duration.ofHours(1))
                        .build();
        };
        return Bucket.builder().addLimit(limit).build();
    }

    private String extractClientIp(HttpServletRequest request) {
        // Support common reverse-proxy headers
        String ip = request.getHeader("X-Forwarded-For");
        if (ip != null && !ip.isBlank()) {
            // X-Forwarded-For can be "client, proxy1, proxy2" — take the first
            return ip.split(",")[0].trim();
        }
        ip = request.getHeader("X-Real-IP");
        if (ip != null && !ip.isBlank()) {
            return ip.trim();
        }
        return request.getRemoteAddr();
    }

    private void sendTooManyRequestsResponse(HttpServletResponse response) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        Map<String, String> body = Map.of(
                "error",   "Too many requests",
                "message", "Please try again later"
        );
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
