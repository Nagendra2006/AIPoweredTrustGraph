package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotBlank(message = "Device ID is required")
    private String deviceId;

    @NotBlank(message = "IP Address is required")
    private String ipAddress;
}
