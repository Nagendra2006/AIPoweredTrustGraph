package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FraudCaseDto {
    private Long id;
    private Long orderId;
    private String customerName;
    private String sellerName;
    private String productName;
    private Double riskScore;
    private String riskLevel;
    private String decision;
    private String explanation;
    private LocalDateTime createdAt;
}
