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

    
    @PostMapping("/appointments")
    public ResponseEntity<Appointment> bookAppointment(
            @Valid @RequestBody AppointmentDTO dto) {
        Appointment appointment = appointmentService.bookAppointment(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(appointment);
    }

    
    @GetMapping("/admin/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

   
    @GetMapping("/admin/appointments/today")
    public ResponseEntity<List<Appointment>> getTodaysAppointments() {
        return ResponseEntity.ok(appointmentService.getTodaysAppointments());
    }

    
    @GetMapping("/admin/appointments/status/{status}")
    public ResponseEntity<List<Appointment>> getAppointmentsByStatus(
            @PathVariable String status) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByStatus(status));
    }


    @PutMapping("/admin/appointments/{id}/status")
    public ResponseEntity<Appointment> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(
            appointmentService.updateAppointmentStatus(id, status));
    }

   
    @GetMapping("/admin/appointments/stats")
    public ResponseEntity<AppointmentService.AppointmentStats> getStats() {
        return ResponseEntity.ok(appointmentService.getStats());
    }
}
