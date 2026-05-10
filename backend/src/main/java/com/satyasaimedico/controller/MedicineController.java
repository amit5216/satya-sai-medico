package com.satyasaimedico.controller;

import com.satyasaimedico.dto.MedicineDTO;
import com.satyasaimedico.model.Medicine;
import com.satyasaimedico.service.MedicineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    // ==================== PUBLIC ENDPOINTS ====================

    @GetMapping("/medicines")
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        return ResponseEntity.ok(medicineService.getAllActiveMedicines());
    }

    @GetMapping("/medicines/{id}")
    public ResponseEntity<Medicine> getMedicineById(@PathVariable Long id) {
        return ResponseEntity.ok(medicineService.getMedicineById(id));
    }

    @GetMapping("/medicines/search")
    public ResponseEntity<List<Medicine>> searchMedicines(
            @RequestParam String keyword) {
        return ResponseEntity.ok(medicineService.searchMedicines(keyword));
    }

    @GetMapping("/medicines/category/{category}")
    public ResponseEntity<List<Medicine>> getMedicinesByCategory(
            @PathVariable String category) {
        return ResponseEntity.ok(medicineService.getMedicinesByCategory(category));
    }

    // ==================== ADMIN ENDPOINTS ====================

    @GetMapping("/admin/medicines")
    public ResponseEntity<List<Medicine>> getAllMedicinesAdmin() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    @PostMapping("/admin/medicines")
    public ResponseEntity<Medicine> addMedicine(
            @Valid @RequestBody MedicineDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(medicineService.addMedicine(dto));
    }

    @PutMapping("/admin/medicines/{id}")
    public ResponseEntity<Medicine> updateMedicine(
            @PathVariable Long id,
            @Valid @RequestBody MedicineDTO dto) {
        return ResponseEntity.ok(medicineService.updateMedicine(id, dto));
    }

    @DeleteMapping("/admin/medicines/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.noContent().build();
    }
}
