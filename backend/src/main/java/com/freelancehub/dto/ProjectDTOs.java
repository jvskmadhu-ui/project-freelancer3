package com.freelancehub.dto;

import com.freelancehub.entity.Project.BudgetType;
import com.freelancehub.entity.Project.ProjectStatus;
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
import java.util.Set;

public class ProjectDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateProjectRequest {
        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Description is required")
        private String description;

        @NotBlank(message = "Category is required")
        private String category;

        @NotNull(message = "Budget type is required")
        private BudgetType budgetType;

        private BigDecimal budgetMin;
        private BigDecimal budgetMax;
        private String experienceLevel;
        private Integer estimatedDurationDays;
        private LocalDate deadline;
        private String attachmentsJson;
        private List<String> requiredSkills;
        private List<MilestoneProposalItem> initialMilestones;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MilestoneProposalItem {
        private String title;
        private String description;
        private BigDecimal amount;
        private LocalDate dueDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectResponse {
        private Long id;
        private Long clientId;
        private String clientName;
        private String clientEmail;
        private String clientAvatarUrl;
        private String clientCompany;
        private boolean clientVerified;
        private Double clientRating;
        private String title;
        private String description;
        private String category;
        private BudgetType budgetType;
        private BigDecimal budgetMin;
        private BigDecimal budgetMax;
        private String experienceLevel;
        private Integer estimatedDurationDays;
        private LocalDate deadline;
        private ProjectStatus status;
        private String attachmentsJson;
        private Integer proposalsCount;
        private Set<String> requiredSkills;
        private LocalDateTime createdAt;
    }
}
