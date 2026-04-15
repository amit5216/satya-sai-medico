package com.satyasaimedico.repository;

import com.satyasaimedico.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    /**
     * Find patient by mobile number.
     * Used during appointment booking to check if patient already exists.
     */
    Optional<Patient> findByMobile(String mobile);

    /**
     * Check if a mobile number is already registered.
     */
    boolean existsByMobile(String mobile);
}
