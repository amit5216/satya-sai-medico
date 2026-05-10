package com.satyasaimedico.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * ============================================================
 * CORS CONFIGURATION (Cross-Origin Resource Sharing)
 * ============================================================
 *
 * WHAT IS CORS?
 * When your React frontend (http://localhost:5173) tries to call
 * your Spring Boot backend (http://localhost:8080), the browser
 * BLOCKS the request because they are on different "origins"
 * (different ports = different origins).
 *
 * WHY CORS?
 * CORS tells the browser: "It's OK, allow requests from this
 * frontend origin." Without this, ALL API calls from React would fail.
 *
 * HOW IT WORKS:
 * 1. Browser sends a "preflight" OPTIONS request first
 * 2. Server responds with allowed origins, methods, headers
 * 3. If allowed, browser sends the actual request
 * 4. If not allowed, browser blocks the request (CORS error)
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Which origins (frontend URLs) are allowed to call our API
        configuration.setAllowedOrigins(List.of(
            "http://localhost:5173",     // Vite dev server
            "http://localhost:3000"      // Alternative React port
        ));

        // Which HTTP methods are allowed
        configuration.setAllowedMethods(List.of(
            "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        // Which request headers are allowed
        configuration.setAllowedHeaders(List.of("*"));

        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);

        // Apply CORS config to all API endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
