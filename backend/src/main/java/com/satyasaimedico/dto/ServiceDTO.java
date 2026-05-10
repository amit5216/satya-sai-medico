package com.satyasaimedico.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ServiceDTO {

    @NotBlank(message = "Service name is required")
    @Size(max = 100, message = "Service name must not exceed 100 characters")
    private String name;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    private String iconUrl;
}
