package com.satyasaimedico.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for admin login request.
 * 
 * 🎓 WHY A SEPARATE DTO (not just Map<String, String>)?
 * 1. Type safety — compiler catches wrong field names
 * 2. Validation — @NotBlank ensures fields are present
 * 3. Documentation — clear contract for API consumers
 * 4. Swagger/OpenAPI — generates accurate API docs
 */
@Data
public class LoginRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}
