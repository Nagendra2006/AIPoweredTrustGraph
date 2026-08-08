package com.example.backend.service;

import com.example.backend.dto.OrderDto;
import com.example.backend.dto.OrderRequest;
import com.example.backend.entity.Order;
import com.example.backend.entity.OrderStatus;
import com.example.backend.entity.Product;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.exception.CustomException;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FraudDetectionService fraudDetectionService;

    @Mock
    private TrustGraphService trustGraphService;

    @InjectMocks
    private OrderService orderService;

    private User customer;
    private User seller;
    private Product product;
    private OrderRequest request;

    @BeforeEach
    void setUp() {
        customer = User.builder().id(1L).email("customer@test.com").name("Customer").role(Role.CUSTOMER).build();
        seller = User.builder().id(2L).email("seller@test.com").name("Seller").role(Role.SELLER).build();
        product = Product.builder().id(100L).name("Laptop").price(new BigDecimal("1000.00")).stockQuantity(10).seller(seller).build();
        
        request = new OrderRequest();
        request.setProductId(100L);
        request.setDeviceId("device-123");
        request.setIpAddress("192.168.1.1");
    }

    @Test
    void testCreateOrder_Success() {
        when(userRepository.findByEmail(customer.getEmail())).thenReturn(Optional.of(customer));
        when(productRepository.findById(request.getProductId())).thenReturn(Optional.of(product));
        
        Order savedOrder = Order.builder()
                .id(500L)
                .customer(customer)
                .seller(seller)
                .product(product)
                .amount(product.getPrice())
                .status(OrderStatus.PENDING)
                .deviceId(request.getDeviceId())
                .ipAddress(request.getIpAddress())
                .build();
                
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        OrderDto orderDto = orderService.createOrder(customer.getEmail(), request);

        assertNotNull(orderDto);
        assertEquals(500L, orderDto.getId());
        assertEquals("Laptop", orderDto.getProductName());
        assertEquals(9, product.getStockQuantity()); // stock reduced
        
        verify(fraudDetectionService, times(1)).evaluateOrder(savedOrder);
        verify(trustGraphService, times(1)).syncOrderToGraph(savedOrder);
    }

    @Test
    void testCreateOrder_OutOfStock() {
        product.setStockQuantity(0);
        when(userRepository.findByEmail(customer.getEmail())).thenReturn(Optional.of(customer));
        when(productRepository.findById(request.getProductId())).thenReturn(Optional.of(product));

        assertThrows(CustomException.class, () -> {
            orderService.createOrder(customer.getEmail(), request);
        });

        verify(orderRepository, never()).save(any(Order.class));
    }
}
