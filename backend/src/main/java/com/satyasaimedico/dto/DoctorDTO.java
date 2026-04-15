package com.satyasaimedico.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * ============================================================
 * DOCTOR DTO — Data Transfer Object for Doctor CRUD
 * ============================================================
 *
 * 🎓 WHAT IS A DTO?
 * A DTO is a separate class used for receiving input from the client.
 *
 * 🎓 WHY NOT USE THE ENTITY DIRECTLY?
 * 1. SECURITY: Entities have fields like `id`, `active` that the client
 *    shouldn't be able to set. DTO controls exactly which fields are accepted.
 * 2. VALIDATION: We put @NotBlank, @Size annotations on DTOs, keeping
 *    entities clean (entities = database mapping, DTOs = input validation).
 * 3. DECOUPLING: If the database schema changes, the API contract doesn't break.
 *
 * 🎓 HOW VALIDATION WORKS:
 * 1. Client sends JSON → Spring maps it to this DTO
 * 2. @Valid annotation on controller parameter triggers validation
 * 3. If validation fails → Spring throws MethodArgumentNotValidException
 * 4. Our GlobalExceptionHandler catches it and returns field-level errors
 */
@Data
public class DoctorDTO {

    @NotBlank(message = "Doctor name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Specialization is required")
    @Size(max = 100, message = "Specialization must not exceed 100 characters")
    private String specialization;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be a 10-digit number")
    private String phone;

    @Email(message = "Invalid email format")
    private String email;

    private String imageUrl;

    @Size(max = 2000, message = "Bio must not exceed 2000 characters")
    private String bio;
}
