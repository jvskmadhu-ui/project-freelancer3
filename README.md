# FreelanceHub 3D - Enterprise Freelancer & Client Marketplace Platform

[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React 18](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.162.0-black.svg)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

**FreelanceHub 3D** is a modern full-stack web marketplace connecting rigorously verified freelancers with ambitious clients worldwide under bank-grade milestone escrow protection, real-time WebSocket communication, and spatial 3D WebGL user experiences.

---

## 🌟 Key Platform Capabilities

1. **Separate Authentication & Role Guardrails**:
   - Distinct registration and login experiences for `CLIENT`, `FREELANCER`, and `ADMIN`.
   - Stateless JWT authentication with Spring Security and BCrypt encryption.
   - OTP confirmation (Email & SMS) with password recovery.

2. **8-Step Verified User Identity System (KYC)**:
   - Progress tracker: Account Creation ➔ Email Verification ➔ Phone Verification ➔ Profile Setup ➔ Government ID/Passport Upload ➔ Compliance Review ➔ Verified Badge Issue ➔ Periodic Audit.
   - Encrypted document storage with zero public disclosure.

3. **Client Project Creation & Proposal Engine**:
   - Multi-phase milestone definition, budget type configuration (Fixed/Hourly), skills tagging.
   - Freelancer proposal bidding with cover letters and turnaround estimates.
   - Automatic contract genesis upon proposal acceptance.

4. **Multi-Milestone Escrow Payment System**:
   - Integration with Stripe and Razorpay checkout gateways.
   - Escrow holding: funds are locked when a milestone starts and released only upon explicit client approval of submitted deliverables.
   - Cryptographic webhook validation and PDF receipts ledger.

5. **Real-Time WebSocket & STOMP Chat**:
   - One-to-one direct messaging, online status indicators, and typing signals.
   - Project-linked conversations and attachment sharing.

6. **Interactive 3D WebGL Visual Experience**:
   - Three.js futuristic geometric polyhedrons, orbital satellite nodes, and cosmic particle field with mouse-parallax reactivity.
   - Accessibility toggle for reduced motion.

7. **Neutral Dispute Arbitration Center**:
   - Evidence submission, contract freezing, and administrative arbitration.

8. **Admin Governance Command Center**:
   - Live platform financial statistics, user moderation, and KYC review queue.

---

## 📁 System Architecture & Directory Structure

```text
freelancehub/
├── backend/                             # Java Spring Boot 3 Maven Project
│   ├── src/main/java/com/freelancehub/
│   │   ├── config/                      # Security, Web, WebSocket & OpenAPI
│   │   ├── controller/                  # REST API Controllers (Auth, Projects, Payments, Chat...)
│   │   ├── dto/                         # Request and Response Data Transfer Objects
│   │   ├── entity/                      # JPA Entities (User, Contract, Milestone, Dispute...)
│   │   ├── exception/                   # Custom Exceptions & Global Exception Handler
│   │   ├── init/                        # DataInitializer (Pre-seeded Verified Market Data)
│   │   ├── repository/                  # Spring Data JPA Repositories
│   │   ├── security/                    # JWT Utils, Filter & UserPrincipal
│   │   └── service/                     # Business Logic Services
│   ├── src/main/resources/
│   │   ├── application.yml              # Default H2 In-Memory Config (Zero Setup)
│   │   ├── application-mysql.yml        # MySQL Production Profile
│   │   └── application-postgres.yml     # PostgreSQL Production Profile
│   └── pom.xml
│
├── frontend/                            # React 18 + Vite + TailwindCSS + Three.js
│   ├── src/
│   │   ├── components/                  # Navbar, Footer, 3D Canvas, Badges, Modals
│   │   ├── context/                     # AuthContext, NotificationContext
│   │   ├── pages/                       # 29 Full Application Views & Dashboards
│   │   ├── services/                    # Axios API client & Mock Data Fallbacks
│   │   ├── App.jsx                      # Protected Routing Architecture
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   └── schema.sql                       # Full DDL for PostgreSQL & MySQL
├── .env.example                         # Environment Variables Template
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (verified on v24.13.0)
- **Java**: JDK 17+ (Eclipse Temurin JDK 17 installed)
- **Maven**: 3.8+

### 2. Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173** in your browser.

> [!TIP]
> The frontend features an **Interactive Demo Mode** banner with 1-click persona switching between:
> - **Client (Sarah Jenkins - TechCorp Ventures)**
> - **Freelancer (Elena Vance - 3D WebGL Artist)**
> - **Admin (System Administrator)**

### 3. Running the Backend
```bash
cd backend
mvn spring-boot:run
```
The REST API and Swagger documentation will be available at **http://localhost:8080/swagger-ui.html**.

---

## 🔐 Demo Credentials

| Role | Email | Password | Features / State |
| :--- | :--- | :--- | :--- |
| **Client** | `client@techcorp.com` | `Password123!` | Active contracts, project post wizard, escrow funding |
| **Freelancer** | `elena@freelancehub.com` | `Password123!` | 5.0 Rating, verified badge, milestone deliverables |
| **Admin** | `admin@freelancehub.com` | `Password123!` | KYC verification queue, arbitration, stats console |

---

## 📄 License
Licensed under the Apache License, Version 2.0.
