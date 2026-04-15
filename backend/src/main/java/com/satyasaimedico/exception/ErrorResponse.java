package com.satyasaimedico.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * ============================================================
 * STANDARD ERROR RESPONSE
 * ============================================================
 *
 * 🎓 WHY A CUSTOM ERROR RESPONSE?
 * Without this, Spring returns ugly default error JSON like:
 *   { "timestamp": "...", "status": 500, "error": "Internal Server Error" }
 *
 * Our custom response gives the frontend a CONSISTENT format:
 *   {
 *     "status": 404,
 *     "message": "Doctor not found with id: 5",
 *     "timestamp": "2026-03-17T10:30:00"
 *   }
 *
 * This makes it easy for the frontend to show proper error messages.
 */
@Data
@AllArgsConstructor
public class ErrorResponse {
    private int status;
    private String message;
    private LocalDateTime timestamp;
}
