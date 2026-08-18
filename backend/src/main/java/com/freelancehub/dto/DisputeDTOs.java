package com.freelancehub.dto;

import com.freelancehub.entity.Dispute.DisputeStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class DisputeDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateDisputeRequest {
        @NotNull(message = "Contract ID is required")
        private Long contractId;

        @NotBlank(message = "Reason is required")
        private String reason;

        @NotBlank(message = "Description is required")
        private String description;

        private String evidenceUrlsJson;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResolveDisputeRequest {
        @NotBlank(message = "Resolution action is required")
        private String resolutionAction; // REFUND_CLIENT, RELEASE_TO_FREELANCER, SPLIT_ESCROW, DISMISSED

        @NotBlank(message = "Resolution summary is required")
        private String resolutionSummary;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DisputeResponse {
        private Long id;
        private Long contractId;
        private String contractTitle;
        private Long initiatorId;
        private String initiatorName;
        private String initiatorRole;
        private Long defendantId;
        private String defendantName;
        private String defendantRole;
        private String reason;
        private String description;
        private String evidenceUrlsJson;
        private DisputeStatus status;
        private String resolutionAction;
        private String resolutionSummary;
        private Long resolvedByAdminId;
        private LocalDateTime resolvedAt;
        private LocalDateTime createdAt;
    }
}
