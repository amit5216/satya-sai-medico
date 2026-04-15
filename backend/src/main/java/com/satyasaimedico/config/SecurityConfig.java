package com.satyasaimedico.config;

import com.satyasaimedico.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * ============================================================
 * SECURITY CONFIGURATION (PRODUCTION-READY)
 * ============================================================
 *
 * 🎓 HOW SPRING SECURITY WORKS:
 * Every HTTP request goes through a "Security Filter Chain":
 *
 *   Request → CORS → JWT Filter → Auth Check → Controller
 *
 * This class configures:
 * 1. Which URLs are PUBLIC (anyone can access)
 * 2. Which URLs need AUTHENTICATION (valid JWT required)
 * 3. Which URLs need specific ROLES (e.g., only ADMIN)
 * 4. Where our custom JWT filter sits in the chain
 *
 * 🎓 INTERVIEW: "Explain your Spring Security configuration"
 * → "We use a stateless, JWT-based security configuration.
 *    CSRF is disabled because we're a REST API using tokens, not cookies.
 *    Public endpoints like /api/doctors are open to everyone.
 *    Admin endpoints like /api/admin/** require a valid JWT token
 *    with the ADMIN role. Our custom JwtAuthenticationFilter runs
 *    before Spring's default filter to extract and validate tokens."
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    /**
     * SecurityFilterChain — the heart of Spring Security.
     *
     * 🎓 Rule Order MATTERS:
     * Spring Security evaluates rules TOP to BOTTOM.
     * More specific rules must come BEFORE general rules.
     *
     *   ✅ /api/auth/** → permitAll (FIRST — specific)
     *   ✅ /api/admin/** → authenticated (SECOND — specific)
     *   ✅ /api/** → permitAll (LAST — catch-all)
     *
     *   ❌ /api/** → permitAll (FIRST — everything matches this!)
     *   ❌ /api/admin/** → authenticated (UNREACHABLE — already matched above)
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // ── CORS: Use our CorsConfig bean ──
            .cors(cors -> cors.configurationSource(corsConfigurationSource))

            // ── CSRF: Disabled for REST APIs ──
            // WHY: CSRF protection is for cookie-based auth.
            // We use JWT tokens in headers, so CSRF is not needed.
            // Keeping CSRF enabled would block our POST/PUT/DELETE requests.
            .csrf(csrf -> csrf.disable())

            // ── URL Authorization Rules ──
            .authorizeHttpRequests(auth -> auth
                // ── PUBLIC: Authentication endpoints ──
                .requestMatchers("/api/auth/**").permitAll()

                // ── PUBLIC: Read-only data endpoints ──
                .requestMatchers(HttpMethod.GET, "/api/doctors/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/medicines/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/services/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/schedules/**").permitAll()

                // ── PUBLIC: Appointment booking (patients don't need login) ──
                .requestMatchers(HttpMethod.POST, "/api/appointments").permitAll()

                // ── PROTECTED: All admin endpoints require ADMIN role ──
                // hasRole("ADMIN") checks for authority "ROLE_ADMIN"
                // (Spring Security auto-prefixes "ROLE_" to hasRole checks)
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // ── DEFAULT: Any other request must be authenticated ──
                .anyRequest().authenticated()
            )

            // ── Session Management: STATELESS ──
            // WHY: REST APIs should NOT use server-side sessions.
            // Each request carries its own authentication (JWT token).
            // This means:
            //   - No JSESSIONID cookie
            //   - No session storage on server
            //   - Better scalability (no session replication between servers)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // ── Add our JWT filter BEFORE Spring's default auth filter ──
            // This ensures JWT is processed first, before any other auth mechanism
            .addFilterBefore(jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Password encoder for hashing passwords.
     *
     * 🎓 BCrypt internals:
     * 1. Generates a random SALT (16 bytes)
     * 2. Combines salt + password
     * 3. Runs through Blowfish cipher 2^10 times (cost factor 10)
     * 4. Produces: $2a$10$SALT_22_CHARS.HASH_31_CHARS
     *
     * Each hash is UNIQUE even for the same password (different salt each time).
     * This defeats rainbow table attacks.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
