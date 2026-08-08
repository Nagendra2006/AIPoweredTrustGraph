package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AiPredictionResponse {
    private Double riskScore;
    private String riskLevel;
    private String decision;
    private String explanation;
}
