package com.example.backend.service;

import com.example.backend.dto.AnalyticsDto;
import com.example.backend.entity.Order;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.FraudCaseRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final FraudCaseRepository fraudCaseRepository;
    private final ProductRepository productRepository;

    public AnalyticsService(UserRepository userRepository, OrderRepository orderRepository, FraudCaseRepository fraudCaseRepository, ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.fraudCaseRepository = fraudCaseRepository;
        this.productRepository = productRepository;
    }

    public AnalyticsDto getAnalytics(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        AnalyticsDto.AnalyticsDtoBuilder builder = AnalyticsDto.builder();

        if (user.getRole().name().equals("ADMIN")) {
            List<Order> allOrders = orderRepository.findAll();
            BigDecimal totalRev = allOrders.stream().map(Order::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            
            long highRisk = fraudCaseRepository.findAll().stream()
                    .filter(f -> "HIGH".equals(f.getRiskLevel())).count();

            builder.totalUsers(userRepository.count())
                   .totalOrders((long) allOrders.size())
                   .totalRevenue(totalRev)
                   .totalFraudCases(fraudCaseRepository.count())
                   .highRiskFraudCases(highRisk);

        } else if (user.getRole().name().equals("SELLER")) {
            List<Order> sellerOrders = orderRepository.findBySellerIdOrderByCreatedAtDesc(user.getId());
            BigDecimal sellerRev = sellerOrders.stream().map(Order::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            
            long fraudCount = fraudCaseRepository.findByOrderSellerIdOrderByCreatedAtDesc(user.getId()).size();
            long productCount = productRepository.findBySellerId(user.getId()).size();

            builder.myOrdersCount((long) sellerOrders.size())
                   .myRevenue(sellerRev)
                   .totalProducts(productCount)
                   .totalFraudCases(fraudCount);
                   
        } else if (user.getRole().name().equals("CUSTOMER")) {
            List<Order> customerOrders = orderRepository.findByCustomerIdOrderByCreatedAtDesc(user.getId());
            BigDecimal spent = customerOrders.stream().map(Order::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            
            builder.myOrdersCount((long) customerOrders.size())
                   .myRevenue(spent); // reusing myRevenue field for 'total spent'
        }

        return builder.build();
    }
}
