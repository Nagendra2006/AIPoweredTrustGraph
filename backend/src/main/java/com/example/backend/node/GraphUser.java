package com.example.backend.node;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.HashSet;
import java.util.Set;

@Node("User")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GraphUser {

    @Id
    private Long userId;
    
    private String email;
    private String role;

    @Relationship(type = "PLACED", direction = Relationship.Direction.OUTGOING)
    @Builder.Default
    private Set<GraphOrder> placedOrders = new HashSet<>();

    @Relationship(type = "USES_DEVICE", direction = Relationship.Direction.OUTGOING)
    @Builder.Default
    private Set<GraphDevice> devices = new HashSet<>();

    @Relationship(type = "USES_IP", direction = Relationship.Direction.OUTGOING)
    @Builder.Default
    private Set<GraphIpAddress> ipAddresses = new HashSet<>();
}
