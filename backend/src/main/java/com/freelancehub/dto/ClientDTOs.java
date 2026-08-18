package com.freelancehub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ClientDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClientProfileResponse {
        private Long id;
        private Long userId;
        private String fullName;
        private String email;
        private String avatarUrl;
        private String location;
        private String timezone;
        private boolean identityVerified;
        private String companyName;
        private String website;
        private String industry;
        private String description;
        private BigDecimal totalSpent;
        private Integer projectsPostedCount;
        private Integer hiresCount;
        private Double rating;
        private Integer totalReviewsCount;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateClientProfileRequest {
        private String companyName;
        private String website;
        private String industry;
        private String description;
        private String location;
        private String timezone;
        private String avatarUrl;
    }
}
