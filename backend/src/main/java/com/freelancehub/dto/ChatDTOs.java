package com.freelancehub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class ChatDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SendMessageRequest {
        @NotNull(message = "Recipient ID is required")
        private Long recipientId;

        private Long contractId;
        private Long projectId;

        @NotBlank(message = "Message content is required")
        private String content;

        private String attachmentUrl;
        private String attachmentName;
        private String attachmentType;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatMessageResponse {
        private Long id;
        private Long senderId;
        private String senderName;
        private String senderAvatarUrl;
        private Long recipientId;
        private String recipientName;
        private String recipientAvatarUrl;
        private Long contractId;
        private Long projectId;
        private String content;
        private String attachmentUrl;
        private String attachmentName;
        private String attachmentType;
        private boolean isRead;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConversationSummaryDTO {
        private Long partnerId;
        private String partnerName;
        private String partnerEmail;
        private String partnerAvatarUrl;
        private String partnerRole;
        private boolean partnerVerified;
        private String lastMessage;
        private LocalDateTime lastMessageTime;
        private long unreadCount;
        private Long contractId;
        private String contractTitle;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TypingSignal {
        private Long senderId;
        private Long recipientId;
        private boolean isTyping;
    }
}
