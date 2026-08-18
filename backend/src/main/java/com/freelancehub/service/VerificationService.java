package com.freelancehub.service;

import com.freelancehub.dto.UserDTOs.*;
import com.freelancehub.entity.Notification;
import com.freelancehub.entity.User;
import com.freelancehub.entity.VerificationDocument;
import com.freelancehub.entity.VerificationDocument.VerificationStatus;
import com.freelancehub.exception.BadRequestException;
import com.freelancehub.exception.ResourceNotFoundException;
import com.freelancehub.repository.UserRepository;
import com.freelancehub.repository.VerificationDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationDocumentRepository verificationDocumentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public VerificationDocumentResponse submitVerificationDocument(Long userId, VerificationDocumentRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        VerificationDocument doc = VerificationDocument.builder()
                .user(user)
                .documentType(request.getDocumentType())
                .documentNumber(request.getDocumentNumber())
                .documentFrontUrl(request.getDocumentFrontUrl())
                .documentBackUrl(request.getDocumentBackUrl())
                .status(VerificationStatus.PENDING)
                .build();

        doc = verificationDocumentRepository.save(doc);

        notificationService.createNotification(
                user,
                "Verification Document Submitted",
                "Your identity verification document (" + request.getDocumentType() + ") has been submitted and is under admin review.",
                Notification.NotificationType.VERIFICATION,
                "/verification"
        );

        return mapToResponse(doc);
    }

    @Transactional(readOnly = true)
    public List<VerificationDocumentResponse> getUserVerificationHistory(Long userId) {
        return verificationDocumentRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<VerificationDocumentResponse> getPendingKYCDocuments(Pageable pageable) {
        return verificationDocumentRepository.findByStatus(VerificationStatus.PENDING, pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public VerificationDocumentResponse reviewKYCDocument(Long docId, Long adminId, ReviewKYCRequest request) {
        VerificationDocument doc = verificationDocumentRepository.findById(docId)
                .orElseThrow(() -> new ResourceNotFoundException("Verification document not found"));

        User targetUser = doc.getUser();

        if ("APPROVE".equalsIgnoreCase(request.getAction())) {
            doc.setStatus(VerificationStatus.APPROVED);
            doc.setRejectionReason(null);
            targetUser.setIdentityVerified(true);
            userRepository.save(targetUser);

            notificationService.createNotification(
                    targetUser,
                    "Identity Verified Successfully!",
                    "Congratulations! Your identity has been verified by the FreelanceHub Compliance team. Your profile now proudly displays the Verified badge.",
                    Notification.NotificationType.VERIFICATION,
                    "/profile"
            );
        } else if ("REJECT".equalsIgnoreCase(request.getAction())) {
            doc.setStatus(VerificationStatus.REJECTED);
            doc.setRejectionReason(request.getRejectionReason() != null ? request.getRejectionReason() : "Document details could not be validated.");
            targetUser.setIdentityVerified(false);
            userRepository.save(targetUser);

            notificationService.createNotification(
                    targetUser,
                    "Verification Review Notice",
                    "Your identity verification was not approved: " + doc.getRejectionReason() + ". Please resubmit with clear documents.",
                    Notification.NotificationType.VERIFICATION,
                    "/verification"
            );
        } else {
            throw new BadRequestException("Invalid review action. Must be APPROVE or REJECT.");
        }

        doc.setReviewedByAdminId(adminId);
        doc.setReviewedAt(LocalDateTime.now());
        doc = verificationDocumentRepository.save(doc);

        return mapToResponse(doc);
    }

    private VerificationDocumentResponse mapToResponse(VerificationDocument doc) {
        return VerificationDocumentResponse.builder()
                .id(doc.getId())
                .userId(doc.getUser().getId())
                .userName(doc.getUser().getFullName())
                .userEmail(doc.getUser().getEmail())
                .userRole(doc.getUser().getRole())
                .documentType(doc.getDocumentType())
                .documentNumber(doc.getDocumentNumber())
                .documentFrontUrl(doc.getDocumentFrontUrl())
                .documentBackUrl(doc.getDocumentBackUrl())
                .status(doc.getStatus())
                .rejectionReason(doc.getRejectionReason())
                .reviewedByAdminId(doc.getReviewedByAdminId())
                .reviewedAt(doc.getReviewedAt())
                .createdAt(doc.getCreatedAt())
                .build();
    }
}
