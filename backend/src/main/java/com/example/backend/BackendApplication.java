package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;

@SpringBootApplication
@EnableAsync
@EnableJpaRepositories(basePackages = "com.example.backend.repository")
@EnableNeo4jRepositories(basePackages = "com.example.backend.graphrepository", transactionManagerRef = "neo4jTransactionManager")
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
