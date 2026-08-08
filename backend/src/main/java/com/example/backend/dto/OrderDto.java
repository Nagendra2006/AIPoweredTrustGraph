package com.example.backend.dto;

import com.example.backend.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDto {
    private Long id;
    private Long customerId;
    private String customerName;
    private Long sellerId;
    private String sellerName;
    private Long productId;
    private String productName;
    private Long deliveryPartnerId;
    private String deliveryPartnerName;
    private OrderStatus status;
    private BigDecimal amount;
    private String deviceId;
    private String ipAddress;
    private LocalDateTime createdAt;
}
