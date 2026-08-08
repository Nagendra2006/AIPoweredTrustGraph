package com.example.backend.service;

import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.UserDto;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.exception.CustomException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private RegisterRequest request;

    @BeforeEach
    void setUp() {
        request = new RegisterRequest();
        request.setName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("password");
        request.setRole(Role.CUSTOMER);
    }

    @Test
    void testGetUserProfile_Success() {
        User user = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .role(Role.CUSTOMER)
                .build();
                
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        UserDto userDto = userService.getUserProfile("test@example.com");

        assertNotNull(userDto);
        assertEquals("Test User", userDto.getName());
        assertEquals("test@example.com", userDto.getEmail());
        assertEquals(Role.CUSTOMER, userDto.getRole());
        
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void testGetUserProfile_NotFound() {
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserProfile("notfound@example.com");
        });
    }
}
