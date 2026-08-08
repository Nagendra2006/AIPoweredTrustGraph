package com.example.backend.repository;

import com.example.backend.entity.FraudCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FraudCaseRepository extends JpaRepository<FraudCase, Long> {
    Optional<FraudCase> findByOrderId(Long orderId);
    List<FraudCase> findByOrderSellerIdOrderByCreatedAtDesc(Long sellerId);
    List<FraudCase> findAllByOrderByCreatedAtDesc();
}
