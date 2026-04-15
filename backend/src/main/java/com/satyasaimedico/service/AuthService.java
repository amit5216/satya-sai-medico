package com.satyasaimedico.service;

import com.satyasaimedico.dto.LoginRequest;
import com.satyasaimedico.dto.LoginResponse;
import com.satyasaimedico.exception.DuplicateResourceException;
import com.satyasaimedico.model.Admin;
import com.satyasaimedico.repository.AdminRepository;
import com.satyasaimedico.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * ============================================================
 * AUTH SERVICE — Authentication Business Logic
 * ============================================================
 *
 * 🎓 WHAT THIS CLASS DOES:
 * 1. login()    → Validates credentials, returns JWT token
 * 2. register() → Creates a new admin (dev/setup only)
 *
 * 🎓 AUTHENTICATION FLOW:
 *   User sends: POST /api/auth/login { username, password }
 *       ▼
 *   AuthController → AuthService.login(request)
 *       ▼
 *   1. Find admin by username (AdminRepository)
 *   2. Compare password with BCrypt hash (PasswordEncoder)
 *   3. If valid → generate JWT token (JwtTokenProvider)
 *   4. Return LoginResponse { token, username, role }
 *       ▼
 *   Frontend stores token in localStorage
 *
 * 🎓 INTERVIEW: "Why not use AuthenticationManager?"
 * → "For a simple admin-only system, manual authentication is cleaner.
 *    AuthenticationManager adds complexity with multiple providers.
 *    Our approach is explicit: find user, verify password, generate token.
 *    For multi-provider auth (OAuth2 + local), AuthenticationManager is better."
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Authenticate an admin and return a JWT token.
     *
     * @param request Contains username and password
     * @return LoginResponse with JWT token
     * @throws BadCredentialsException if credentials are invalid
     *
     * 🎓 SECURITY BEST PRACTICE:
     * We return the SAME error message for both "user not found" and
     * "wrong password". This prevents ENUMERATION ATTACKS where an
     * attacker probes which usernames exist by checking different errors.
     */
    public LoginResponse login(LoginRequest request) {
        // Step 1: Find admin by username
        Admin admin = adminRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException(
                        "Invalid username or password"));

        // Step 2: Verify password using BCrypt
        // passwordEncoder.matches(rawPassword, encodedPassword)
        // BCrypt internally: hash(rawPassword + salt) == storedHash?
        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        // Step 3: Generate JWT token
        String token = jwtTokenProvider.generateToken(
                admin.getUsername(), admin.getRole());

        // Step 4: Return token + user info
        return new LoginResponse(token, admin.getUsername(), admin.getRole());
    }

    /**
     * Register a new admin (for initial setup/development).
     *
     * In production, this endpoint would be disabled or protected
     * by a super-admin role. For now, it's used to create the first admin.
     *
     * @param request Contains username and password
     * @return LoginResponse with JWT token for immediate login
     */
    public LoginResponse register(LoginRequest request) {
        // Check if username already exists
        if (adminRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException(
                    "Username '" + request.getUsername() + "' is already taken");
        }

        // Create admin with hashed password
        Admin admin = Admin.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("ADMIN")
                .build();

        adminRepository.save(admin);

        // Generate token for immediate login after registration
        String token = jwtTokenProvider.generateToken(
                admin.getUsername(), admin.getRole());

        return new LoginResponse(token, admin.getUsername(), admin.getRole());
    }
}
