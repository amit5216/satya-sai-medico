package com.satyasaimedico.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * DTO for booking an appointment.
 * This is what the frontend sends when a patient books an appointment.
 */
@Data
public class AppointmentDTO {

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    @NotBlank(message = "Patient name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String patientName;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile must be a 10-digit number")
    private String patientMobile;

    @NotBlank(message = "Appointment date is required")
    private String appointmentDate; // Format: "2026-03-20"
}
