package com.freelancehub.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class ReviewDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateReviewRequest {
        @NotNull(message = "Project ID is required")
        private Long projectId;

        @NotNull(message = "Reviewee ID is required")
        private Long revieweeId;

        @NotNull
        @DecimalMin("1.0")
        @DecimalMax("5.0")
        private Double communicationRating;

        @NotNull
        @DecimalMin("1.0")
        @DecimalMax("5.0")
        private Double qualityRating;

        @NotNull
        @DecimalMin("1.0")
        @DecimalMax("5.0")
        private Double timelinessRating;

        @NotNull
        @DecimalMin("1.0")
        @DecimalMax("5.0")
        private Double professionalismRating;

        @NotBlank(message = "Feedback text is required")
        private String feedback;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewResponse {
        private Long id;
        private Long projectId;
        private String projectTitle;
        private Long reviewerId;
        private String reviewerName;
        private String reviewerAvatarUrl;
        private Long revieweeId;
        private String revieweeName;
        private Double communicationRating;
        private Double qualityRating;
        private Double timelinessRating;
        private Double professionalismRating;
        private Double overallRating;
        private String feedback;
        private LocalDateTime createdAt;
    }
}
