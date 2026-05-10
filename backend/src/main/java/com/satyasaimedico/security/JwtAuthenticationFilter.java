package com.satyasaimedico.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * ============================================================
 * JWT AUTHENTICATION FILTER
 * ============================================================
 *
 * 🎓 WHAT IS A FILTER?
 * In Spring Security, EVERY HTTP request passes through a chain of filters
 * before reaching your controller. Each filter can:
 *   - Inspect the request
 *   - Modify the request
 *   - Block the request (return 401/403)
 *   - Pass it to the next filter
 *
 * 🎓 WHERE THIS FILTER SITS:
 *
 *   HTTP Request
 *       │
 *       ▼
 *   CorsFilter (handles CORS headers)
 *       │
 *       ▼
 *   ★ JwtAuthenticationFilter (THIS CLASS)  ← Extracts JWT, sets auth
 *       │
 *       ▼
 *   UsernamePasswordAuthenticationFilter (default Spring filter)
 *       │
 *       ▼
 *   AuthorizationFilter (checks roles/permissions)
 *       │
 *       ▼
 *   Your Controller (@RestController)
 *
 * 🎓 OncePerRequestFilter:
 * Guarantees this filter runs EXACTLY ONCE per request.
 * Normal filters might run multiple times if the request is forwarded internally.
 *
 * 🎓 INTERVIEW: "Explain the JWT authentication flow"
 * → "Every request passes through our JwtAuthenticationFilter.
 *    The filter extracts the Bearer token from the Authorization header,
 *    validates it using JwtTokenProvider, loads the user details from the
 *    database, and sets the authentication in SecurityContext.
 *    If the token is missing or invalid, the request proceeds unauthenticated,
 *    and Spring Security's authorization rules decide whether to allow or deny."
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;

    /**
     * Core filter logic — runs for EVERY HTTP request.
     *
     * FLOW:
     * 1. Extract JWT token from "Authorization: Bearer xxx" header
     * 2. If token exists and is valid:
     *    a. Extract username from token
     *    b. Load UserDetails from database
     *    c. Create authentication object
     *    d. Set it in SecurityContext (marks request as authenticated)
     * 3. Pass request to the next filter in chain
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        try {
            // Step 1: Extract JWT token from the Authorization header
            String token = extractTokenFromRequest(request);

            // Step 2: Validate and authenticate
            if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {

                // Step 2a: Extract username from JWT payload
                String username = jwtTokenProvider.getUsernameFromToken(token);

                // Step 2b: Load user details from database
                // WHY load from DB? To ensure the user still exists and hasn't been deleted
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // Step 2c: Create Spring Security authentication token
                // This tells Spring Security: "This user is authenticated with these roles"
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,        // Principal (the user)
                                null,               // Credentials (not needed — already authenticated via JWT)
                                userDetails.getAuthorities()  // Roles: [ROLE_ADMIN]
                        );

                // Attach request details (IP address, session ID) for audit
                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));

                // Step 2d: Set authentication in SecurityContext
                // This is THE KEY LINE — makes the current request "authenticated"
                // All subsequent filters and controllers can now access the logged-in user
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            // If anything goes wrong, DON'T block the request.
            // Let it proceed unauthenticated — Spring Security's
            // authorization rules will handle the 401/403.
            System.err.println("Could not set user authentication: " + ex.getMessage());
        }

        // ALWAYS pass the request to the next filter
        // Even if authentication fails — let Spring Security decide what to do
        filterChain.doFilter(request, response);
    }

    /**
     * Extract the JWT token from the Authorization header.
     *
     * Expected format: "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..."
     * We strip the "Bearer " prefix and return just the token.
     *
     * 🎓 WHY "Bearer"?
     * "Bearer" is the OAuth 2.0 standard prefix for token-based auth.
     * It tells the server: "I'm BEARING (carrying) a token for auth."
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);  // Remove "Bearer " (7 chars)
        }
        return null;
    }
}
