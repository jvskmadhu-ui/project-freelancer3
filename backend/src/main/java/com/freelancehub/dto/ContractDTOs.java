package com.freelancehub.dto;

import com.freelancehub.entity.Contract.ContractStatus;
import com.freelancehub.entity.Milestone.MilestoneStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ContractDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContractResponse {
        private Long id;
        private Long projectId;
        private String projectTitle;
        private Long proposalId;
        private Long clientId;
        private String clientName;
        private String clientEmail;
        private String clientAvatarUrl;
        private Long freelancerId;
        private String freelancerName;
        private String freelancerEmail;
        private String freelancerAvatarUrl;
        private String title;
        private BigDecimal totalAmount;
        private BigDecimal paidAmount;
        private BigDecimal escrowAmount;
        private ContractStatus status;
        private String termsAndConditions;
        private LocalDate startDate;
        private LocalDate endDate;
        private List<MilestoneResponse> milestones;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MilestoneResponse {
        private Long id;
        private Long contractId;
        private String title;
        private String description;
        private BigDecimal amount;
        private Integer milestoneOrder;
        private LocalDate dueDate;
        private MilestoneStatus status;
        private String submissionNotes;
        private String deliverablesUrl;
        private LocalDateTime submittedAt;
        private LocalDateTime approvedAt;
        private LocalDateTime paidAt;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateMilestoneRequest {
        @NotBlank(message = "Title is required")
        private String title;
        private String description;
        @NotNull(message = "Amount is required")
        private BigDecimal amount;
        private LocalDate dueDate;
        private Integer milestoneOrder;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubmitMilestoneWorkRequest {
        @NotBlank(message = "Submission notes are required")
        private String submissionNotes;
        private String deliverablesUrl;
    }
}
