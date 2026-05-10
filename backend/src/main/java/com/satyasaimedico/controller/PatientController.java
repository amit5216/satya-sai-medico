package com.satyasaimedico.controller;

import com.satyasaimedico.model.Patient;
import com.satyasaimedico.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================================
 * PATIENT REST CONTROLLER — Admin endpoints for patient data
 * ============================================================
 *
 * 🎓 NOTE: Patients are NOT created through this controller.
 * They are auto-created during appointment booking.
 * This controller provides READ-ONLY access for the admin panel.
 *
 * All endpoints require ADMIN role (protected by SecurityConfig).
 */
@RestController
@RequestMapping("/api/admin/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    /**
     * GET /api/admin/patients → List all patients
     *
     * Status Codes:
     *   200 OK → Returns list of patients
     *   401 Unauthorized → JWT token missing or invalid
     */
    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    /**
     * GET /api/admin/patients/{id} → Get patient by ID
     *
     * Status Codes:
     *   200 OK → Patient found
     *   404 Not Found → Patient doesn't exist
     *   401 Unauthorized → JWT token missing or invalid
     */
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    /**
     * GET /api/admin/patients/mobile/{mobile} → Get patient by mobile
     */
    @GetMapping("/mobile/{mobile}")
    public ResponseEntity<Patient> getPatientByMobile(@PathVariable String mobile) {
        return ResponseEntity.ok(patientService.getPatientByMobile(mobile));
    }
}
