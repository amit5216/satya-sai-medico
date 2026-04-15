package com.satyasaimedico.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * ============================================================
 * JWT TOKEN PROVIDER — Creates and validates JWT tokens
 * ============================================================
 *
 * 🎓 WHAT THIS CLASS DOES:
 * 1. generateToken()  → Creates a new JWT token after successful login
 * 2. getUsernameFromToken() → Extracts the username from a JWT token
 * 3. validateToken()  → Checks if a token is valid (not expired, not tampered)
 *
 * 🎓 HOW JWT WORKS INTERNALLY:
 * A JWT token has 3 parts separated by dots:
 *   HEADER.PAYLOAD.SIGNATURE
 *
 *   HEADER:    {"alg": "HS512", "typ": "JWT"}
 *   PAYLOAD:   {"sub": "admin", "role": "ADMIN", "iat": 1711931200, "exp": 1712017600}
 *   SIGNATURE: HMAC-SHA512(header + "." + payload, SECRET_KEY)
 *
 * The SIGNATURE ensures the token hasn't been tampered with.
 * If anyone modifies the payload, the signature won't match → token rejected.
 *
 * 🎓 INTERVIEW: "Why is the secret key important?"
 * → The secret key is the ONLY thing preventing token forgery.
 *   If someone gets your secret key, they can create valid tokens
 *   for any user. That's why we NEVER commit it to Git.
 */
@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long expiration;

    /**
     * Constructor reads values from application.properties:
     *   app.jwt.secret = SatyaSaiMedico2026SecureJWTSecretKey...
     *   app.jwt.expiration = 86400000 (24 hours in milliseconds)
     *
     * 🎓 @Value("${property.name}"):
     * Spring injects the value from application.properties.
     * This is called EXTERNALIZED CONFIGURATION — config values
     * are outside the code, making them easy to change per environment.
     */
    public JwtTokenProvider(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration}") long expiration) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
    }

    /**
     * Generate a JWT token for the authenticated user.
     *
     * @param username The admin's username (becomes the "subject" claim)
     * @param role     The user's role ("ADMIN")
     * @return JWT token string like "eyJhbGciOiJIUzUxMiJ9..."
     *
     * 🎓 Claims explained:
     *   subject (sub) → WHO the token is for (username)
     *   role          → Custom claim for RBAC
     *   issuedAt (iat)→ WHEN the token was created
     *   expiration    → WHEN the token expires (iat + 24 hours)
     */
    public String generateToken(String username, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(username)              // Payload: "sub": "admin"
                .claim("role", role)             // Payload: "role": "ADMIN"
                .issuedAt(now)                   // Payload: "iat": 1711931200
                .expiration(expiryDate)          // Payload: "exp": 1712017600
                .signWith(key)                   // Sign with HMAC-SHA512
                .compact();                      // Build the token string
    }

    /**
     * Extract the username from a JWT token.
     *
     * 🎓 HOW:
     * 1. Parse the token using the secret key
     * 2. Verify the signature (tamper detection)
     * 3. Extract the "subject" claim (username)
     *
     * If the token is invalid or expired, this throws an exception.
     */
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .verifyWith(key)                 // Verify signature
                .build()
                .parseSignedClaims(token)        // Parse and validate
                .getPayload()
                .getSubject();                   // Get "sub" claim
    }

    /**
     * Extract the role from a JWT token.
     */
    public String getRoleFromToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
    }

    /**
     * Validate a JWT token.
     *
     * 🎓 WHAT CAN GO WRONG:
     * 1. ExpiredJwtException      → Token has passed its expiration date
     * 2. MalformedJwtException    → Token format is corrupted
     * 3. UnsupportedJwtException  → Token uses an unsupported algorithm
     * 4. SignatureException        → Token signature doesn't match
     * 5. IllegalArgumentException  → Token string is null/empty
     *
     * All of these mean: REJECT THE REQUEST (return 401).
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException ex) {
            // Token has expired — user needs to login again
            System.err.println("JWT expired: " + ex.getMessage());
        } catch (MalformedJwtException ex) {
            // Token is not properly formatted
            System.err.println("Invalid JWT: " + ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            System.err.println("Unsupported JWT: " + ex.getMessage());
        } catch (SecurityException ex) {
            // Signature validation failed — possible tampering
            System.err.println("Invalid JWT signature: " + ex.getMessage());
        } catch (IllegalArgumentException ex) {
            System.err.println("JWT claims string is empty: " + ex.getMessage());
        }
        return false;
    }
}
