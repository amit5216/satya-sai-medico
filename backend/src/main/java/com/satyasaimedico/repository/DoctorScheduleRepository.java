package com.satyasaimedico.repository;

import com.satyasaimedico.model.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {

    /**
     * Find all schedules for a specific day.
     * This powers the timetable view:
     *   "Show me all doctors who sit on MONDAY"
     *
     * Generated SQL: SELECT * FROM doctor_schedule WHERE day_of_week = ?
     */
    List<DoctorSchedule> findByDayOfWeek(DoctorSchedule.DayOfWeek dayOfWeek);

    /**
     * Find all schedules for a specific doctor.
     * Generated SQL: SELECT * FROM doctor_schedule WHERE doctor_id = ?
     */
    List<DoctorSchedule> findByDoctorId(Long doctorId);

    /**
     * Delete all schedules for a doctor (useful when updating entire schedule).
     */
    void deleteByDoctorId(Long doctorId);
}
