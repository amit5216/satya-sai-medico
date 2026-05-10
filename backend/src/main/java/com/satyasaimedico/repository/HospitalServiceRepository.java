package com.satyasaimedico.repository;

import com.satyasaimedico.model.HospitalService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HospitalServiceRepository extends JpaRepository<HospitalService, Long> {

    /**
     * Find all active services (displayed on the website).
     */
    List<HospitalService> findByActiveTrue();
}
