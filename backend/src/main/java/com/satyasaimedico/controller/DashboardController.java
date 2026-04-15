package com.satyasaimedico.controller;

import com.satyasaimedico.repository.*;
import com.satyasaimedico.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * ============================================================
 * DASHBOARD CONTROLLER — Aggregate statistics for Admin panel
 * ============================================================
 *
 * 🎓 WHY A SEPARATE DASHBOARD CONTROLLER?
 * The admin dashboard needs ONE API call that returns ALL stats:
 * - Total doctors, patients, appointments
 * - Appointment breakdown by status
 * - Today's appointment count
 *
 * Without this, the frontend would need 5+ API calls just
 * to load the dashboard page. That's inefficient.
 *
 * 🎓 INTERVIEW: "How to optimize multiple API calls for a dashboard?"
 * → "We use an aggregate endpoint that returns all stats in one call.
 *    This reduces network roundtrips and improves page load time.
 *    In production, we'd also add caching (Redis/Spring Cache) to
 *    avoid hitting the database on every dashboard load."
 */
@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicineRepository medicineRepository;
    private final HospitalServiceRepository serviceRepository;
    private final AppointmentService appointmentService;

    /**
     * GET /api/admin/dashboard/stats → Complete dashboard statistics
     *
     * Response Example:
     * {
     *   "totalDoctors": 5,
     *   "activeDoctors": 4,
     *   "totalPatients": 150,
     *   "totalAppointments": 350,
     *   "appointmentStats": {
     *     "total": 350,
     *     "pending": 12,
     *     "confirmed": 5,
     *     "completed": 320,
     *     "cancelled": 13,
     *     "today": 3
     *   },
     *   "totalMedicines": 25,
     *   "totalServices": 4
     * }
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new LinkedHashMap<>();

        // Doctor stats
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("activeDoctors", doctorRepository.findByActiveTrue().size());

        // Patient stats
        stats.put("totalPatients", patientRepository.count());

        // Appointment stats (reuse existing service)
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("appointmentStats", appointmentService.getStats());

        // Catalog stats
        stats.put("totalMedicines", medicineRepository.count());
        stats.put("totalServices", serviceRepository.count());

        return ResponseEntity.ok(stats);
    }
}
