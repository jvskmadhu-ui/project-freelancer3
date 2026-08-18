package com.freelancehub.service;

import com.freelancehub.dto.ChatDTOs.*;
import com.freelancehub.entity.ChatMessage;
import com.freelancehub.entity.Notification;
import com.freelancehub.entity.User;
import com.freelancehub.exception.BadRequestException;
import com.freelancehub.exception.ResourceNotFoundException;
import com.freelancehub.repository.ChatMessageRepository;
import com.freelancehub.repository.ContractRepository;
import com.freelancehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final ContractRepository contractRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;

    @Transactional
    public ChatMessageResponse sendMessage(Long senderId, SendMessageRequest request) {
        if (senderId.equals(request.getRecipientId())) {
            throw new BadRequestException("You cannot send messages to yourself.");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found"));

        ChatMessage message = ChatMessage.builder()
                .sender(sender)
                .recipient(recipient)
                .contractId(request.getContractId())
                .projectId(request.getProjectId())
                .content(request.getContent().trim())
                .attachmentUrl(request.getAttachmentUrl())
                .attachmentName(request.getAttachmentName())
                .attachmentType(request.getAttachmentType())
                .isRead(false)
                .build();

        message = chatMessageRepository.save(message);
        ChatMessageResponse response = mapToResponse(message);

        // Push real-time message via STOMP WebSocket
        try {
            messagingTemplate.convertAndSendToUser(
                    recipient.getEmail(),
                    "/queue/messages",
                    response
            );
        } catch (Exception e) {
            log.warn("WebSocket delivery error to recipient {}: {}", recipient.getEmail(), e.getMessage());
        }

        return response;
    }

    @Transactional
    public List<ChatMessageResponse> getConversation(Long userId, Long partnerId) {
        // Mark partner messages as read
        chatMessageRepository.markConversationAsRead(userId, partnerId);

        return chatMessageRepository.findConversation(userId, partnerId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ConversationSummaryDTO> getUserConversations(Long userId) {
        List<Long> partnerIds = chatMessageRepository.findDistinctConversationPartnerIds(userId);
        List<ConversationSummaryDTO> summaries = new ArrayList<>();

        for (Long pId : partnerIds) {
            userRepository.findById(pId).ifPresent(partner -> {
                List<ChatMessage> conv = chatMessageRepository.findConversation(userId, pId);
                if (!conv.isEmpty()) {
                    ChatMessage lastMsg = conv.get(conv.size() - 1);
                    long unread = chatMessageRepository.countUnreadFromSender(userId, pId);

                    summaries.add(ConversationSummaryDTO.builder()
                            .partnerId(partner.getId())
                            .partnerName(partner.getFullName())
                            .partnerEmail(partner.getEmail())
                            .partnerAvatarUrl(partner.getAvatarUrl())
                            .partnerRole(partner.getRole().name())
                            .partnerVerified(partner.isIdentityVerified())
                            .lastMessage(lastMsg.getContent())
                            .lastMessageTime(lastMsg.getCreatedAt())
                            .unreadCount(unread)
                            .contractId(lastMsg.getContractId())
                            .build());
                }
            });
        }

        summaries.sort((a, b) -> b.getLastMessageTime().compareTo(a.getLastMessageTime()));
        return summaries;
    }

    @Transactional(readOnly = true)
    public long getUnreadMessagesCount(Long userId) {
        return chatMessageRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    public ChatMessageResponse mapToResponse(ChatMessage msg) {
        return ChatMessageResponse.builder()
                .id(msg.getId())
                .senderId(msg.getSender().getId())
                .senderName(msg.getSender().getFullName())
                .senderAvatarUrl(msg.getSender().getAvatarUrl())
                .recipientId(msg.getRecipient().getId())
                .recipientName(msg.getRecipient().getFullName())
                .recipientAvatarUrl(msg.getRecipient().getAvatarUrl())
                .contractId(msg.getContractId())
                .projectId(msg.getProjectId())
                .content(msg.getContent())
                .attachmentUrl(msg.getAttachmentUrl())
                .attachmentName(msg.getAttachmentName())
                .attachmentType(msg.getAttachmentType())
                .isRead(msg.isRead())
                .createdAt(msg.getCreatedAt())
                .build();
    }
}
