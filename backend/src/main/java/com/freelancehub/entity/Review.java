package com.freelancehub.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews", indexes = {
        @Index(name = "idx_review_project", columnList = "project_id"),
        @Index(name = "idx_review_reviewer", columnList = "reviewer_id"),
        @Index(name = "idx_review_reviewee", columnList = "reviewee_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewee_id", nullable = false)
    private User reviewee;

    @Column(name = "communication_rating", nullable = false)
    private Double communicationRating;

    @Column(name = "quality_rating", nullable = false)
    private Double qualityRating;

    @Column(name = "timeliness_rating", nullable = false)
    private Double timelinessRating;

    @Column(name = "professionalism_rating", nullable = false)
    private Double professionalismRating;

    @Column(name = "overall_rating", nullable = false)
    private Double overallRating;

    @Column(nullable = false, length = 2000)
    private String feedback;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
