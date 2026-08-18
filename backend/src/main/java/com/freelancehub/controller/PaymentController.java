package com.freelancehub.controller;

import com.freelancehub.dto.ApiResponse;
import com.freelancehub.dto.PaymentDTOs.*;
import com.freelancehub.security.UserPrincipal;
import com.freelancehub.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments & Escrow", description = "Endpoints for creating payment gateway orders, escrow funding, and transaction ledgers")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    @Operation(summary = "Create a payment gateway order to fund contract or milestone in escrow")
    public ResponseEntity<ApiResponse<PaymentOrderResponse>> createOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreatePaymentOrderRequest request
    ) {
        PaymentOrderResponse response = paymentService.createPaymentOrder(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Payment order initiated", response));
    }

    @PostMapping("/verify")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    @Operation(summary = "Verify payment gateway signature and lock funds into escrow")
    public ResponseEntity<ApiResponse<PaymentTransactionResponse>> verifyPayment(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody VerifyPaymentRequest request
    ) {
        PaymentTransactionResponse response = paymentService.verifyAndCapturePayment(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Payment verified and securely locked in escrow", response));
    }

    @PostMapping("/webhook")
    @Operation(summary = "Payment Gateway Webhook Endpoint")
    public ResponseEntity<ApiResponse<String>> handleWebhook(@RequestBody WebhookPayload payload) {
        paymentService.processWebhook(payload);
        return ResponseEntity.ok(ApiResponse.ok("Webhook processed", null));
    }

    @GetMapping("/history")
    @Operation(summary = "Get user payment and escrow transaction history")
    public ResponseEntity<ApiResponse<List<PaymentTransactionResponse>>> getPaymentHistory(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<PaymentTransactionResponse> history = paymentService.getUserTransactions(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(history));
    }

    @GetMapping("/history/paged")
    @Operation(summary = "Get paginated payment transaction history")
    public ResponseEntity<ApiResponse<Page<PaymentTransactionResponse>>> getPaymentHistoryPaged(
            @AuthenticationPrincipal UserPrincipal principal,
            Pageable pageable
    ) {
        Page<PaymentTransactionResponse> history = paymentService.getUserTransactionsPaged(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.ok(history));
    }
}
