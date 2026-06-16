package nl.zorgwerkwijzer.config;

import lombok.RequiredArgsConstructor;
import nl.zorgwerkwijzer.security.JwtAccessDeniedHandler;
import nl.zorgwerkwijzer.security.JwtAuthenticationEntryPoint;
import nl.zorgwerkwijzer.security.JwtAuthenticationFilter;
import nl.zorgwerkwijzer.security.RateLimitingFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.StaticHeadersWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CorsProperties corsProperties;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final UserDetailsService userDetailsService;
    private final RateLimitingFilter rateLimitingFilter;

    // C2: BCrypt with cost factor 12 for stronger password hashing
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .accessDeniedHandler(jwtAccessDeniedHandler))
            .authenticationProvider(authenticationProvider())
            .authorizeHttpRequests(auth -> auth
                // Public auth endpoints
                .requestMatchers("/api/v1/auth/**").permitAll()
                // Public read endpoints
                .requestMatchers(HttpMethod.GET, "/api/v1/vacancies/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/employers/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/news/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/cities/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/regions/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/occupations/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/health").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/contact").permitAll()
                // Public profile creation (registration flow)
                .requestMatchers(HttpMethod.POST, "/api/v1/profiles").permitAll()
                // Static file uploads — public (CV downloads, etc.)
                .requestMatchers("/uploads/**").permitAll()
                // Swagger/OpenAPI — public
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                // Stripe webhook — geen JWT auth, eigen signature verificatie in controller
                .requestMatchers(HttpMethod.POST, "/api/v1/stripe/webhook").permitAll()
                // Calculator endpoints — publiek (geen auth vereist voor berekeningen)
                .requestMatchers(HttpMethod.POST, "/api/v1/salary/calculate").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/salary/calculate-end-of-year").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/ort/calculate").permitAll()
                // Subscription packages — publiek voor /prijzen pagina
                .requestMatchers(HttpMethod.GET, "/api/v1/subscriptions/packages").permitAll()
                // Overige subscription endpoints — ROLE_EMPLOYER via @PreAuthorize
                .requestMatchers("/api/v1/subscriptions/**").authenticated()
                // Employer dashboard endpoints (method-level security via @PreAuthorize)
                .requestMatchers("/api/v1/employer-dashboard/**").authenticated()
                // Payment endpoints — vacancy credits (method-level security via @PreAuthorize)
                .requestMatchers("/api/v1/payments/**").authenticated()
                // Admin-only endpoints
                .requestMatchers(HttpMethod.POST, "/api/v1/vacancies").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/vacancies/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/vacancies/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/v1/employers").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/employers/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/v1/news").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/news/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/news/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                // All other endpoints require authentication
                .anyRequest().authenticated()
            )
            .headers(headers -> headers
                .frameOptions(frame -> frame.deny())
                .xssProtection(xss -> xss.disable())
                .contentTypeOptions(ct -> {}) // X-Content-Type-Options: nosniff
                .contentSecurityPolicy(csp ->
                    csp.policyDirectives(
                        "default-src 'self'; " +
                        "script-src 'self'; " +
                        "style-src 'self' 'unsafe-inline'; " +
                        "img-src 'self' data: https:; " +
                        "font-src 'self'; " +
                        "connect-src 'self'; " +
                        "frame-ancestors 'none'; " +
                        "base-uri 'self'; " +
                        "form-action 'self';"
                    ))
                .httpStrictTransportSecurity(hsts -> hsts
                    .includeSubDomains(true)
                    .maxAgeInSeconds(31536000))
                .addHeaderWriter((request, response) -> {
                    response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
                    response.setHeader("Permissions-Policy",
                "camera=(), microphone=(), geolocation=()");
                    response.setHeader("X-Permitted-Cross-Domain-Policies", "none");
                })
            )
            .addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // C2: CORS — explicit allowed origins only, no wildcard
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Use explicit origins from CorsProperties — wildcard is rejected at startup
        configuration.setAllowedOrigins(corsProperties.getAllowedOrigins());
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of(
                "Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"
        ));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(corsProperties.isAllowCredentials());
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
