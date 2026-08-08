package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.ProductDto;
import com.example.backend.dto.ProductRequest;
import com.example.backend.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDto>>> getAllProducts() {
        List<ProductDto> products = productService.getAllProducts();
        return ResponseEntity.ok(new ApiResponse<>(true, "Products retrieved", products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> getProductById(@PathVariable Long id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product retrieved", product));
    }

    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @GetMapping("/seller")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getMyProducts(Authentication authentication) {
        List<ProductDto> products = productService.getProductsBySeller(authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Products retrieved", products));
    }

    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(Authentication authentication,
                                                               @Valid @RequestBody ProductRequest request) {
        ProductDto created = productService.createProduct(authentication.getName(), request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product created successfully", created));
    }

    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(Authentication authentication,
                                                               @PathVariable Long id,
                                                               @Valid @RequestBody ProductRequest request) {
        ProductDto updated = productService.updateProduct(id, authentication.getName(), request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product updated successfully", updated));
    }

    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(Authentication authentication, @PathVariable Long id) {
        productService.deleteProduct(id, authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Product deleted successfully", null));
    }
}
