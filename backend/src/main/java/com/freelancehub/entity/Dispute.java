package com.freelancehub.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "disputes", indexes = {
        @Index(name = "idx_dispute_contract", columnList = "contract_id"),
        @Index(name = "idx_dispute_initiator", columnList = "initiator_id"),
        @Index(name = "idx_dispute_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dispute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "initiator_id", nullable = false)
    private User initiator;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "defendant_id", nullable = false)
    private User defendant;

    @Column(nullable = false, length = 100)
    private String reason; // WORK_NOT_DELIVERED, QUALITY_BELOW_SPEC, UNRESPONSIVE_CLIENT, PAYMENT_WITHHELD, SCOPE_CREEP, OTHER

    @Column(nullable = false, length = 4000)
    private String description;

    @Column(name = "evidence_urls_json", length = 2000)
    private String evidenceUrlsJson;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private DisputeStatus status = DisputeStatus.OPEN;

    @Column(name = "resolution_action", length = 50)
    private String resolutionAction; // REFUND_CLIENT, RELEASE_TO_FREELANCER, SPLIT_ESCROW, DISMISSED

    @Column(name = "resolution_summary", length = 3000)
    private String resolutionSummary;

    @Column(name = "resolved_by_admin_id")
    private Long resolvedByAdminId;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum DisputeStatus {
        OPEN,
        UNDER_REVIEW,
        RESOLVED,
        CLOSED
    }
}
