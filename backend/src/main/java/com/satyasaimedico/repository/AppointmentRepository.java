package com.satyasaimedico.repository;

import com.satyasaimedico.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    /**
     * Find all appointments for a specific doctor on a specific date.
     * Used to check doctor availability.
     */
    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate date);

    /**
     * Find all appointments for a patient.
     * Used in patient dashboard.
     */
    List<Appointment> findByPatientId(Long patientId);

    /**
     * Find appointments by status (PENDING, CONFIRMED, etc.).
     * Used in admin panel.
     */
    List<Appointment> findByStatus(String status);

    /**
     * Find all appointments for a specific date.
     * Used in admin panel to see today's schedule.
     */
    List<Appointment> findByAppointmentDate(LocalDate date);

    /**
     * Count appointments by status.
     * Used for admin dashboard statistics.
     */
    long countByStatus(String status);
}
