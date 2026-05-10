package com.satyasaimedico.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * ============================================================
 * GLOBAL EXCEPTION HANDLER
 * ============================================================
 *
 * 🎓 WHAT IS @RestControllerAdvice?
 * It's a special Spring class that INTERCEPTS exceptions thrown
 * by ANY controller in the application. Instead of each controller
 * handling its own errors, we centralize ALL error handling here.
 *
 * 🎓 HOW IT WORKS:
 * 1. Controller throws an exception (e.g., ResourceNotFoundException)
 * 2. Spring catches it and looks for a matching @ExceptionHandler
 * 3. The handler method creates a proper error response
 * 4. Spring returns the error response as JSON to the client
 *
 * 🎓 WHY CENTRALIZE?
 * - DRY principle: write error handling logic ONCE
 * - Consistency: all errors have the same JSON format
 * - Clean controllers: controllers only handle happy paths
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles 404 - Resource Not Found
     * Triggered when: throw new ResourceNotFoundException("...")
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * Handles 409 - Duplicate Resource
     * Triggered when: throw new DuplicateResourceException("...")
     */
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResource(DuplicateResourceException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.CONFLICT.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    /**
     * Handles 400 - Validation Errors
     *
     * 🎓 WHEN DOES THIS TRIGGER?
     * When a DTO has @NotBlank, @Size, etc. and the input fails validation.
     * Spring throws MethodArgumentNotValidException automatically.
     *
     * We extract EACH field error and return them as a map:
     * { "name": "Name is required", "mobile": "Mobile must be 10 digits" }
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    /**
     * Handles 401 - Authentication Failure
     * Triggered when: login with wrong credentials
     */
    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(
            org.springframework.security.authentication.BadCredentialsException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.UNAUTHORIZED.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    /**
     * Handles 403 - Access Denied
     * Triggered when: authenticated user tries to access a resource
     * they don't have permission for (e.g., patient accessing admin endpoints)
     */
    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(
            org.springframework.security.access.AccessDeniedException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.FORBIDDEN.value(),
            "Access denied. You don't have permission to access this resource.",
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    /**
     * Handles 500 - Catch-all for unexpected errors
     * This is the LAST LINE OF DEFENSE. If any unhandled exception
     * reaches here, we return a generic error response.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "An unexpected error occurred. Please try again later.",
            LocalDateTime.now()
        );
        // Log the actual error for debugging (visible in server console only)
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
