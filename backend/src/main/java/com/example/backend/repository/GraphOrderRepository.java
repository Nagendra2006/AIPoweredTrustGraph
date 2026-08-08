package com.example.backend.repository;

import com.example.backend.node.GraphOrder;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface GraphOrderRepository extends Neo4jRepository<GraphOrder, Long> {
}
