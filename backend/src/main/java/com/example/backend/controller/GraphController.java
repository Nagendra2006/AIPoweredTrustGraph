package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.service.TrustGraphService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/graph")
public class GraphController {

    private final TrustGraphService trustGraphService;

    public GraphController(TrustGraphService trustGraphService) {
        this.trustGraphService = trustGraphService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getGraphStats() {
        Map<String, Long> stats = trustGraphService.getGraphStats();
        return ResponseEntity.ok(new ApiResponse<>(true, "Graph stats retrieved", stats));
    }
}
