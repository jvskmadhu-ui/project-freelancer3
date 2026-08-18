package com.freelancehub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class FreelancerDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FreelancerProfileResponse {
        private Long id;
        private Long userId;
        private String fullName;
        private String email;
        private String avatarUrl;
        private String location;
        private String timezone;
        private boolean identityVerified;
        private String title;
        private String overview;
        private BigDecimal hourlyRate;
        private BigDecimal projectBaseRate;
        private String availability;
        private String languages;
        private Integer responseTimeHours;
        private Integer experienceYears;
        private Integer completedProjectsCount;
        private Double successRate;
        private Double rating;
        private Integer totalReviewsCount;
        private String educationJson;
        private String experienceJson;
        private String certificationsJson;
        private Set<String> skills;
        private List<PortfolioItemDTO> portfolioItems;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateFreelancerProfileRequest {
        private String title;
        private String overview;
        private BigDecimal hourlyRate;
        private BigDecimal projectBaseRate;
        private String availability;
        private String languages;
        private Integer experienceYears;
        private String educationJson;
        private String experienceJson;
        private String certificationsJson;
        private List<String> skills;
        private String location;
        private String timezone;
        private String avatarUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PortfolioItemDTO {
        private Long id;
        private String title;
        private String description;
        private String imageUrl;
        private String projectUrl;
        private String tags;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddPortfolioItemRequest {
        private String title;
        private String description;
        private String imageUrl;
        private String projectUrl;
        private String tags;
    }
}
