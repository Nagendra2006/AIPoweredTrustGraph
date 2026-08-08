package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.OrderDto;
import com.example.backend.dto.OrderRequest;
import com.example.backend.entity.OrderStatus;
import com.example.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(Authentication authentication,
                                                           @Valid @RequestBody OrderRequest request) {
        OrderDto order = orderService.createOrder(authentication.getName(), request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Order placed successfully", order));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getMyOrders(Authentication authentication) {
        List<OrderDto> orders = orderService.getMyOrders(authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Orders retrieved", orders));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    @GetMapping("/unassigned")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getUnassignedOrders() {
        List<OrderDto> orders = orderService.getUnassignedOrders();
        return ResponseEntity.ok(new ApiResponse<>(true, "Unassigned orders retrieved", orders));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/assign/{dpId}")
    public ResponseEntity<ApiResponse<OrderDto>> assignDeliveryPartner(@PathVariable Long id, @PathVariable Long dpId) {
        OrderDto order = orderService.assignDeliveryPartner(id, dpId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Order assigned successfully", order));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(Authentication authentication,
                                                                 @PathVariable Long id,
                                                                 @RequestParam OrderStatus status) {
        OrderDto order = orderService.updateOrderStatus(id, authentication.getName(), status);
        return ResponseEntity.ok(new ApiResponse<>(true, "Order status updated", order));
    }
}
