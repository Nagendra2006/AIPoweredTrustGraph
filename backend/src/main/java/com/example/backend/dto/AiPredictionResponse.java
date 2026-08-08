package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AiPredictionResponse {
    
    @JsonProperty("fraud_probability")
    private Double riskScore;
    
    @JsonProperty("anomaly")
    private String riskLevel;
    
    @JsonProperty("action")
    private String decision;
    
    @JsonProperty("explanation")
    private Object explanation; // Use Object because teammate's Python code returns a List of Dicts, not a simple string
}
