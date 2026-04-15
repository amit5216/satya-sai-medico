package com.satyasaimedico.controller;

import com.satyasaimedico.dto.DoctorDTO;
import com.satyasaimedico.model.Doctor;
import com.satyasaimedico.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ============================================================
 * DOCTOR REST CONTROLLER
 * ============================================================
 *
 * 🎓 WHAT IS A REST CONTROLLER?
 * It's the ENTRY POINT for HTTP requests. Maps URLs to methods.
 *
 * 🎓 HOW HTTP METHODS MAP TO OPERATIONS:
 *   GET    → Read data     (safe, no side effects)
 *   POST   → Create data   (creates new resource)
 *   PUT    → Update data   (replaces existing resource)
 *   DELETE → Remove data   (removes resource)
 *
 * 🎓 RESPONSE ENTITY:
 * ResponseEntity<T> lets us control:
 *   1. Response BODY (the JSON data)
 *   2. Status CODE (200, 201, 404, etc.)
 *   3. Headers (optional)
 *
 * 🎓 @Valid:
 * When placed before a parameter, it triggers validation on the DTO.
 * If any @NotBlank, @Size, etc. fails → MethodArgumentNotValidException
 * → caught by GlobalExceptionHandler → returns field errors.
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    // ==================== PUBLIC ENDPOINTS ====================

    /**
     * GET /api/doctors → List all active doctors
     * Used by: Doctor listing page, schedule page, appointment form
     */
    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllActiveDoctors());
    }

    /**
     * GET /api/doctors/{id} → Get a specific doctor
     * Used by: Doctor profile page
     */
    @GetMapping("/doctors/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    /**
     * GET /api/doctors/search?keyword=sharma → Search doctors by name
     * @RequestParam reads from query string: ?keyword=sharma
     */
    @GetMapping("/doctors/search")
    public ResponseEntity<List<Doctor>> searchDoctors(
            @RequestParam String keyword) {
        return ResponseEntity.ok(doctorService.searchDoctors(keyword));
    }

    // ==================== ADMIN ENDPOINTS ====================
    // These will be protected by JWT in Phase 6

    /**
     * GET /api/admin/doctors → List ALL doctors (including inactive)
     */
    @GetMapping("/admin/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctorsAdmin() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    /**
     * POST /api/admin/doctors → Add a new doctor
     * Returns 201 Created (not 200 OK) because a new resource was created.
     */
    @PostMapping("/admin/doctors")
    public ResponseEntity<Doctor> addDoctor(@Valid @RequestBody DoctorDTO dto) {
        Doctor doctor = doctorService.addDoctor(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(doctor);
    }

    /**
     * PUT /api/admin/doctors/{id} → Update an existing doctor
     */
    @PutMapping("/admin/doctors/{id}")
    public ResponseEntity<Doctor> updateDoctor(
            @PathVariable Long id,
            @Valid @RequestBody DoctorDTO dto) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, dto));
    }

    /**
     * DELETE /api/admin/doctors/{id} → Soft-delete a doctor
     */
    @DeleteMapping("/admin/doctors/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }
}
