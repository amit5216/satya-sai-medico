package com.satyasaimedico.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO for login response — returned after successful authentication.
 * 
 * Contains the JWT token and user info that the frontend needs to:
 * 1. Store the token (localStorage)
 * 2. Display the username in the admin panel
 * 3. Know the user's role for conditional UI rendering
 */
@Data
@AllArgsConstructor
public class LoginResponse {

    /** JWT token string — frontend sends this in Authorization header */
    private String token;

    /** Token type — always "Bearer" (OAuth2 standard) */
    private String type;

    /** The authenticated admin's username */
    private String username;

    /** The admin's role (e.g., "ADMIN") */
    private String role;

    /**
     * Convenience constructor — type will always be "Bearer"
     */
    public LoginResponse(String token, String username, String role) {
        this.token = token;
        this.type = "Bearer";
        this.username = username;
        this.role = role;
    }
}
