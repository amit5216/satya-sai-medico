package com.satyasaimedico.controller;

import com.satyasaimedico.dto.ServiceDTO;
import com.satyasaimedico.model.HospitalService;
import com.satyasaimedico.service.HospitalServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ServiceController {

    private final HospitalServiceService hospitalServiceService;

    // ==================== PUBLIC ENDPOINTS ====================

    @GetMapping("/services")
    public ResponseEntity<List<HospitalService>> getAllServices() {
        return ResponseEntity.ok(hospitalServiceService.getAllActiveServices());
    }

    @GetMapping("/services/{id}")
    public ResponseEntity<HospitalService> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(hospitalServiceService.getServiceById(id));
    }

    // ==================== ADMIN ENDPOINTS ====================

    @GetMapping("/admin/services")
    public ResponseEntity<List<HospitalService>> getAllServicesAdmin() {
        return ResponseEntity.ok(hospitalServiceService.getAllServices());
    }

    @PostMapping("/admin/services")
    public ResponseEntity<HospitalService> addService(
            @Valid @RequestBody ServiceDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(hospitalServiceService.addService(dto));
    }

    @PutMapping("/admin/services/{id}")
    public ResponseEntity<HospitalService> updateService(
            @PathVariable Long id,
            @Valid @RequestBody ServiceDTO dto) {
        return ResponseEntity.ok(hospitalServiceService.updateService(id, dto));
    }

    @DeleteMapping("/admin/services/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        hospitalServiceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}
