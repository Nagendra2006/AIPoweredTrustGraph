package com.example.backend.service;

import com.example.backend.dto.OrderDto;
import com.example.backend.dto.OrderRequest;
import com.example.backend.entity.Order;
import com.example.backend.entity.OrderStatus;
import com.example.backend.entity.Product;
import com.example.backend.entity.User;
import com.example.backend.exception.CustomException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final FraudDetectionService fraudDetectionService;
    private final TrustGraphService trustGraphService;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository, UserRepository userRepository, FraudDetectionService fraudDetectionService, TrustGraphService trustGraphService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.fraudDetectionService = fraudDetectionService;
        this.trustGraphService = trustGraphService;
    }

    private OrderDto mapToDto(Order order) {
        return OrderDto.builder()
                .id(order.getId())
                .customerId(order.getCustomer().getId())
                .customerName(order.getCustomer().getName())
                .sellerId(order.getSeller().getId())
                .sellerName(order.getSeller().getName())
                .productId(order.getProduct().getId())
                .productName(order.getProduct().getName())
                .deliveryPartnerId(order.getDeliveryPartner() != null ? order.getDeliveryPartner().getId() : null)
                .deliveryPartnerName(order.getDeliveryPartner() != null ? order.getDeliveryPartner().getName() : null)
                .status(order.getStatus())
                .amount(order.getAmount())
                .deviceId(order.getDeviceId())
                .ipAddress(order.getIpAddress())
                .createdAt(order.getCreatedAt())
                .build();
    }

    public OrderDto createOrder(String email, OrderRequest request) {
        User customer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (!customer.getRole().name().equals("CUSTOMER")) {
            throw new CustomException("Only customers can place orders");
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStockQuantity() <= 0) {
            throw new CustomException("Product is out of stock");
        }

        // Reduce stock
        product.setStockQuantity(product.getStockQuantity() - 1);
        productRepository.save(product);

        Order order = Order.builder()
                .customer(customer)
                .seller(product.getSeller())
                .product(product)
                .amount(product.getPrice())
                .status(OrderStatus.PENDING)
                .deviceId(request.getDeviceId())
                .ipAddress(request.getIpAddress())
                .build();

        order = orderRepository.save(order);
        
        // Trigger AI fraud detection asynchronously
        fraudDetectionService.evaluateOrder(order);
        
        // Trigger Neo4j Graph Sync asynchronously
        trustGraphService.syncOrderToGraph(order);

        return mapToDto(order);
    }

    public List<OrderDto> getMyOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole().name().equals("CUSTOMER")) {
            return orderRepository.findByCustomerIdOrderByCreatedAtDesc(user.getId()).stream()
                    .map(this::mapToDto).collect(Collectors.toList());
        } else if (user.getRole().name().equals("SELLER")) {
            return orderRepository.findBySellerIdOrderByCreatedAtDesc(user.getId()).stream()
                    .map(this::mapToDto).collect(Collectors.toList());
        } else if (user.getRole().name().equals("DELIVERY_PARTNER")) {
            return orderRepository.findByDeliveryPartnerIdOrderByCreatedAtDesc(user.getId()).stream()
                    .map(this::mapToDto).collect(Collectors.toList());
        } else {
            return orderRepository.findAll().stream()
                    .map(this::mapToDto).collect(Collectors.toList());
        }
    }

    public OrderDto assignDeliveryPartner(Long orderId, Long deliveryPartnerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        User dp = userRepository.findById(deliveryPartnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery Partner not found"));

        if (!dp.getRole().name().equals("DELIVERY_PARTNER")) {
            throw new CustomException("User is not a delivery partner");
        }

        order.setDeliveryPartner(dp);
        order.setStatus(OrderStatus.ASSIGNED);
        order = orderRepository.save(order);
        return mapToDto(order);
    }

    public OrderDto updateOrderStatus(Long orderId, String email, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Basic authorization for status updates
        if (user.getRole().name().equals("DELIVERY_PARTNER")) {
            if (!order.getDeliveryPartner().getId().equals(user.getId())) {
                throw new CustomException("You can only update your assigned orders");
            }
            if (newStatus != OrderStatus.DELIVERED) {
                throw new CustomException("Delivery partners can only mark as DELIVERED");
            }
        }

        if (user.getRole().name().equals("SELLER")) {
             if (!order.getSeller().getId().equals(user.getId())) {
                throw new CustomException("You can only update your own orders");
             }
        }

        order.setStatus(newStatus);
        order = orderRepository.save(order);
        return mapToDto(order);
    }
    
    public List<OrderDto> getUnassignedOrders() {
        return orderRepository.findByStatusOrderByCreatedAtDesc(OrderStatus.PENDING).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }
}
