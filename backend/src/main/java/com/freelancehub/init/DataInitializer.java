package com.freelancehub.init;

import com.freelancehub.entity.*;
import com.freelancehub.entity.PaymentTransaction.PaymentGateway;
import com.freelancehub.entity.PaymentTransaction.PaymentStatus;
import com.freelancehub.entity.VerificationDocument.VerificationStatus;
import com.freelancehub.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final PortfolioItemRepository portfolioItemRepository;
    private final ClientProfileRepository clientProfileRepository;
    private final ProjectRepository projectRepository;
    private final ProposalRepository proposalRepository;
    private final ContractRepository contractRepository;
    private final MilestoneRepository milestoneRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final NotificationRepository notificationRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final ReviewRepository reviewRepository;
    private final VerificationDocumentRepository verificationDocumentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already initialized. Skipping seed data generation.");
            return;
        }

        log.info("Seeding FreelanceHub 3D Marketplace initial dataset...");

        // 1. Seed Skills
        Map<String, Skill> skillsMap = new HashMap<>();
        String[] skillNames = {
                "Three.js", "React.js", "WebGL", "Java", "Spring Boot",
                "TypeScript", "Tailwind CSS", "PostgreSQL", "Next.js", "Python",
                "Machine Learning", "Docker", "AWS", "Figma", "UI/UX Design",
                "Flutter", "GraphQL", "Kubernetes", "Node.js", "Stripe API"
        };
        for (String name : skillNames) {
            Skill s = Skill.builder().name(name).category("Technology").build();
            skillsMap.put(name, skillRepository.save(s));
        }

        String defaultHash = passwordEncoder.encode("Password123!");

        // 2. Seed Admin User
        User admin = User.builder()
                .email("admin@freelancehub.com")
                .password(defaultHash)
                .fullName("System Administrator")
                .role(Role.ROLE_ADMIN)
                .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80")
                .location("San Francisco, CA")
                .timezone("PST (UTC-8)")
                .emailVerified(true)
                .phoneVerified(true)
                .identityVerified(true)
                .build();
        admin = userRepository.save(admin);

        // 3. Seed Verified Clients
        User clientUser1 = User.builder()
                .email("client@techcorp.com")
                .password(defaultHash)
                .fullName("Sarah Jenkins")
                .phone("+1 (555) 234-5678")
                .role(Role.ROLE_CLIENT)
                .avatarUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80")
                .location("New York, NY")
                .timezone("EST (UTC-5)")
                .emailVerified(true)
                .phoneVerified(true)
                .identityVerified(true)
                .build();
        clientUser1 = userRepository.save(clientUser1);

        ClientProfile clientProfile1 = ClientProfile.builder()
                .user(clientUser1)
                .companyName("TechCorp Ventures")
                .website("https://techcorp-ventures.io")
                .industry("Fintech & AI")
                .description("Silicon Valley venture studio building next-generation Web3 and fintech platforms.")
                .totalSpent(BigDecimal.valueOf(48500.00))
                .projectsPostedCount(5)
                .hiresCount(8)
                .rating(4.9)
                .totalReviewsCount(6)
                .build();
        clientProfileRepository.save(clientProfile1);

        User clientUser2 = User.builder()
                .email("client2@nexus.io")
                .password(defaultHash)
                .fullName("Robert Vance")
                .phone("+1 (555) 876-5432")
                .role(Role.ROLE_CLIENT)
                .avatarUrl("https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80")
                .location("Austin, TX")
                .timezone("CST (UTC-6)")
                .emailVerified(true)
                .phoneVerified(true)
                .identityVerified(true)
                .build();
        clientUser2 = userRepository.save(clientUser2);

        ClientProfile clientProfile2 = ClientProfile.builder()
                .user(clientUser2)
                .companyName("Nexus Dynamics")
                .website("https://nexusdynamics.com")
                .industry("Enterprise Software")
                .description("Global cloud modernization partner for Fortune 500 enterprises.")
                .totalSpent(BigDecimal.valueOf(27000.00))
                .projectsPostedCount(3)
                .hiresCount(4)
                .rating(5.0)
                .totalReviewsCount(3)
                .build();
        clientProfileRepository.save(clientProfile2);

        // 4. Seed Verified Top-Tier Freelancers
        // Freelancer 1: 3D / WebGL Engineer
        User freeUser1 = User.builder()
                .email("elena@freelancehub.com")
                .password(defaultHash)
                .fullName("Elena Vance")
                .phone("+1 (555) 345-6789")
                .role(Role.ROLE_FREELANCER)
                .avatarUrl("https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80")
                .location("Seattle, WA")
                .timezone("PST (UTC-8)")
                .emailVerified(true)
                .phoneVerified(true)
                .identityVerified(true)
                .build();
        freeUser1 = userRepository.save(freeUser1);

        FreelancerProfile freeProf1 = FreelancerProfile.builder()
                .user(freeUser1)
                .title("Lead 3D WebGL & Three.js Creative Technologist")
                .overview("Specializing in high-performance WebGL 3D visualizations, interactive product configurators, and shader magic for top global brands. Over 8 years of experience engineering immersive spatial web experiences with React Three Fiber, GLSL, and WebGPU.")
                .hourlyRate(BigDecimal.valueOf(85))
                .projectBaseRate(BigDecimal.valueOf(2500))
                .availability("AVAILABLE_FULL_TIME")
                .languages("English (Native), French (Fluent)")
                .responseTimeHours(1)
                .experienceYears(8)
                .completedProjectsCount(48)
                .successRate(99.0)
                .rating(5.0)
                .totalReviewsCount(42)
                .skills(new HashSet<>(Arrays.asList(skillsMap.get("Three.js"), skillsMap.get("WebGL"), skillsMap.get("React.js"), skillsMap.get("TypeScript"), skillsMap.get("Tailwind CSS"))))
                .build();
        freeProf1 = freelancerProfileRepository.save(freeProf1);

        portfolioItemRepository.save(PortfolioItem.builder()
                .freelancerProfile(freeProf1)
                .title("Cyberpunk 3D Hologram City")
                .description("Interactive procedural city generator running 60fps in WebGL with custom bloom shaders.")
                .imageUrl("https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80")
                .projectUrl("https://threejs-demo.freelancehub3d.com")
                .tags("Three.js, WebGL, GLSL")
                .build());

        portfolioItemRepository.save(PortfolioItem.builder()
                .freelancerProfile(freeProf1)
                .title("Spatial 3D Watch Configurator")
                .description("Real-time luxury watch customization portal featuring PBR materials and environment lighting.")
                .imageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80")
                .projectUrl("https://configurator-demo.freelancehub3d.com")
                .tags("React Three Fiber, PBR")
                .build());

        // Freelancer 2: Full-Stack Architect
        User freeUser2 = User.builder()
                .email("alex@freelancehub.com")
                .password(defaultHash)
                .fullName("Alex Chen")
                .phone("+1 (555) 456-7890")
                .role(Role.ROLE_FREELANCER)
                .avatarUrl("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80")
                .location("Vancouver, Canada")
                .timezone("PST (UTC-8)")
                .emailVerified(true)
                .phoneVerified(true)
                .identityVerified(true)
                .build();
        freeUser2 = userRepository.save(freeUser2);

        FreelancerProfile freeProf2 = FreelancerProfile.builder()
                .user(freeUser2)
                .title("Principal Full-Stack Architect (Spring Boot & React)")
                .overview("Architecting enterprise-scale distributed systems, mission-critical REST microservices, real-time WebSocket infrastructures, and robust React frontend web applications.")
                .hourlyRate(BigDecimal.valueOf(95))
                .projectBaseRate(BigDecimal.valueOf(3500))
                .availability("AVAILABLE_FULL_TIME")
                .languages("English (Fluent), Mandarin (Native)")
                .responseTimeHours(2)
                .experienceYears(10)
                .completedProjectsCount(62)
                .successRate(100.0)
                .rating(4.9)
                .totalReviewsCount(55)
                .skills(new HashSet<>(Arrays.asList(skillsMap.get("Java"), skillsMap.get("Spring Boot"), skillsMap.get("React.js"), skillsMap.get("PostgreSQL"), skillsMap.get("Docker"), skillsMap.get("AWS"))))
                .build();
        freeProf2 = freelancerProfileRepository.save(freeProf2);

        // Freelancer 3: AI & ML Specialist
        User freeUser3 = User.builder()
                .email("priya@freelancehub.com")
                .password(defaultHash)
                .fullName("Priya Sharma")
                .phone("+1 (555) 567-8901")
                .role(Role.ROLE_FREELANCER)
                .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80")
                .location("London, UK")
                .timezone("GMT (UTC+0)")
                .emailVerified(true)
                .phoneVerified(true)
                .identityVerified(true)
                .build();
        freeUser3 = userRepository.save(freeUser3);

        FreelancerProfile freeProf3 = FreelancerProfile.builder()
                .user(freeUser3)
                .title("AI & GenAI Solutions Engineer | LLMs & RAG")
                .overview("Designing bespoke Generative AI agents, vector retrieval pipelines, fine-tuned LLM architectures, and seamless Python/Spring backend integrations.")
                .hourlyRate(BigDecimal.valueOf(110))
                .projectBaseRate(BigDecimal.valueOf(4000))
                .availability("AVAILABLE_PART_TIME")
                .languages("English (Fluent), Hindi (Native)")
                .responseTimeHours(1)
                .experienceYears(6)
                .completedProjectsCount(34)
                .successRate(100.0)
                .rating(5.0)
                .totalReviewsCount(29)
                .skills(new HashSet<>(Arrays.asList(skillsMap.get("Python"), skillsMap.get("Machine Learning"), skillsMap.get("AWS"), skillsMap.get("Docker"), skillsMap.get("PostgreSQL"))))
                .build();
        freeProf3 = freelancerProfileRepository.save(freeProf3);

        // Freelancer 4: UI/UX Designer
        User freeUser4 = User.builder()
                .email("marcus@freelancehub.com")
                .password(defaultHash)
                .fullName("Marcus Rossi")
                .phone("+39 06 698 12345")
                .role(Role.ROLE_FREELANCER)
                .avatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80")
                .location("Milan, Italy")
                .timezone("CET (UTC+1)")
                .emailVerified(true)
                .phoneVerified(true)
                .identityVerified(true)
                .build();
        freeUser4 = userRepository.save(freeUser4);

        FreelancerProfile freeProf4 = FreelancerProfile.builder()
                .user(freeUser4)
                .title("Senior Product Designer & Design Systems Lead")
                .overview("Designing sleek, modern, futuristic SaaS interfaces and design systems. Former design lead at European fintech unicorn.")
                .hourlyRate(BigDecimal.valueOf(75))
                .projectBaseRate(BigDecimal.valueOf(2000))
                .availability("AVAILABLE_FULL_TIME")
                .languages("English (Fluent), Italian (Native)")
                .responseTimeHours(2)
                .experienceYears(7)
                .completedProjectsCount(51)
                .successRate(98.0)
                .rating(4.9)
                .totalReviewsCount(44)
                .skills(new HashSet<>(Arrays.asList(skillsMap.get("Figma"), skillsMap.get("UI/UX Design"), skillsMap.get("Tailwind CSS"), skillsMap.get("React.js"))))
                .build();
        freeProf4 = freelancerProfileRepository.save(freeProf4);

        // Freelancer 5 (Pending KYC verification for test flow)
        User freeUser5 = User.builder()
                .email("david@freelancehub.com")
                .password(defaultHash)
                .fullName("David Okafor")
                .phone("+234 802 345 6789")
                .role(Role.ROLE_FREELANCER)
                .avatarUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80")
                .location("Lagos, Nigeria")
                .timezone("WAT (UTC+1)")
                .emailVerified(true)
                .phoneVerified(true)
                .identityVerified(false)
                .build();
        freeUser5 = userRepository.save(freeUser5);

        FreelancerProfile freeProf5 = FreelancerProfile.builder()
                .user(freeUser5)
                .title("Cross-Platform Mobile Flutter Engineer")
                .overview("Building fast, fluid iOS and Android apps with Flutter, Firebase, and GraphQL.")
                .hourlyRate(BigDecimal.valueOf(65))
                .projectBaseRate(BigDecimal.valueOf(1800))
                .availability("AVAILABLE_FULL_TIME")
                .languages("English (Fluent)")
                .responseTimeHours(3)
                .experienceYears(5)
                .completedProjectsCount(22)
                .successRate(97.0)
                .rating(4.8)
                .totalReviewsCount(19)
                .skills(new HashSet<>(Arrays.asList(skillsMap.get("Flutter"), skillsMap.get("GraphQL"), skillsMap.get("React.js"), skillsMap.get("Node.js"))))
                .build();
        freelancerProfileRepository.save(freeProf5);

        // Verification Document for David (Pending Admin Review)
        verificationDocumentRepository.save(VerificationDocument.builder()
                .user(freeUser5)
                .documentType("PASSPORT")
                .documentNumber("A09876543")
                .documentFrontUrl("https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80")
                .status(VerificationStatus.PENDING)
                .build());

        // Verification Document for Elena (Approved)
        verificationDocumentRepository.save(VerificationDocument.builder()
                .user(freeUser1)
                .documentType("NATIONAL_ID")
                .documentNumber("USA-987654321")
                .documentFrontUrl("https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80")
                .status(VerificationStatus.APPROVED)
                .reviewedByAdminId(admin.getId())
                .reviewedAt(LocalDateTime.now().minusMonths(3))
                .build());

        // 5. Seed Projects
        Project project1 = Project.builder()
                .client(clientUser1)
                .title("Next-Gen 3D Interactive Metaverse Showcase")
                .description("We are looking for an elite 3D WebGL developer to build a futuristic, interactive 3D hero showcase for our upcoming fintech platform. Must support WebGL shaders, particle simulations, camera panning on scroll, and mobile responsive optimization.")
                .category("3D & Graphics")
                .budgetType(Project.BudgetType.FIXED)
                .budgetMin(BigDecimal.valueOf(3000))
                .budgetMax(BigDecimal.valueOf(5000))
                .experienceLevel("EXPERT")
                .estimatedDurationDays(21)
                .deadline(LocalDate.now().plusDays(25))
                .status(Project.ProjectStatus.IN_PROGRESS)
                .proposalsCount(3)
                .requiredSkills(new HashSet<>(Arrays.asList(skillsMap.get("Three.js"), skillsMap.get("WebGL"), skillsMap.get("React.js"), skillsMap.get("TypeScript"))))
                .build();
        project1 = projectRepository.save(project1);

        Project project2 = Project.builder()
                .client(clientUser1)
                .title("Enterprise Distributed Microservices Migration")
                .description("Migrate legacy monolith to resilient Spring Boot 3 microservices with PostgreSQL, Docker containerization, and AWS ECS deployment. Need full automated unit and integration test coverage.")
                .category("Web Development")
                .budgetType(Project.BudgetType.FIXED)
                .budgetMin(BigDecimal.valueOf(6000))
                .budgetMax(BigDecimal.valueOf(9000))
                .experienceLevel("EXPERT")
                .estimatedDurationDays(45)
                .deadline(LocalDate.now().plusDays(50))
                .status(Project.ProjectStatus.OPEN)
                .proposalsCount(2)
                .requiredSkills(new HashSet<>(Arrays.asList(skillsMap.get("Java"), skillsMap.get("Spring Boot"), skillsMap.get("PostgreSQL"), skillsMap.get("Docker"), skillsMap.get("AWS"))))
                .build();
        project2 = projectRepository.save(project2);

        Project project3 = Project.builder()
                .client(clientUser2)
                .title("Fintech SaaS UI/UX Overhaul & Modern Design System")
                .description("Complete redesign of our web app dashboard and user flows. Deliver pixel-perfect Figma components, design tokens, responsive guidelines, and interactive clickable prototypes.")
                .category("UI/UX Design")
                .budgetType(Project.BudgetType.FIXED)
                .budgetMin(BigDecimal.valueOf(2500))
                .budgetMax(BigDecimal.valueOf(4000))
                .experienceLevel("INTERMEDIATE")
                .estimatedDurationDays(14)
                .deadline(LocalDate.now().plusDays(20))
                .status(Project.ProjectStatus.OPEN)
                .proposalsCount(1)
                .requiredSkills(new HashSet<>(Arrays.asList(skillsMap.get("Figma"), skillsMap.get("UI/UX Design"), skillsMap.get("Tailwind CSS"))))
                .build();
        projectRepository.save(project3);

        // 6. Seed Proposal and Contract for Project 1
        Proposal proposal1 = Proposal.builder()
                .project(project1)
                .freelancer(freeUser1)
                .coverLetter("Hi Sarah, I would love to build this 3D showcase for TechCorp! I have built dozens of WebGL experiences and custom GLSL shaders with 60fps mobile performance. Looking forward to collaborating.")
                .bidAmount(BigDecimal.valueOf(4500.00))
                .estimatedDays(18)
                .status(Proposal.ProposalStatus.ACCEPTED)
                .build();
        proposal1 = proposalRepository.save(proposal1);

        Contract contract1 = Contract.builder()
                .project(project1)
                .proposal(proposal1)
                .client(clientUser1)
                .freelancer(freeUser1)
                .title("Next-Gen 3D Interactive Metaverse Showcase")
                .totalAmount(BigDecimal.valueOf(4500.00))
                .paidAmount(BigDecimal.valueOf(1500.00))
                .escrowAmount(BigDecimal.valueOf(3000.00))
                .status(Contract.ContractStatus.ACTIVE)
                .startDate(LocalDate.now().minusDays(5))
                .endDate(LocalDate.now().plusDays(15))
                .milestones(new ArrayList<>())
                .build();
        contract1 = contractRepository.save(contract1);

        // Milestones for Contract 1
        Milestone m1 = Milestone.builder()
                .contract(contract1)
                .title("Milestone 1: 3D Scene Architecture & Asset Shaders")
                .description("Setup Three.js canvas, lighting, camera controls, and custom procedural shaders.")
                .amount(BigDecimal.valueOf(1500.00))
                .milestoneOrder(1)
                .dueDate(LocalDate.now().minusDays(1))
                .status(Milestone.MilestoneStatus.PAID)
                .submissionNotes("Completed 3D scene architecture, particle systems, and shader pipelines.")
                .deliverablesUrl("https://github.com/techcorp/3d-scene-v1")
                .submittedAt(LocalDateTime.now().minusDays(2))
                .approvedAt(LocalDateTime.now().minusDays(1))
                .paidAt(LocalDateTime.now().minusDays(1))
                .build();
        milestoneRepository.save(m1);

        Milestone m2 = Milestone.builder()
                .contract(contract1)
                .title("Milestone 2: Interactive Animations & Scroll Reactivity")
                .description("Implement smooth camera panning, hover interactivity, and state transitions.")
                .amount(BigDecimal.valueOf(1500.00))
                .milestoneOrder(2)
                .dueDate(LocalDate.now().plusDays(7))
                .status(Milestone.MilestoneStatus.IN_PROGRESS)
                .build();
        milestoneRepository.save(m2);

        Milestone m3 = Milestone.builder()
                .contract(contract1)
                .title("Milestone 3: Final Polish, Mobile Optimization & Delivery")
                .description("LOD optimizations, responsive canvas scaling, and deployment.")
                .amount(BigDecimal.valueOf(1500.00))
                .milestoneOrder(3)
                .dueDate(LocalDate.now().plusDays(15))
                .status(Milestone.MilestoneStatus.PENDING)
                .build();
        milestoneRepository.save(m3);

        // 7. Seed Payment Transactions
        paymentTransactionRepository.save(PaymentTransaction.builder()
                .contract(contract1)
                .milestone(m1)
                .payer(clientUser1)
                .payee(freeUser1)
                .amount(BigDecimal.valueOf(1500.00))
                .currency("USD")
                .paymentMethod("CREDIT_CARD")
                .paymentGateway(PaymentGateway.STRIPE)
                .gatewayOrderId("ORD_STR_9812471923")
                .gatewayPaymentId("ch_3M451890123")
                .status(PaymentStatus.SUCCESS)
                .receiptUrl("https://receipts.freelancehub3d.com/rec_001.pdf")
                .build());

        paymentTransactionRepository.save(PaymentTransaction.builder()
                .contract(contract1)
                .milestone(m2)
                .payer(clientUser1)
                .payee(freeUser1)
                .amount(BigDecimal.valueOf(1500.00))
                .currency("USD")
                .paymentMethod("CREDIT_CARD")
                .paymentGateway(PaymentGateway.STRIPE)
                .gatewayOrderId("ORD_STR_9812471924")
                .gatewayPaymentId("ch_3M451890124")
                .status(PaymentStatus.SUCCESS)
                .receiptUrl("https://receipts.freelancehub3d.com/rec_002.pdf")
                .build());

        // 8. Seed Chat Messages between Sarah (Client) and Elena (Freelancer)
        chatMessageRepository.save(ChatMessage.builder()
                .sender(clientUser1)
                .recipient(freeUser1)
                .contractId(contract1.getId())
                .projectId(project1.getId())
                .content("Hi Elena! Welcome aboard. We're very excited to see the 3D scene come together!")
                .isRead(true)
                .createdAt(LocalDateTime.now().minusDays(4))
                .build());

        chatMessageRepository.save(ChatMessage.builder()
                .sender(freeUser1)
                .recipient(clientUser1)
                .contractId(contract1.getId())
                .projectId(project1.getId())
                .content("Thanks Sarah! I've already set up the initial WebGL scene with particle nodes and lighting. Milestone 1 deliverables are ready for your review!")
                .isRead(true)
                .createdAt(LocalDateTime.now().minusDays(2))
                .build());

        chatMessageRepository.save(ChatMessage.builder()
                .sender(clientUser1)
                .recipient(freeUser1)
                .contractId(contract1.getId())
                .projectId(project1.getId())
                .content("The performance is breathtaking! I've just approved Milestone 1 and released the payment. Keep up the amazing work!")
                .isRead(false)
                .createdAt(LocalDateTime.now().minusHours(3))
                .build());

        // 9. Seed System Notifications
        notificationRepository.save(Notification.builder()
                .user(freeUser1)
                .title("Milestone 1 Payment Released")
                .message("Client Sarah Jenkins approved Milestone 1. $1,500.00 has been transferred to your earnings balance.")
                .type(Notification.NotificationType.PAYMENT_SUCCESS)
                .linkUrl("/contracts/" + contract1.getId())
                .isRead(false)
                .build());

        notificationRepository.save(Notification.builder()
                .user(clientUser1)
                .title("New Message from Elena Vance")
                .message("Elena: Thanks Sarah! I've already set up the initial WebGL scene...")
                .type(Notification.NotificationType.NEW_MESSAGE)
                .linkUrl("/chat?partner=" + freeUser1.getId())
                .isRead(false)
                .build());

        log.info("FreelanceHub 3D dataset initialization complete.");
    }
}
