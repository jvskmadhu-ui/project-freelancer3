package com.freelancehub.service;

import com.freelancehub.dto.DisputeDTOs.*;
import com.freelancehub.entity.*;
import com.freelancehub.entity.Dispute.DisputeStatus;
import com.freelancehub.exception.BadRequestException;
import com.freelancehub.exception.ResourceNotFoundException;
import com.freelancehub.repository.ContractRepository;
import com.freelancehub.repository.DisputeRepository;
import com.freelancehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DisputeService {

    private final DisputeRepository disputeRepository;
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public DisputeResponse openDispute(Long initiatorId, CreateDisputeRequest request) {
        Contract contract = contractRepository.findById(request.getContractId())
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));

        User initiator = userRepository.findById(initiatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Initiator not found"));

        User defendant;
        if (contract.getClient().getId().equals(initiatorId)) {
            defendant = contract.getFreelancer();
        } else if (contract.getFreelancer().getId().equals(initiatorId)) {
            defendant = contract.getClient();
        } else {
            throw new BadRequestException("You are not a participant in this contract.");
        }

        Dispute dispute = Dispute.builder()
                .contract(contract)
                .initiator(initiator)
                .defendant(defendant)
                .reason(request.getReason())
                .description(request.getDescription().trim())
                .evidenceUrlsJson(request.getEvidenceUrlsJson())
                .status(DisputeStatus.OPEN)
                .build();

        dispute = disputeRepository.save(dispute);

        // Update contract status to DISPUTED
        contract.setStatus(Contract.ContractStatus.DISPUTED);
        contractRepository.save(contract);

        // Notify defendant
        notificationService.createNotification(
                defendant,
                "Dispute Opened for Contract: " + contract.getTitle(),
                initiator.getFullName() + " has opened a dispute regarding this contract. Our compliance team is reviewing it.",
                Notification.NotificationType.DISPUTE_OPENED,
                "/disputes"
        );

        return mapToResponse(dispute);
    }

    @Transactional(readOnly = true)
    public List<DisputeResponse> getUserDisputes(Long userId) {
        return disputeRepository.findByInitiatorIdOrDefendantIdOrderByCreatedAtDesc(userId, userId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<DisputeResponse> getAllDisputesPaged(Pageable pageable) {
        return disputeRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Transactional
    public DisputeResponse resolveDispute(Long disputeId, Long adminId, ResolveDisputeRequest request) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found"));

        dispute.setStatus(DisputeStatus.RESOLVED);
        dispute.setResolutionAction(request.getResolutionAction());
        dispute.setResolutionSummary(request.getResolutionSummary());
        dispute.setResolvedByAdminId(adminId);
        dispute.setResolvedAt(LocalDateTime.now());

        dispute = disputeRepository.save(dispute);

        // Notify both parties
        notificationService.createNotification(
                dispute.getInitiator(),
                "Dispute Resolved: " + dispute.getContract().getTitle(),
                "Resolution decision: " + dispute.getResolutionAction() + " - " + dispute.getResolutionSummary(),
                Notification.NotificationType.DISPUTE_RESOLVED,
                "/disputes"
        );

        notificationService.createNotification(
                dispute.getDefendant(),
                "Dispute Resolved: " + dispute.getContract().getTitle(),
                "Resolution decision: " + dispute.getResolutionAction() + " - " + dispute.getResolutionSummary(),
                Notification.NotificationType.DISPUTE_RESOLVED,
                "/disputes"
        );

        return mapToResponse(dispute);
    }

    public DisputeResponse mapToResponse(Dispute d) {
        return DisputeResponse.builder()
                .id(d.getId())
                .contractId(d.getContract().getId())
                .contractTitle(d.getContract().getTitle())
                .initiatorId(d.getInitiator().getId())
                .initiatorName(d.getInitiator().getFullName())
                .initiatorRole(d.getInitiator().getRole().name())
                .defendantId(d.getDefendant().getId())
                .defendantName(d.getDefendant().getFullName())
                .defendantRole(d.getDefendant().getRole().name())
                .reason(d.getReason())
                .description(d.getDescription())
                .evidenceUrlsJson(d.getEvidenceUrlsJson())
                .status(d.getStatus())
                .resolutionAction(d.getResolutionAction())
                .resolutionSummary(d.getResolutionSummary())
                .resolvedByAdminId(d.getResolvedByAdminId())
                .resolvedAt(d.getResolvedAt())
                .createdAt(d.getCreatedAt())
                .build();
    }
}
