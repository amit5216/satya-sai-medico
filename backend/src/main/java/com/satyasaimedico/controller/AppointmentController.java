package com.satyasaimedico.controller;

import com.satyasaimedico.dto.AppointmentDTO;
import com.satyasaimedico.model.Appointment;
import com.satyasaimedico.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // ==================== PUBLIC ENDPOINTS ====================

    /**
     * POST /api/appointments → Book an appointment
     * This is a public endpoint (patients don't need to login).
     */
    @PostMapping("/appointments")
    public ResponseEntity<Appointment> bookAppointment(
            @Valid @RequestBody AppointmentDTO dto) {
        Appointment appointment = appointmentService.bookAppointment(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(appointment);
    }

    // ==================== ADMIN ENDPOINTS ====================

    /**
     * GET /api/admin/appointments → List all appointments
     */
    @GetMapping("/admin/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    /**
     * GET /api/admin/appointments/today → Today's appointments
     */
    @GetMapping("/admin/appointments/today")
    public ResponseEntity<List<Appointment>> getTodaysAppointments() {
        return ResponseEntity.ok(appointmentService.getTodaysAppointments());
    }

    /**
     * GET /api/admin/appointments/status/{status} → Filter by status
     */
    @GetMapping("/admin/appointments/status/{status}")
    public ResponseEntity<List<Appointment>> getAppointmentsByStatus(
            @PathVariable String status) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByStatus(status));
    }

    /**
     * PUT /api/admin/appointments/{id}/status → Update appointment status
     * Body: { "status": "CONFIRMED" }
     */
    @PutMapping("/admin/appointments/{id}/status")
    public ResponseEntity<Appointment> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(
            appointmentService.updateAppointmentStatus(id, status));
    }

    /**
     * GET /api/admin/appointments/stats → Dashboard statistics
     */
    @GetMapping("/admin/appointments/stats")
    public ResponseEntity<AppointmentService.AppointmentStats> getStats() {
        return ResponseEntity.ok(appointmentService.getStats());
    }
}
