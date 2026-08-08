package com.example.backend.controller;

import com.example.backend.dto.AnalyticsDto;
import com.example.backend.dto.ApiResponse;
import com.example.backend.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<AnalyticsDto>> getAnalytics(Authentication authentication) {
        AnalyticsDto stats = analyticsService.getAnalytics(authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Analytics retrieved", stats));
    }
}
