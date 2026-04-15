package com.satyasaimedico.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class MedicineDTO {

    @NotBlank(message = "Medicine name is required")
    @Size(max = 200, message = "Medicine name must not exceed 200 characters")
    private String name;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    private String imageUrl;

    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;
}
