package com.freelancehub.dto;

import com.freelancehub.entity.PaymentTransaction.PaymentGateway;
import com.freelancehub.entity.PaymentTransaction.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreatePaymentOrderRequest {
        @NotNull(message = "Contract ID is required")
        private Long contractId;

        private Long milestoneId;

        @NotNull(message = "Amount is required")
        private BigDecimal amount;

        @NotNull(message = "Payment gateway is required")
        private PaymentGateway paymentGateway; // STRIPE, RAZORPAY, ESCROW_SIMULATOR

        private String currency;
        private String paymentMethod;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentOrderResponse {
        private Long transactionId;
        private String gatewayOrderId;
        private BigDecimal amount;
        private String currency;
        private PaymentGateway paymentGateway;
        private String clientSecret; // For Stripe
        private String keyId; // For Razorpay
        private String orderDescription;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyPaymentRequest {
        @NotNull(message = "Transaction ID is required")
        private Long transactionId;

        private String gatewayOrderId;
        private String gatewayPaymentId;
        private String gatewaySignature;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentTransactionResponse {
        private Long id;
        private Long contractId;
        private String contractTitle;
        private Long milestoneId;
        private String milestoneTitle;
        private Long payerId;
        private String payerName;
        private Long payeeId;
        private String payeeName;
        private BigDecimal amount;
        private String currency;
        private String paymentMethod;
        private PaymentGateway paymentGateway;
        private String gatewayOrderId;
        private String gatewayPaymentId;
        private PaymentStatus status;
        private String receiptUrl;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WebhookPayload {
        private String event;
        private String paymentId;
        private String orderId;
        private String signature;
        private BigDecimal amount;
        private String status;
    }
}
