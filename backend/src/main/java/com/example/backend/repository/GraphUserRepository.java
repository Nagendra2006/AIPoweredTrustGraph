package com.example.backend.repository;

import com.example.backend.node.GraphUser;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface GraphUserRepository extends Neo4jRepository<GraphUser, Long> {
}
