package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AiPredictionRequest {
    private Long orderId;
    private Long customerId;
    private Long sellerId;
    private Long productId;
    private Long deliveryPartnerId;
    private BigDecimal amount;
    private String deviceId;
    private String ipAddress;
}
