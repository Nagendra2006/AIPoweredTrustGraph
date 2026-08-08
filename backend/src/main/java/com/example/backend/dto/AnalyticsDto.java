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
public class AnalyticsDto {
    private Long totalUsers;
    private Long totalOrders;
    private BigDecimal totalRevenue;
    private Long totalFraudCases;
    private Long highRiskFraudCases;
    
    // For Sellers
    private Long totalProducts;
    private Long myOrdersCount;
    private BigDecimal myRevenue;
}
