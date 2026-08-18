package com.freelancehub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

public class AdminDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlatformStatsDTO {
        private long totalUsers;
        private long totalClients;
        private long totalFreelancers;
        private long verifiedUsers;
        private long pendingKYCCount;
        private long totalProjects;
        private long activeProjects;
        private long completedProjects;
        private long openDisputesCount;
        private BigDecimal totalVolume;
        private BigDecimal escrowInHold;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserStatusUpdateRequest {
        private boolean isSuspended;
        private String reason;
    }
}
