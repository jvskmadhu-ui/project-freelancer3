package com.freelancehub.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "login_audit_logs", indexes = {
        @Index(name = "idx_audit_user", columnList = "user_id"),
        @Index(name = "idx_audit_email", columnList = "email"),
        @Index(name = "idx_audit_created", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 120)
    private String email;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "user_agent", length = 300)
    private String userAgent;

    @Column(name = "device_type", length = 50)
    private String deviceType;

    @Column(length = 100)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AuditStatus status; // SUCCESS, FAILED, SUSPICIOUS, LOCKED, PASSWORD_CHANGED, COMPROMISED_REPORT

    @Column(name = "failure_reason", length = 200)
    private String failureReason;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum AuditStatus {
        SUCCESS,
        FAILED,
        SUSPICIOUS,
        LOCKED,
        PASSWORD_RESET,
        PASSWORD_CHANGED,
        COMPROMISED_LOCK,
        SESSIONS_TERMINATED
    }
}
