package com.freelancehub.controller;

import com.freelancehub.dto.ApiResponse;
import com.freelancehub.dto.ChatDTOs.*;
import com.freelancehub.security.UserPrincipal;
import com.freelancehub.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Tag(name = "Real-Time Chat", description = "Endpoints for private direct messaging, conversation threads, and attachments")
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    @Operation(summary = "Send a message via REST API")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> sendMessage(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SendMessageRequest request
    ) {
        ChatMessageResponse response = chatService.sendMessage(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/conversation/{partnerId}")
    @Operation(summary = "Get conversation history with a specific user")
    public ResponseEntity<ApiResponse<List<ChatMessageResponse>>> getConversation(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long partnerId
    ) {
        List<ChatMessageResponse> messages = chatService.getConversation(principal.getId(), partnerId);
        return ResponseEntity.ok(ApiResponse.ok(messages));
    }

    @GetMapping("/conversations")
    @Operation(summary = "Get all active conversation summaries for current user")
    public ResponseEntity<ApiResponse<List<ConversationSummaryDTO>>> getConversations(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<ConversationSummaryDTO> conversations = chatService.getUserConversations(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(conversations));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get total unread chat messages count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        long unread = chatService.getUnreadMessagesCount(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(unread));
    }
}
