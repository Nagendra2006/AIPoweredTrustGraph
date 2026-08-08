package com.example.backend.node;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Node("IpAddress")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GraphIpAddress {

    @Id
    private String ipAddress;
}
