package com.satyasaimedico.repository;

import com.satyasaimedico.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    /**
     * Find all active doctors.
     * Generated SQL: SELECT * FROM doctor WHERE active = true
     */
    List<Doctor> findByActiveTrue();

    /**
     * Find doctors by specialization.
     * Generated SQL: SELECT * FROM doctor WHERE specialization = ? AND active = true
     */
    List<Doctor> findBySpecializationAndActiveTrue(String specialization);

    /**
     * Search doctors by name (case-insensitive partial match).
     * Generated SQL: SELECT * FROM doctor WHERE LOWER(name) LIKE LOWER('%keyword%')
     *
     * 🎓 "Containing" in method name = LIKE '%keyword%' in SQL
     * "IgnoreCase" = case-insensitive search
     */
    List<Doctor> findByNameContainingIgnoreCaseAndActiveTrue(String name);
}
