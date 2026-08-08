package com.example.backend.node;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

@Node("Order")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GraphOrder {

    @Id
    private Long orderId;

    private Double amount;
    private String status;

    @Relationship(type = "SOLD_BY", direction = Relationship.Direction.OUTGOING)
    private GraphUser seller;
}
