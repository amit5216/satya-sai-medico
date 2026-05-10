package com.satyasaimedico.repository;

import com.satyasaimedico.model.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {

    /**
     * Find all schedules for a specific day.
     * Generated SQL: SELECT * FROM doctor_schedule WHERE day_of_week = ?
     */
    List<DoctorSchedule> findByDayOfWeek(DoctorSchedule.DayOfWeek dayOfWeek);

    /**
     * Find all schedules for a specific doctor.
     * Generated SQL: SELECT * FROM doctor_schedule WHERE doctor_id = ?
     */
    List<DoctorSchedule> findByDoctorId(Long doctorId);

    /**
     * Delete all schedules for a doctor using native SQL.
     * @Modifying + @Query ensures immediate execution (not batched by Hibernate),
     * which prevents unique constraint violations when re-assigning days.
     */
    @Modifying
    @Query("DELETE FROM DoctorSchedule ds WHERE ds.doctor.id = :doctorId")
    void deleteByDoctorId(@Param("doctorId") Long doctorId);
}
