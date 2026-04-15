package com.satyasaimedico.service;

import com.satyasaimedico.dto.DoctorScheduleDTO;
import com.satyasaimedico.exception.ResourceNotFoundException;
import com.satyasaimedico.model.Doctor;
import com.satyasaimedico.model.DoctorSchedule;
import com.satyasaimedico.repository.DoctorRepository;
import com.satyasaimedico.repository.DoctorScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorScheduleService {

    private final DoctorScheduleRepository scheduleRepository;
    private final DoctorRepository doctorRepository;

    /**
     * Get the full weekly timetable.
     * Returns a Map like: { "MONDAY": [Doctor1, Doctor2], "TUESDAY": [Doctor3] }
     *
     * 🎓 WHY A MAP?
     * The frontend needs data grouped by day to display the timetable.
     * Instead of making the frontend group the data, we do it on the backend.
     * This is a common pattern: "shape the data for the consumer."
     */
    public Map<String, List<Map<String, Object>>> getWeeklySchedule() {
        List<DoctorSchedule> allSchedules = scheduleRepository.findAll();
        Map<String, List<Map<String, Object>>> timetable = new LinkedHashMap<>();

        // Initialize all days in order
        for (DoctorSchedule.DayOfWeek day : DoctorSchedule.DayOfWeek.values()) {
            timetable.put(day.name(), new ArrayList<>());
        }

        // Group doctors by day
        for (DoctorSchedule schedule : allSchedules) {
            if (schedule.getDoctor().getActive()) {
                Map<String, Object> doctorInfo = new LinkedHashMap<>();
                doctorInfo.put("scheduleId", schedule.getId());
                doctorInfo.put("doctorId", schedule.getDoctor().getId());
                doctorInfo.put("doctorName", schedule.getDoctor().getName());
                doctorInfo.put("specialization", schedule.getDoctor().getSpecialization());
                doctorInfo.put("imageUrl", schedule.getDoctor().getImageUrl());
                timetable.get(schedule.getDayOfWeek().name()).add(doctorInfo);
            }
        }
        return timetable;
    }

    /**
     * Get doctors available on a specific day.
     */
    public List<DoctorSchedule> getDoctorsByDay(DoctorSchedule.DayOfWeek day) {
        return scheduleRepository.findByDayOfWeek(day);
    }

    /**
     * Set/update a doctor's schedule (Admin only).
     * Replaces all existing schedule entries for the doctor.
     *
     * 🎓 @Transactional:
     * This method deletes old schedules and inserts new ones.
     * If the insert fails AFTER the delete, @Transactional
     * ROLLS BACK the delete — so data is never lost.
     * Without it, we could end up with deleted schedules and no new ones!
     */
    @Transactional
    public List<DoctorSchedule> setDoctorSchedule(DoctorScheduleDTO dto) {
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Doctor not found with id: " + dto.getDoctorId()));

        // Delete all existing schedules for this doctor
        scheduleRepository.deleteByDoctorId(dto.getDoctorId());

        // Create new schedule entries
        List<DoctorSchedule> schedules = dto.getDays().stream()
                .map(day -> DoctorSchedule.builder()
                        .doctor(doctor)
                        .dayOfWeek(day)
                        .build())
                .collect(Collectors.toList());

        return scheduleRepository.saveAll(schedules);
    }

    /**
     * Delete a specific schedule entry.
     */
    public void deleteSchedule(Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Schedule not found with id: " + id);
        }
        scheduleRepository.deleteById(id);
    }
}
