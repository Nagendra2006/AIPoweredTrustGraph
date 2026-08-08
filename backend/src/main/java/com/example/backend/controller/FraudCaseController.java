package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.FraudCaseDto;
import com.example.backend.service.FraudDetectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fraud-cases")
public class FraudCaseController {

    private final FraudDetectionService fraudDetectionService;

    public FraudCaseController(FraudDetectionService fraudDetectionService) {
        this.fraudDetectionService = fraudDetectionService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<FraudCaseDto>>> getAllFraudCases() {
        List<FraudCaseDto> cases = fraudDetectionService.getAllFraudCases();
        return ResponseEntity.ok(new ApiResponse<>(true, "Fraud cases retrieved", cases));
    }

    @PreAuthorize("hasRole('SELLER')")
    @GetMapping("/seller")
    public ResponseEntity<ApiResponse<List<FraudCaseDto>>> getSellerFraudCases(Authentication authentication) {
        List<FraudCaseDto> cases = fraudDetectionService.getSellerFraudCases(authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Fraud cases retrieved", cases));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<FraudCaseDto>> getFraudCaseByOrderId(@PathVariable Long orderId, Authentication authentication) {
        FraudCaseDto fraudCase = fraudDetectionService.getFraudCaseByOrderId(orderId, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Fraud case retrieved", fraudCase));
    }
}
