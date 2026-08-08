package com.example.backend.repository;

import com.example.backend.node.GraphIpAddress;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface GraphIpAddressRepository extends Neo4jRepository<GraphIpAddress, String> {
}
