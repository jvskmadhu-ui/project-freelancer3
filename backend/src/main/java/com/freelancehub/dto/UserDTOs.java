package com.freelancehub.dto;

import com.freelancehub.entity.Role;
import com.freelancehub.entity.VerificationDocument.VerificationStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class UserDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserProfileDTO {
        private Long id;
        private String email;
        private String fullName;
        private String phone;
        private Role role;
        private String avatarUrl;
        private String location;
        private String timezone;
        private boolean emailVerified;
        private boolean phoneVerified;
        private boolean identityVerified;
        private boolean isSuspended;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerificationDocumentRequest {
        @NotBlank(message = "Document type is required")
        private String documentType; // PASSPORT, NATIONAL_ID, DRIVERS_LICENSE, TAX_ID

        @NotBlank(message = "Document number is required")
        private String documentNumber;

        @NotBlank(message = "Document front image URL is required")
        private String documentFrontUrl;

        private String documentBackUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerificationDocumentResponse {
        private Long id;
        private Long userId;
        private String userName;
        private String userEmail;
        private Role userRole;
        private String documentType;
        private String documentNumber;
        private String documentFrontUrl;
        private String documentBackUrl;
        private VerificationStatus status;
        private String rejectionReason;
        private Long reviewedByAdminId;
        private LocalDateTime reviewedAt;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewKYCRequest {
        @NotBlank(message = "Action is required")
        private String action; // APPROVE or REJECT

        private String rejectionReason;
    }
}
