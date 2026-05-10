package com.satyasaimedico.repository;

import com.satyasaimedico.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    /**
     * Find all active medicines for the website.
     */
    List<Medicine> findByActiveTrue();

    /**
     * Find medicines by category.
     * e.g., findByCategoryAndActiveTrue("Antibiotics")
     */
    List<Medicine> findByCategoryAndActiveTrue(String category);

    /**
     * Search medicines by name (partial match).
     */
    List<Medicine> findByNameContainingIgnoreCaseAndActiveTrue(String name);
}
