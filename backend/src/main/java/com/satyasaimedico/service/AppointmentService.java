package com.satyasaimedico.service;

import com.satyasaimedico.dto.AppointmentDTO;
import com.satyasaimedico.exception.ResourceNotFoundException;
import com.satyasaimedico.model.Appointment;
import com.satyasaimedico.model.Doctor;
import com.satyasaimedico.model.Patient;
import com.satyasaimedico.repository.AppointmentRepository;
import com.satyasaimedico.repository.DoctorRepository;
import com.satyasaimedico.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    /**
     * Book an appointment.
     *
     * 🎓 BUSINESS LOGIC FLOW:
     * 1. Find the doctor (throw 404 if not found)
     * 2. Find or create the patient by mobile number
     * 3. Create the appointment with status PENDING
     *
     * @Transactional ensures if any step fails, all changes are rolled back.
     */
    @Transactional
    public Appointment bookAppointment(AppointmentDTO dto) {
        // Step 1: Validate doctor exists
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Doctor not found with id: " + dto.getDoctorId()));

        // Step 2: Find or create patient
        Patient patient = patientRepository.findByMobile(dto.getPatientMobile())
                .orElseGet(() -> {
                    // New patient — create and save
                    Patient newPatient = Patient.builder()
                            .name(dto.getPatientName())
                            .mobile(dto.getPatientMobile())
                            .verified(false) // Will be verified via OTP in Phase 5
                            .build();
                    return patientRepository.save(newPatient);
                });

        // Update patient name if it changed
        if (!patient.getName().equals(dto.getPatientName())) {
            patient.setName(dto.getPatientName());
            patientRepository.save(patient);
        }

        // Step 3: Create appointment
        Appointment appointment = Appointment.builder()
                .doctor(doctor)
                .patient(patient)
                .appointmentDate(LocalDate.parse(dto.getAppointmentDate()))
                .status("PENDING")
                .build();

        return appointmentRepository.save(appointment);
    }

    /**
     * Get all appointments (Admin).
     */
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    /**
     * Get appointments by status (Admin).
     */
    public List<Appointment> getAppointmentsByStatus(String status) {
        return appointmentRepository.findByStatus(status.toUpperCase());
    }

    /**
     * Get today's appointments (Admin dashboard).
     */
    public List<Appointment> getTodaysAppointments() {
        return appointmentRepository.findByAppointmentDate(LocalDate.now());
    }

    /**
     * Update appointment status (Admin).
     * Allowed transitions: PENDING → CONFIRMED, COMPLETED, CANCELLED
     */
    public Appointment updateAppointmentStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Appointment not found with id: " + id));
        appointment.setStatus(status.toUpperCase());
        return appointmentRepository.save(appointment);
    }

    /**
     * Get appointment statistics (Admin dashboard).
     */
    public AppointmentStats getStats() {
        long total = appointmentRepository.count();
        long pending = appointmentRepository.countByStatus("PENDING");
        long confirmed = appointmentRepository.countByStatus("CONFIRMED");
        long completed = appointmentRepository.countByStatus("COMPLETED");
        long cancelled = appointmentRepository.countByStatus("CANCELLED");
        long todayCount = appointmentRepository.findByAppointmentDate(LocalDate.now()).size();
        return new AppointmentStats(total, pending, confirmed, completed, cancelled, todayCount);
    }

    /**
     * Inner record for appointment statistics.
     * Records are immutable data carriers (Java 16+).
     */
    public record AppointmentStats(
        long total, long pending, long confirmed,
        long completed, long cancelled, long today
    ) {}
}
