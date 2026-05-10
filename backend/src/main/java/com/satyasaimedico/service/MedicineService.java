package com.satyasaimedico.service;

import com.satyasaimedico.dto.MedicineDTO;
import com.satyasaimedico.exception.ResourceNotFoundException;
import com.satyasaimedico.model.Medicine;
import com.satyasaimedico.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public List<Medicine> getAllActiveMedicines() {
        return medicineRepository.findByActiveTrue();
    }

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Medicine not found with id: " + id));
    }

    public Medicine addMedicine(MedicineDTO dto) {
        Medicine medicine = Medicine.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .category(dto.getCategory())
                .active(true)
                .build();
        return medicineRepository.save(medicine);
    }

    public Medicine updateMedicine(Long id, MedicineDTO dto) {
        Medicine medicine = getMedicineById(id);
        medicine.setName(dto.getName());
        medicine.setDescription(dto.getDescription());
        medicine.setImageUrl(dto.getImageUrl());
        medicine.setCategory(dto.getCategory());
        return medicineRepository.save(medicine);
    }

    public void deleteMedicine(Long id) {
        Medicine medicine = getMedicineById(id);
        medicine.setActive(false);
        medicineRepository.save(medicine);
    }

    public List<Medicine> searchMedicines(String keyword) {
        return medicineRepository.findByNameContainingIgnoreCaseAndActiveTrue(keyword);
    }

    public List<Medicine> getMedicinesByCategory(String category) {
        return medicineRepository.findByCategoryAndActiveTrue(category);
    }
}
