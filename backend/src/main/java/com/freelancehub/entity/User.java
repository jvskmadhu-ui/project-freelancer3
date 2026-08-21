package com.freelancehub.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_email", columnList = "email"),
        @Index(name = "idx_user_role", columnList = "role"),
        @Index(name = "idx_user_verified", columnList = "is_identity_verified")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(length = 30)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Role role;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(length = 100)
    private String location;

    @Column(length = 50)
    private String timezone;

    @Builder.Default
    @Column(name = "is_email_verified", nullable = false)
    private boolean emailVerified = false;

    @Builder.Default
    @Column(name = "is_phone_verified", nullable = false)
    private boolean phoneVerified = false;

    @Builder.Default
    @Column(name = "is_identity_verified", nullable = false)
    private boolean identityVerified = false;

    @Builder.Default
    @Column(name = "is_suspended", nullable = false)
    private boolean isSuspended = false;

    @Column(name = "email_otp", length = 10)
    @JsonIgnore
    private String emailOtp;

    @Column(name = "phone_otp", length = 10)
    @JsonIgnore
    private String phoneOtp;

    @Column(name = "otp_expiry")
    @JsonIgnore
    private LocalDateTime otpExpiry;

    @Builder.Default
    @Column(name = "failed_login_attempts", nullable = false)
    private int failedLoginAttempts = 0;

    @Column(name = "lockout_until")
    private LocalDateTime lockoutUntil;

    @Column(name = "password_changed_at")
    private LocalDateTime passwordChangedAt;

    @Builder.Default
    @Column(name = "is_account_locked", nullable = false)
    private boolean isAccountLocked = false;

    @Column(name = "security_question", length = 200)
    private String securityQuestion;

    @JsonIgnore
    @Column(name = "security_answer", length = 200)
    private String securityAnswer;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public boolean isCurrentlyLocked() {
        if (isAccountLocked) return true;
        if (lockoutUntil != null && LocalDateTime.now().isBefore(lockoutUntil)) {
            return true;
        }
        return false;
    }
}
