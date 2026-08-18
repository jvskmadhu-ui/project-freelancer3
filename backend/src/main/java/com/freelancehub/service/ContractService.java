package com.freelancehub.service;

import com.freelancehub.dto.ContractDTOs.*;
import com.freelancehub.entity.Contract;
import com.freelancehub.entity.Contract.ContractStatus;
import com.freelancehub.entity.Milestone;
import com.freelancehub.exception.ResourceNotFoundException;
import com.freelancehub.repository.ContractRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;

    @Transactional(readOnly = true)
    public ContractResponse getContractById(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with id: " + contractId));
        return mapToResponse(contract);
    }

    @Transactional(readOnly = true)
    public List<ContractResponse> getClientContracts(Long clientId) {
        return contractRepository.findByClientIdOrderByCreatedAtDesc(clientId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ContractResponse> getFreelancerContracts(Long freelancerId) {
        return contractRepository.findByFreelancerIdOrderByCreatedAtDesc(freelancerId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ContractResponse updateContractStatus(Long contractId, ContractStatus status) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));

        contract.setStatus(status);
        contract = contractRepository.save(contract);
        return mapToResponse(contract);
    }

    public ContractResponse mapToResponse(Contract contract) {
        List<MilestoneResponse> milestoneResponses = contract.getMilestones().stream()
                .map(this::mapMilestoneToResponse)
                .toList();

        return ContractResponse.builder()
                .id(contract.getId())
                .projectId(contract.getProject().getId())
                .projectTitle(contract.getProject().getTitle())
                .proposalId(contract.getProposal().getId())
                .clientId(contract.getClient().getId())
                .clientName(contract.getClient().getFullName())
                .clientEmail(contract.getClient().getEmail())
                .clientAvatarUrl(contract.getClient().getAvatarUrl())
                .freelancerId(contract.getFreelancer().getId())
                .freelancerName(contract.getFreelancer().getFullName())
                .freelancerEmail(contract.getFreelancer().getEmail())
                .freelancerAvatarUrl(contract.getFreelancer().getAvatarUrl())
                .title(contract.getTitle())
                .totalAmount(contract.getTotalAmount())
                .paidAmount(contract.getPaidAmount())
                .escrowAmount(contract.getEscrowAmount())
                .status(contract.getStatus())
                .termsAndConditions(contract.getTermsAndConditions())
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .milestones(milestoneResponses)
                .createdAt(contract.getCreatedAt())
                .build();
    }

    public MilestoneResponse mapMilestoneToResponse(Milestone m) {
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
