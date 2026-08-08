<div align="center">

# 🛡️ AI-Powered Trust Graph Platform
### Multi-Actor Fraud Detection & Remediation System

An intelligent fraud detection platform that combines **Machine Learning**, **Graph Intelligence**, and **Explainable AI** to detect coordinated fraud and collusion in e-commerce ecosystems.

![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql)
![Neo4j](https://img.shields.io/badge/Neo4j-GraphDB-4581C3?style=for-the-badge&logo=neo4j)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

# 📌 Project Overview

AI-Powered Trust Graph Platform is an intelligent fraud detection system designed to identify coordinated fraudulent activities across e-commerce platforms. Traditional fraud detection systems evaluate transactions independently and often fail to identify collusion among multiple actors. This platform combines **Machine Learning**, **Graph Intelligence**, and **Explainable AI** to analyze both transactional behavior and relationship networks, enabling the detection of sophisticated fraud patterns.

The system constructs a **Trust Graph** connecting customers, sellers, delivery partners, devices, IP addresses, payment methods, and addresses. By analyzing these relationships alongside transaction history, it uncovers hidden fraud networks, generates explainable risk scores, and recommends appropriate actions such as transaction approval, additional verification, manual investigation, or account suspension. An integrated appeal workflow ensures transparency and fairness for legitimate users.

---

# 🎯 Problem Statement

Modern e-commerce platforms are increasingly affected by sophisticated fraud schemes involving multiple participants working together to exploit refund policies, fake deliveries, account sharing, and payment manipulation. Traditional fraud detection systems rely primarily on transaction-level analysis and are unable to identify coordinated fraud involving customers, sellers, delivery partners, devices, and IP addresses.

The objective of this project is to develop an AI-powered fraud detection platform capable of detecting transaction anomalies, uncovering collusion through Trust Graph analysis, generating explainable fraud decisions, and supporting automated remediation with investigator review and appeal management.

---

# ✨ Key Features

- 🔐 Role-Based Authentication
- 👤 Multi-Role User Management (Customer, Seller, Delivery Partner, Admin)
- 🔄 Refund Management
- 🤖 AI-Based Fraud Detection
- 🕸️ Trust Graph for Collusion Detection
- 📊 Fraud Risk Scoring
- 🧠 Explainable AI Decisions
- 🚨 Real-Time Fraud Alerts
- 📈 Admin Analytics Dashboard
- 📑 Fraud Case Management
- ⚖️ Appeal Management Workflow
- 📬 Notification System
- 📋 Reports & Analytics

---

# 🛠️ Technology Stack

| Category | Technology |
|-----------|------------|
| **Frontend** | React.js |
| **Backend** | Spring-Boot |
| **Programming Language** | Java |
| **Relational Database** | MySQL |
| **Graph Database** | Neo4j |
| **Machine Learning** | Scikit-learn, XGBoost |
| **Graph Analytics** | NetworkX, Neo4j Cypher |
| **Authentication** | JWT Authentication |
| **API Testing** | Postman |
| **Version Control** | Git & GitHub |
| **Architecture** | Modular Monolith |
| **Diagram Tools** | Draw.io, dbdiagram.io |

---

# 🏗️ System Design

The platform follows a layered architecture that combines **Machine Learning**, **Graph Intelligence**, and **Explainable AI** to detect coordinated fraud in e-commerce ecosystems.

---

## High-Level Architecture

The following architecture illustrates the complete system, including the presentation layer, application layer, business modules, AI Decision Engine, data layer, and output layer.

<p align="center">
    <img src="docs/ArchitectureDiagram.jpg" width="100%">
</p>

---

## Component Diagram

The component diagram illustrates the internal organization of the FastAPI backend, showing how the business modules interact with the AI Decision Engine and databases.

<p align="center">
    <img src="docs/Component.jpg" width="100%">
</p>

---

## Data Flow Diagram

The Data Flow Diagram (DFD) describes how transaction data flows through the system, beginning with order placement and ending with fraud analysis, decision making, notifications, and appeal handling.

<p align="center">
    <img src="docs/DataFlowDiagram.jpg" width="100%">
</p>

---

## Database Design (ER Diagram)

The relational database schema is implemented using **MySQL**. It manages users, products, orders, fraud cases, and appeals while maintaining relationships between business entities.

<p align="center">
    <img src="docs/DB.png" width="100%">
</p>

---

## Trust Graph Model

The Trust Graph represents relationships among customers, sellers, delivery partners, orders, devices, IP addresses, payment methods, and fraud cases. These relationships enable graph-based anomaly detection and collusion analysis.

<p align="center">
    <img src="docs/TrustGraphDiagram.jpg" width="100%">
</p>

---

## AI Decision Workflow

The AI Decision Engine combines machine learning predictions, graph intelligence, and external validation signals to generate a fraud risk score, explanation, and remediation recommendation.

<p align="center">
    <img src="docs/AIFlowDiagram.jpg" width="100%">
</p>

---

## End-to-End Workflow

This sequence diagram illustrates the complete lifecycle of an order—from customer authentication and order placement through fraud detection, AI analysis, decision making, investigation, and appeal resolution.

<p align="center">
    <img src="docs/EndToEndFlowDiagram.jpg" width="100%">
</p>
