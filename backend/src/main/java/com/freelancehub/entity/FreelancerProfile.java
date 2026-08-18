package com.freelancehub.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "freelancer_profiles", indexes = {
        @Index(name = "idx_freelancer_rating", columnList = "rating"),
        @Index(name = "idx_freelancer_rate", columnList = "hourly_rate")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FreelancerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 4000)
    private String overview;

    @Column(name = "hourly_rate", precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @Column(name = "project_base_rate", precision = 10, scale = 2)
    private BigDecimal projectBaseRate;

    @Column(length = 50)
    @Builder.Default
    private String availability = "AVAILABLE_FULL_TIME"; // AVAILABLE_FULL_TIME, AVAILABLE_PART_TIME, NOT_AVAILABLE

    @Column(length = 200)
    private String languages;

    @Column(name = "response_time_hours")
    @Builder.Default
    private Integer responseTimeHours = 2;

    @Column(name = "experience_years")
    @Builder.Default
    private Integer experienceYears = 3;

    @Column(name = "completed_projects_count")
    @Builder.Default
    private Integer completedProjectsCount = 0;

    @Column(name = "success_rate")
    @Builder.Default
    private Double successRate = 100.0;

    @Column(name = "rating")
    @Builder.Default
    private Double rating = 5.0;

    @Column(name = "total_reviews_count")
    @Builder.Default
    private Integer totalReviewsCount = 0;

    @Column(name = "education_json", length = 3000)
    private String educationJson;

    @Column(name = "experience_json", length = 3000)
    private String experienceJson;

    @Column(name = "certifications_json", length = 2000)
    private String certificationsJson;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "freelancer_skills",
            joinColumns = @JoinColumn(name = "freelancer_profile_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private Set<Skill> skills = new HashSet<>();

    @OneToMany(mappedBy = "freelancerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    private List<PortfolioItem> portfolioItems = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
