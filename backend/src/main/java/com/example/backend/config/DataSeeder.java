package com.example.backend.config;

import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@example.com";
        
        User admin = userRepository.findByEmail(adminEmail).orElseGet(() -> 
                User.builder()
                        .name("System Admin")
                        .email(adminEmail)
                        .role(Role.ADMIN)
                        .phoneNumber("1234567890")
                        .isActive(true)
                        .build()
        );
        
        // Always overwrite the password and active status on startup to ensure it works
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setActive(true);
        userRepository.save(admin);
        
        System.out.println("Default Admin user seeded successfully! Email: " + adminEmail + " Active: " + admin.isActive());

        String sellerEmail = "seller@example.com";
        User seller = userRepository.findByEmail(sellerEmail).orElseGet(() -> 
                User.builder()
                        .name("Premium Electronics Seller")
                        .email(sellerEmail)
                        .role(Role.SELLER)
                        .phoneNumber("9876543210")
                        .isActive(true)
                        .build()
        );
        
        seller.setPassword(passwordEncoder.encode("admin123"));
        seller.setActive(true);
        userRepository.save(seller);
        
        System.out.println("Default Seller user seeded successfully! Email: " + sellerEmail + " Active: " + seller.isActive());
    }
}
