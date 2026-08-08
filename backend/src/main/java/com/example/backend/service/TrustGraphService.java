package com.example.backend.service;

import com.example.backend.entity.Order;
import com.example.backend.entity.User;
import com.example.backend.node.GraphDevice;
import com.example.backend.node.GraphIpAddress;
import com.example.backend.node.GraphOrder;
import com.example.backend.node.GraphUser;
import com.example.backend.repository.GraphDeviceRepository;
import com.example.backend.repository.GraphIpAddressRepository;
import com.example.backend.repository.GraphOrderRepository;
import com.example.backend.repository.GraphUserRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class TrustGraphService {

    private final GraphUserRepository graphUserRepository;
    private final GraphOrderRepository graphOrderRepository;
    private final GraphDeviceRepository graphDeviceRepository;
    private final GraphIpAddressRepository graphIpAddressRepository;

    public TrustGraphService(GraphUserRepository graphUserRepository,
                             GraphOrderRepository graphOrderRepository,
                             GraphDeviceRepository graphDeviceRepository,
                             GraphIpAddressRepository graphIpAddressRepository) {
        this.graphUserRepository = graphUserRepository;
        this.graphOrderRepository = graphOrderRepository;
        this.graphDeviceRepository = graphDeviceRepository;
        this.graphIpAddressRepository = graphIpAddressRepository;
    }

    private GraphUser getOrCreateUser(User user) {
        return graphUserRepository.findById(user.getId()).orElseGet(() -> {
            GraphUser newUser = GraphUser.builder()
                    .userId(user.getId())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .build();
            return graphUserRepository.save(newUser);
        });
    }

    private GraphDevice getOrCreateDevice(String deviceId) {
        return graphDeviceRepository.findById(deviceId).orElseGet(() -> {
            GraphDevice device = GraphDevice.builder().deviceId(deviceId).build();
            return graphDeviceRepository.save(device);
        });
    }

    private GraphIpAddress getOrCreateIpAddress(String ipAddress) {
        return graphIpAddressRepository.findById(ipAddress).orElseGet(() -> {
            GraphIpAddress ip = GraphIpAddress.builder().ipAddress(ipAddress).build();
            return graphIpAddressRepository.save(ip);
        });
    }

    @Async
    @Transactional
    public void syncOrderToGraph(Order order) {
        try {
            // 1. Ensure Customer and Seller exist in Graph
            GraphUser customerNode = getOrCreateUser(order.getCustomer());
            GraphUser sellerNode = getOrCreateUser(order.getSeller());

            // 2. Ensure Device and IP exist
            GraphDevice deviceNode = getOrCreateDevice(order.getDeviceId());
            GraphIpAddress ipNode = getOrCreateIpAddress(order.getIpAddress());

            // 3. Create Order Node
            GraphOrder orderNode = GraphOrder.builder()
                    .orderId(order.getId())
                    .amount(order.getAmount().doubleValue())
                    .status(order.getStatus().name())
                    .seller(sellerNode) // (Order)-[:SOLD_BY]->(Seller)
                    .build();
            orderNode = graphOrderRepository.save(orderNode);

            // 4. Update Customer relationships
            customerNode.getPlacedOrders().add(orderNode); // (Customer)-[:PLACED]->(Order)
            customerNode.getDevices().add(deviceNode);     // (Customer)-[:USES_DEVICE]->(Device)
            customerNode.getIpAddresses().add(ipNode);     // (Customer)-[:USES_IP]->(IP)

            graphUserRepository.save(customerNode);
        } catch (Exception e) {
            System.err.println("Error syncing order to Neo4j Trust Graph: " + e.getMessage());
        }
    }
    
    public Map<String, Long> getGraphStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("users", graphUserRepository.count());
        stats.put("orders", graphOrderRepository.count());
        stats.put("devices", graphDeviceRepository.count());
        stats.put("ips", graphIpAddressRepository.count());
        return stats;
    }
}
