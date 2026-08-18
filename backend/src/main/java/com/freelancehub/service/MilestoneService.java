package com.freelancehub.service;

import com.freelancehub.dto.ContractDTOs.*;
import com.freelancehub.entity.*;
import com.freelancehub.entity.Milestone.MilestoneStatus;
import com.freelancehub.exception.BadRequestException;
import com.freelancehub.exception.ResourceNotFoundException;
import com.freelancehub.repository.ClientProfileRepository;
import com.freelancehub.repository.ContractRepository;
import com.freelancehub.repository.FreelancerProfileRepository;
import com.freelancehub.repository.MilestoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final ContractRepository contractRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final ClientProfileRepository clientProfileRepository;
    private final NotificationService notificationService;

    @Transactional
    public MilestoneResponse addMilestone(Long contractId, Long clientId, CreateMilestoneRequest request) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));

        if (!contract.getClient().getId().equals(clientId)) {
            throw new BadRequestException("Unauthorized to modify contract milestones");
        }

        int nextOrder = contract.getMilestones().size() + 1;

        Milestone milestone = Milestone.builder()
                .contract(contract)
                .title(request.getTitle())
                .description(request.getDescription())
                .amount(request.getAmount())
                .dueDate(request.getDueDate())
                .milestoneOrder(request.getMilestoneOrder() != null ? request.getMilestoneOrder() : nextOrder)
                .status(MilestoneStatus.PENDING)
                .build();

        milestone = milestoneRepository.save(milestone);

        // Update contract total
        contract.setTotalAmount(contract.getTotalAmount().add(request.getAmount()));
        contractRepository.save(contract);

        return mapToResponse(milestone);
    }

    @Transactional
    public MilestoneResponse submitDeliverable(Long milestoneId, Long freelancerId, SubmitMilestoneWorkRequest request) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found"));

        Contract contract = milestone.getContract();
        if (!contract.getFreelancer().getId().equals(freelancerId)) {
            throw new BadRequestException("Unauthorized to submit work for this milestone");
        }

        milestone.setSubmissionNotes(request.getSubmissionNotes());
        milestone.setDeliverablesUrl(request.getDeliverablesUrl());
        milestone.setSubmittedAt(LocalDateTime.now());
        milestone.setStatus(MilestoneStatus.SUBMITTED);

        milestone = milestoneRepository.save(milestone);

        // Notify client
        notificationService.createNotification(
                contract.getClient(),
                "Milestone Work Submitted",
                contract.getFreelancer().getFullName() + " submitted deliverables for milestone: " + milestone.getTitle(),
                Notification.NotificationType.MILESTONE_SUBMITTED,
                "/contracts/" + contract.getId()
        );

        return mapToResponse(milestone);
    }

    @Transactional
    public MilestoneResponse approveAndReleaseMilestone(Long milestoneId, Long clientId) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found"));

        Contract contract = milestone.getContract();
        if (!contract.getClient().getId().equals(clientId)) {
            throw new BadRequestException("Unauthorized to approve this milestone");
        }

        milestone.setStatus(MilestoneStatus.PAID);
        milestone.setApprovedAt(LocalDateTime.now());
        milestone.setPaidAt(LocalDateTime.now());
        milestone = milestoneRepository.save(milestone);

        // Update contract paid amount
        contract.setPaidAmount(contract.getPaidAmount().add(milestone.getAmount()));
        if (contract.getEscrowAmount().compareTo(milestone.getAmount()) >= 0) {
            contract.setEscrowAmount(contract.getEscrowAmount().subtract(milestone.getAmount()));
        }

        // Check if all milestones are paid -> mark contract completed
        List<Milestone> allMilestones = milestoneRepository.findByContractIdOrderByMilestoneOrderAsc(contract.getId());
        boolean allDone = allMilestones.stream().allMatch(m -> m.getStatus() == MilestoneStatus.PAID);

        if (allDone) {
            contract.setStatus(Contract.ContractStatus.COMPLETED);
            contract.getProject().setStatus(Project.ProjectStatus.COMPLETED);

            // Update stats
            freelancerProfileRepository.findByUserId(contract.getFreelancer().getId()).ifPresent(fp -> {
                fp.setCompletedProjectsCount(fp.getCompletedProjectsCount() + 1);
                freelancerProfileRepository.save(fp);
            });

            clientProfileRepository.findByUserId(clientId).ifPresent(cp -> {
                cp.setTotalSpent(cp.getTotalSpent().add(contract.getTotalAmount()));
                cp.setHiresCount(cp.getHiresCount() + 1);
                clientProfileRepository.save(cp);
            });

            notificationService.createNotification(
                    contract.getClient(),
                    "Project Completed!",
                    "Contract for '" + contract.getTitle() + "' is fully completed. Please leave a review for the freelancer.",
                    Notification.NotificationType.PROJECT_COMPLETED,
                    "/reviews?project=" + contract.getProject().getId()
            );
        }

        contractRepository.save(contract);

        // Notify freelancer of funds release
        notificationService.createNotification(
                contract.getFreelancer(),
                "Payment Released: $" + milestone.getAmount(),
                "The client approved milestone '" + milestone.getTitle() + "' and released $" + milestone.getAmount() + " to your balance.",
                Notification.NotificationType.PAYMENT_SUCCESS,
                "/contracts/" + contract.getId()
        );

        return mapToResponse(milestone);
    }

    public MilestoneResponse mapToResponse(Milestone m) {
        return MilestoneResponse.builder()
                .id(m.getId())
                .contractId(m.getContract().getId())
                .title(m.getTitle())
                .description(m.getDescription())
                .amount(m.getAmount())
                .milestoneOrder(m.getMilestoneOrder())
                .dueDate(m.getDueDate())
                .status(m.getStatus())
                .submissionNotes(m.getSubmissionNotes())
                .deliverablesUrl(m.getDeliverablesUrl())
                .submittedAt(m.getSubmittedAt())
                .approvedAt(m.getApprovedAt())
                .paidAt(m.getPaidAt())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
