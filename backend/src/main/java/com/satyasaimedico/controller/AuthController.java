package com.satyasaimedico.controller;

import com.satyasaimedico.dto.LoginRequest;
import com.satyasaimedico.dto.LoginResponse;
import com.satyasaimedico.security.JwtTokenProvider;
import com.satyasaimedico.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * ============================================================
 * AUTH CONTROLLER — Authentication REST API
 * ============================================================
 *
 * 🎓 ENDPOINTS:
 *   POST /api/auth/login    → Admin login (returns JWT token)
 *   POST /api/auth/register → Create admin (dev/setup only)
 *   GET  /api/auth/me       → Get current user info from JWT
 *
 * 🎓 REQUEST/RESPONSE EXAMPLES:
 *
 * --- LOGIN ---
 * POST /api/auth/login
 * Request:
 *   {
 *     "username": "admin",
 *     "password": "admin123"
 *   }
 * 
 * Success Response (200 OK):
 *   {
 *     "token": "eyJhbGciOiJIUzUxMiJ9...",
 *     "type": "Bearer",
 *     "username": "admin",
 *     "role": "ADMIN"
 *   }
 * 
 * Error Response (401 Unauthorized):
 *   {
 *     "status": 401,
 *     "message": "Invalid username or password",
 *     "timestamp": "2026-04-09T01:00:00"
 *   }
 *
 * --- REGISTER ---
 * POST /api/auth/register
 * Request:
 *   {
 *     "username": "newadmin",
 *     "password": "secure123"
 *   }
 * 
 * Success Response (201 Created):
 *   {
 *     "token": "eyJhbGciOiJIUzUxMiJ9...",
 *     "type": "Bearer",
 *     "username": "newadmin",
 *     "role": "ADMIN"
 *   }
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * POST /api/auth/login → Admin login
     *
     * Status Codes:
     *   200 OK              → Login successful, token returned
     *   400 Bad Request     → Validation failed (empty username/password)
     *   401 Unauthorized    → Wrong credentials
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/register → Create a new admin
     *
     * Status Codes:
     *   201 Created         → Admin created successfully
     *   400 Bad Request     → Validation failed
     *   409 Conflict        → Username already exists
     */
    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(
            @Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/auth/me → Get current authenticated admin's info
     *
     * This endpoint requires a valid JWT token.
     * The frontend calls this on page load to verify the token is still valid.
     *
     * Status Codes:
     *   200 OK              → Token valid, user info returned
     *   401 Unauthorized    → Token missing or invalid
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> getCurrentUser(
            @RequestHeader("Authorization") String authHeader) {
        // The JwtAuthenticationFilter already validated the token.
        // If we reach here, the user is authenticated.
        // We can extract info from SecurityContext, but for simplicity,
        // we decode the token directly.
        String token = authHeader.substring(7); // Remove "Bearer "
        
        String username = jwtTokenProvider.getUsernameFromToken(token);
        String role = jwtTokenProvider.getRoleFromToken(token);

        return ResponseEntity.ok(Map.of(
                "username", username,
                "role", role
        ));
    }
}
