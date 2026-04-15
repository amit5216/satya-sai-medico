package com.satyasaimedico.service;

import com.satyasaimedico.model.Patient;
import com.satyasaimedico.repository.PatientRepository;
import com.satyasaimedico.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * ============================================================
 * PATIENT SERVICE — Business Logic for Patient Management
 * ============================================================
 *
 * 🎓 Currently, patients are created automatically during
 * appointment booking (find-or-create pattern in AppointmentService).
 * This service provides ADMIN endpoints for patient management.
 */
@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    /**
     * Get all patients (Admin panel).
     */
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    /**
     * Get patient by ID (Admin panel).
     */
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient not found with id: " + id));
    }

    /**
     * Get patient by mobile number (for appointment lookup).
     */
    public Patient getPatientByMobile(String mobile) {
        return patientRepository.findByMobile(mobile)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient not found with mobile: " + mobile));
    }

    /**
     * Get total patient count (Dashboard stats).
     */
    public long getPatientCount() {
        return patientRepository.count();
    }
}
