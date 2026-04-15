package com.satyasaimedico.controller;

import com.satyasaimedico.dto.DoctorScheduleDTO;
import com.satyasaimedico.model.DoctorSchedule;
import com.satyasaimedico.service.DoctorScheduleService;
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
public class DoctorScheduleController {

    private final DoctorScheduleService scheduleService;

    // ==================== PUBLIC ENDPOINTS ====================

    /**
     * GET /api/schedules → Full weekly timetable
     * Returns: { "MONDAY": [{doctor1}, {doctor2}], "TUESDAY": [...] }
     */
    @GetMapping("/schedules")
    public ResponseEntity<Map<String, List<Map<String, Object>>>> getWeeklySchedule() {
        return ResponseEntity.ok(scheduleService.getWeeklySchedule());
    }

    /**
     * GET /api/schedules/day/MONDAY → Doctors for a specific day
     */
    @GetMapping("/schedules/day/{day}")
    public ResponseEntity<List<DoctorSchedule>> getDoctorsByDay(
            @PathVariable DoctorSchedule.DayOfWeek day) {
        return ResponseEntity.ok(scheduleService.getDoctorsByDay(day));
    }

    // ==================== ADMIN ENDPOINTS ====================

    /**
     * POST /api/admin/schedules → Set doctor's schedule
     * Body: { "doctorId": 1, "days": ["MONDAY", "WEDNESDAY", "FRIDAY"] }
     */
    @PostMapping("/admin/schedules")
    public ResponseEntity<List<DoctorSchedule>> setDoctorSchedule(
            @Valid @RequestBody DoctorScheduleDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(scheduleService.setDoctorSchedule(dto));
    }

    /**
     * DELETE /api/admin/schedules/{id} → Remove a schedule entry
     */
    @DeleteMapping("/admin/schedules/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }
}
