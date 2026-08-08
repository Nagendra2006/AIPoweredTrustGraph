package com.example.backend.graphrepository;

import com.example.backend.node.GraphDevice;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface GraphDeviceRepository extends Neo4jRepository<GraphDevice, String> {
}
