package com.example.backend.service;

import com.example.backend.dto.AiPredictionRequest;
import com.example.backend.dto.AiPredictionResponse;
import com.example.backend.dto.FraudCaseDto;
import com.example.backend.entity.FraudCase;
import com.example.backend.entity.Order;
import com.example.backend.entity.User;
import com.example.backend.exception.CustomException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.FraudCaseRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FraudDetectionService {

    private final FraudCaseRepository fraudCaseRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai.service.url:http://10.142.0.145:8000/predict}")
    private String aiServiceUrl;

    public FraudDetectionService(FraudCaseRepository fraudCaseRepository, UserRepository userRepository) {
        this.fraudCaseRepository = fraudCaseRepository;
        this.userRepository = userRepository;
    }

    private FraudCaseDto mapToDto(FraudCase fraudCase) {
        return FraudCaseDto.builder()
                .id(fraudCase.getId())
                .orderId(fraudCase.getOrder().getId())
                .customerName(fraudCase.getOrder().getCustomer().getName())
                .sellerName(fraudCase.getOrder().getSeller().getName())
                .productName(fraudCase.getOrder().getProduct().getName())
                .riskScore(fraudCase.getRiskScore())
                .riskLevel(fraudCase.getRiskLevel())
                .decision(fraudCase.getDecision())
                .explanation(fraudCase.getExplanation())
                .createdAt(fraudCase.getCreatedAt())
                .build();
    }

    @Async
    public void evaluateOrder(Order order) {
        AiPredictionRequest request = AiPredictionRequest.builder()
                .orderId(order.getId())
                .customerId(order.getCustomer().getId())
                .sellerId(order.getSeller().getId())
                .productId(order.getProduct().getId())
                .deliveryPartnerId(order.getDeliveryPartner() != null ? order.getDeliveryPartner().getId() : null)
                .amount(order.getAmount())
                .deviceId(order.getDeviceId())
                .ipAddress(order.getIpAddress())
                .build();

        try {
            AiPredictionResponse response = restTemplate.postForObject(aiServiceUrl, request, AiPredictionResponse.class);

            if (response != null) {
                FraudCase fraudCase = FraudCase.builder()
                        .order(order)
                        .riskScore(response.getRiskScore())
                        .riskLevel(response.getRiskLevel())
                        .decision(response.getDecision())
                        .explanation(response.getExplanation() != null ? response.getExplanation().toString() : "No explanation provided")
                        .build();

                fraudCaseRepository.save(fraudCase);
            }
        } catch (Exception e) {
            System.err.println("Failed to reach AI service for order " + order.getId() + ": " + e.getMessage());
            // In a real app, maybe save a default "UNKNOWN" case or implement a retry mechanism.
        }
    }

    public List<FraudCaseDto> getAllFraudCases() {
        return fraudCaseRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<FraudCaseDto> getSellerFraudCases(String email) {
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));
        return fraudCaseRepository.findByOrderSellerIdOrderByCreatedAtDesc(seller.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public FraudCaseDto getFraudCaseByOrderId(Long orderId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        FraudCase fraudCase = fraudCaseRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("No fraud record found for this order"));

        // Basic authorization check
        if (!user.getRole().name().equals("ADMIN") && 
            !fraudCase.getOrder().getCustomer().getId().equals(user.getId()) &&
            !fraudCase.getOrder().getSeller().getId().equals(user.getId())) {
            throw new CustomException("You do not have permission to view this fraud case");
        }

        return mapToDto(fraudCase);
    }
}
