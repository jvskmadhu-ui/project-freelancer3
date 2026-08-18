package com.freelancehub.dto;

import com.freelancehub.entity.Proposal.ProposalStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

public class ProposalDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubmitProposalRequest {
        @NotNull(message = "Project ID is required")
        private Long projectId;

        @NotBlank(message = "Cover letter is required")
        private String coverLetter;

        @NotNull(message = "Bid amount is required")
        private BigDecimal bidAmount;

        @NotNull(message = "Estimated days is required")
        private Integer estimatedDays;

        private String proposedMilestonesJson;
        private String portfolioLinks;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProposalResponse {
        private Long id;
        private Long projectId;
        private String projectTitle;
        private Long freelancerId;
        private String freelancerName;
        private String freelancerAvatarUrl;
        private String freelancerTitle;
        private Double freelancerRating;
        private boolean freelancerVerified;
        private Set<String> freelancerSkills;
        private String coverLetter;
        private BigDecimal bidAmount;
        private Integer estimatedDays;
        private String proposedMilestonesJson;
        private String portfolioLinks;
        private ProposalStatus status;
        private LocalDateTime createdAt;
    }
}
