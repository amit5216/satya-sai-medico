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


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    
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
                // ── PUBLIC: Static uploaded files (doctor photos, etc.) ──
                .requestMatchers("/uploads/**").permitAll()
                // ── PUBLIC: Authentication endpoints ──
                .requestMatchers("/api/auth/**").permitAll()

                // ── PUBLIC: Read-only data endpoints ──
                .requestMatchers(HttpMethod.GET, "/api/doctors/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/medicines/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/services/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/schedules/**").permitAll()

                // ── PUBLIC: Appointment booking (patients don't need login) ──
                .requestMatchers(HttpMethod.POST, "/api/appointments").permitAll()

                // ── PUBLIC: OTP verification (mobile verification flow) ──
                .requestMatchers("/api/otp/**").permitAll()

                // ── PUBLIC: WhatsApp link generation ──
                .requestMatchers(HttpMethod.GET, "/api/whatsapp/**").permitAll()

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

   
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
