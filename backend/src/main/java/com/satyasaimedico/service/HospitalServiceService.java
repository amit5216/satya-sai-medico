package com.satyasaimedico.service;

import com.satyasaimedico.dto.ServiceDTO;
import com.satyasaimedico.exception.ResourceNotFoundException;
import com.satyasaimedico.model.HospitalService;
import com.satyasaimedico.repository.HospitalServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HospitalServiceService {

    private final HospitalServiceRepository serviceRepository;

    public List<HospitalService> getAllActiveServices() {
        return serviceRepository.findByActiveTrue();
    }

    public List<HospitalService> getAllServices() {
        return serviceRepository.findAll();
    }

    public HospitalService getServiceById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Service not found with id: " + id));
    }

    public HospitalService addService(ServiceDTO dto) {
        HospitalService service = HospitalService.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .iconUrl(dto.getIconUrl())
                .active(true)
                .build();
        return serviceRepository.save(service);
    }

    public HospitalService updateService(Long id, ServiceDTO dto) {
        HospitalService service = getServiceById(id);
        service.setName(dto.getName());
        service.setDescription(dto.getDescription());
        service.setIconUrl(dto.getIconUrl());
        return serviceRepository.save(service);
    }

    public void deleteService(Long id) {
        HospitalService service = getServiceById(id);
        service.setActive(false);
        serviceRepository.save(service);
    }
}
