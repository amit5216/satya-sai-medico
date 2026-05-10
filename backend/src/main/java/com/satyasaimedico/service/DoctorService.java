package com.satyasaimedico.service;

import com.satyasaimedico.dto.DoctorDTO;
import com.satyasaimedico.exception.ResourceNotFoundException;
import com.satyasaimedico.model.Doctor;
import com.satyasaimedico.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * ============================================================
 * DOCTOR SERVICE — Business Logic Layer
 * ============================================================
 *
 * 🎓 WHAT IS A SERVICE?
 * The Service layer sits BETWEEN the Controller and Repository:
 *
 *   Client → Controller → SERVICE → Repository → Database
 *
 * 🎓 WHY A SEPARATE SERVICE LAYER?
 * 1. CONTROLLERS should only handle HTTP concerns (request/response)
 * 2. SERVICES contain BUSINESS LOGIC (rules, validations, transformations)
 * 3. REPOSITORIES only do database operations
 *
 * Example: When adding a doctor, the SERVICE:
 *   - Validates the data
 *   - Maps DTO to Entity
 *   - Calls repository to save
 *   - Returns the saved entity
 *
 * The controller just calls the service and returns the result.
 *
 * 🎓 @RequiredArgsConstructor (Lombok):
 * Generates a constructor with all `final` fields.
 * Spring uses this constructor for DEPENDENCY INJECTION.
 * It replaces @Autowired annotation (which is the old way).
 */
@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;

    /**
     * Get all active doctors (for public website).
     */
    public List<Doctor> getAllActiveDoctors() {
        return doctorRepository.findByActiveTrue();
    }

    /**
     * Get all doctors including inactive (for admin panel).
     */
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    /**
     * Get a single doctor by ID.
     * Throws 404 if not found.
     */
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Doctor not found with id: " + id));
    }

    /**
     * Add a new doctor (Admin only).
     * Maps DTO fields to Entity using Builder pattern.
     */
    public Doctor addDoctor(DoctorDTO dto) {
        Doctor doctor = Doctor.builder()
                .name(dto.getName())
                .specialization(dto.getSpecialization())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .imageUrl(dto.getImageUrl())
                .bio(dto.getBio())
                .active(true)
                .build();
        return doctorRepository.save(doctor);
    }

    /**
     * Update an existing doctor (Admin only).
     * First finds the doctor, then updates only the provided fields.
     */
    public Doctor updateDoctor(Long id, DoctorDTO dto) {
        Doctor doctor = getDoctorById(id);
        doctor.setName(dto.getName());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setPhone(dto.getPhone());
        doctor.setEmail(dto.getEmail());
        doctor.setImageUrl(dto.getImageUrl());
        doctor.setBio(dto.getBio());
        return doctorRepository.save(doctor);
    }

    /**
     * Soft-delete a doctor (Admin only).
     * Sets active = false instead of actually deleting.
     */
    public void deleteDoctor(Long id) {
        Doctor doctor = getDoctorById(id);
        doctor.setActive(false);
        doctorRepository.save(doctor);
    }

    public Doctor uploadPhoto(Long id, org.springframework.web.multipart.MultipartFile file,
                              FileStorageService fileStorageService) throws java.io.IOException {
        Doctor doctor = getDoctorById(id);
        // Delete old photo if exists
        fileStorageService.deleteFile(doctor.getImageUrl());
        String url = fileStorageService.saveFile(file);
        doctor.setImageUrl(url);
        return doctorRepository.save(doctor);
    }

    /**
     * Search doctors by name.
     */
    public List<Doctor> searchDoctors(String keyword) {
        return doctorRepository.findByNameContainingIgnoreCaseAndActiveTrue(keyword);
    }
}
