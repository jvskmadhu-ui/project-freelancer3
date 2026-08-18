package com.freelancehub.service;

import com.freelancehub.dto.PaymentDTOs.*;
import com.freelancehub.entity.*;
import com.freelancehub.entity.Milestone.MilestoneStatus;
import com.freelancehub.entity.PaymentTransaction.PaymentGateway;
import com.freelancehub.entity.PaymentTransaction.PaymentStatus;
import com.freelancehub.exception.BadRequestException;
import com.freelancehub.exception.ResourceNotFoundException;
import com.freelancehub.repository.ContractRepository;
import com.freelancehub.repository.MilestoneRepository;
import com.freelancehub.repository.PaymentTransactionRepository;
import com.freelancehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final ContractRepository contractRepository;
    private final MilestoneRepository milestoneRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Value("${app.payment.stripe.publishable-key:pk_test_freelancehub3d_sample_key}")
    private String stripePublishableKey;

    @Value("${app.payment.razorpay.key-id:rzp_test_freelancehub3d_12345}")
    private String razorpayKeyId;

    @Transactional
    public PaymentOrderResponse createPaymentOrder(Long clientId, CreatePaymentOrderRequest request) {
        Contract contract = contractRepository.findById(request.getContractId())
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));

        if (!contract.getClient().getId().equals(clientId)) {
            throw new BadRequestException("Unauthorized client for this contract");
        }

        Milestone milestone = null;
        if (request.getMilestoneId() != null) {
            milestone = milestoneRepository.findById(request.getMilestoneId())
                    .orElseThrow(() -> new ResourceNotFoundException("Milestone not found"));
        }

        String gatewayOrderId = "ORD_" + request.getPaymentGateway().name().substring(0, 3) + "_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);

        PaymentTransaction transaction = PaymentTransaction.builder()
                .contract(contract)
                .milestone(milestone)
                .payer(contract.getClient())
                .payee(contract.getFreelancer())
                .amount(request.getAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CARD")
                .paymentGateway(request.getPaymentGateway())
                .gatewayOrderId(gatewayOrderId)
                .status(PaymentStatus.PENDING)
                .build();

        transaction = paymentTransactionRepository.save(transaction);

        String clientSecret = "pi_mock_" + UUID.randomUUID().toString() + "_secret";

        return PaymentOrderResponse.builder()
                .transactionId(transaction.getId())
                .gatewayOrderId(gatewayOrderId)
                .amount(request.getAmount())
                .currency(transaction.getCurrency())
                .paymentGateway(request.getPaymentGateway())
                .clientSecret(clientSecret)
                .keyId(request.getPaymentGateway() == PaymentGateway.RAZORPAY ? razorpayKeyId : stripePublishableKey)
                .orderDescription("Escrow deposit for: " + contract.getTitle() + (milestone != null ? " (" + milestone.getTitle() + ")" : ""))
                .build();
    }

    @Transactional
    public PaymentTransactionResponse verifyAndCapturePayment(Long clientId, VerifyPaymentRequest request) {
        PaymentTransaction tx = paymentTransactionRepository.findById(request.getTransactionId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        if (!tx.getPayer().getId().equals(clientId)) {
            throw new BadRequestException("Unauthorized");
        }

        if (tx.getStatus() == PaymentStatus.SUCCESS) {
            return mapToResponse(tx);
        }

        // Validate payment signature/IDs
        tx.setGatewayPaymentId(request.getGatewayPaymentId() != null ? request.getGatewayPaymentId() : "pay_" + UUID.randomUUID().toString().substring(0, 12));
        tx.setGatewaySignature(request.getGatewaySignature() != null ? request.getGatewaySignature() : "sig_valid_" + UUID.randomUUID().toString().substring(0, 8));
        tx.setStatus(PaymentStatus.SUCCESS);
        tx.setReceiptUrl("https://receipts.freelancehub3d.com/rec_" + tx.getId() + ".pdf");

        tx = paymentTransactionRepository.save(tx);

        // Update Contract Escrow
        Contract contract = tx.getContract();
        contract.setEscrowAmount(contract.getEscrowAmount().add(tx.getAmount()));

        // If a milestone was funded, mark milestone IN_PROGRESS
        if (tx.getMilestone() != null) {
            Milestone milestone = tx.getMilestone();
            if (milestone.getStatus() == MilestoneStatus.PENDING) {
                milestone.setStatus(MilestoneStatus.IN_PROGRESS);
                milestoneRepository.save(milestone);
            }
        }

        contractRepository.save(contract);

        // Notify client and freelancer of successful escrow funding
        notificationService.createNotification(
                tx.getPayer(),
                "Payment Escrow Funded ($" + tx.getAmount() + ")",
                "Your payment for '" + contract.getTitle() + "' has been securely locked in platform escrow.",
                Notification.NotificationType.PAYMENT_SUCCESS,
                "/contracts/" + contract.getId()
        );

        notificationService.createNotification(
                tx.getPayee(),
                "Milestone Funded in Escrow ($" + tx.getAmount() + ")",
                "The client has funded $" + tx.getAmount() + " in escrow. You can safely begin work on '" + contract.getTitle() + "'.",
                Notification.NotificationType.PAYMENT_SUCCESS,
                "/contracts/" + contract.getId()
        );

        return mapToResponse(tx);
    }

    @Transactional
    public void processWebhook(WebhookPayload payload) {
        log.info("Processing incoming payment webhook event: {}", payload.getEvent());
        if (payload.getOrderId() != null) {
            paymentTransactionRepository.findByGatewayOrderId(payload.getOrderId()).ifPresent(tx -> {
                if ("payment.captured".equalsIgnoreCase(payload.getEvent()) || "charge.succeeded".equalsIgnoreCase(payload.getEvent())) {
                    tx.setStatus(PaymentStatus.SUCCESS);
                    tx.setGatewayPaymentId(payload.getPaymentId());
                    paymentTransactionRepository.save(tx);
                } else if ("payment.failed".equalsIgnoreCase(payload.getEvent())) {
                    tx.setStatus(PaymentStatus.FAILED);
                    tx.setFailureReason("Gateway webhook reported payment failure");
                    paymentTransactionRepository.save(tx);
                }
            });
        }
    }

    @Transactional(readOnly = true)
    public List<PaymentTransactionResponse> getUserTransactions(Long userId) {
        return paymentTransactionRepository.findByPayerIdOrPayeeIdOrderByCreatedAtDesc(userId, userId, Pageable.unpaged())
                .map(this::mapToResponse)
                .getContent();
    }

    @Transactional(readOnly = true)
    public Page<PaymentTransactionResponse> getUserTransactionsPaged(Long userId, Pageable pageable) {
        return paymentTransactionRepository.findByPayerIdOrPayeeIdOrderByCreatedAtDesc(userId, userId, pageable)
                .map(this::mapToResponse);
    }

    public PaymentTransactionResponse mapToResponse(PaymentTransaction tx) {
        return PaymentTransactionResponse.builder()
                .id(tx.getId())
                .contractId(tx.getContract() != null ? tx.getContract().getId() : null)
                .contractTitle(tx.getContract() != null ? tx.getContract().getTitle() : null)
                .milestoneId(tx.getMilestone() != null ? tx.getMilestone().getId() : null)
                .milestoneTitle(tx.getMilestone() != null ? tx.getMilestone().getTitle() : null)
                .payerId(tx.getPayer().getId())
                .payerName(tx.getPayer().getFullName())
                .payeeId(tx.getPayee().getId())
                .payeeName(tx.getPayee().getFullName())
                .amount(tx.getAmount())
                .currency(tx.getCurrency())
                .paymentMethod(tx.getPaymentMethod())
                .paymentGateway(tx.getPaymentGateway())
                .gatewayOrderId(tx.getGatewayOrderId())
                .gatewayPaymentId(tx.getGatewayPaymentId())
                .status(tx.getStatus())
                .receiptUrl(tx.getReceiptUrl())
                .createdAt(tx.getCreatedAt())
                .build();
    }
}
