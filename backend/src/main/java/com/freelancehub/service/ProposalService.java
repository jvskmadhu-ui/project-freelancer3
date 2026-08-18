package com.freelancehub.service;

import com.freelancehub.dto.ProposalDTOs.*;
import com.freelancehub.entity.*;
import com.freelancehub.entity.Proposal.ProposalStatus;
import com.freelancehub.exception.BadRequestException;
import com.freelancehub.exception.ResourceNotFoundException;
import com.freelancehub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProposalService {

    private final ProposalRepository proposalRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final ContractRepository contractRepository;
    private final MilestoneRepository milestoneRepository;
    private final NotificationService notificationService;

    @Transactional
    public ProposalResponse submitProposal(Long freelancerId, SubmitProposalRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (project.getStatus() != Project.ProjectStatus.OPEN) {
            throw new BadRequestException("This project is no longer accepting proposals.");
        }

        if (proposalRepository.existsByProjectIdAndFreelancerId(request.getProjectId(), freelancerId)) {
            throw new BadRequestException("You have already submitted a proposal for this project.");
        }

        User freelancer = userRepository.findById(freelancerId)
                .orElseThrow(() -> new ResourceNotFoundException("Freelancer not found"));

        Proposal proposal = Proposal.builder()
                .project(project)
                .freelancer(freelancer)
                .coverLetter(request.getCoverLetter().trim())
                .bidAmount(request.getBidAmount())
                .estimatedDays(request.getEstimatedDays())
                .proposedMilestonesJson(request.getProposedMilestonesJson())
                .portfolioLinks(request.getPortfolioLinks())
                .status(ProposalStatus.PENDING)
                .build();

        proposal = proposalRepository.save(proposal);

        // Update project proposals counter
        project.setProposalsCount(project.getProposalsCount() + 1);
        projectRepository.save(project);

        // Send real-time notification to client
        notificationService.createNotification(
                project.getClient(),
                "New Proposal Received",
                freelancer.getFullName() + " submitted a proposal for '" + project.getTitle() + "' ($" + proposal.getBidAmount() + ")",
                Notification.NotificationType.NEW_PROPOSAL,
                "/proposals?project=" + project.getId()
        );

        return mapToResponse(proposal);
    }

    @Transactional(readOnly = true)
    public List<ProposalResponse> getProjectProposals(Long projectId) {
        return proposalRepository.findByProjectIdOrderByCreatedAtDesc(projectId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProposalResponse> getFreelancerProposals(Long freelancerId) {
        return proposalRepository.findByFreelancerIdOrderByCreatedAtDesc(freelancerId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ProposalResponse acceptProposal(Long proposalId, Long clientId) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));

        Project project = proposal.getProject();
        if (!project.getClient().getId().equals(clientId)) {
            throw new BadRequestException("You are not authorized to accept proposals for this project.");
        }

        if (proposal.getStatus() != ProposalStatus.PENDING) {
            throw new BadRequestException("Proposal is already " + proposal.getStatus());
        }

        proposal.setStatus(ProposalStatus.ACCEPTED);
        proposalRepository.save(proposal);

        // Update project status to IN_PROGRESS
        project.setStatus(Project.ProjectStatus.IN_PROGRESS);
        projectRepository.save(project);

        // Reject other pending proposals
        List<Proposal> otherProposals = proposalRepository.findByProjectIdOrderByCreatedAtDesc(project.getId());
        for (Proposal other : otherProposals) {
            if (!other.getId().equals(proposal.getId()) && other.getStatus() == ProposalStatus.PENDING) {
                other.setStatus(ProposalStatus.REJECTED);
                proposalRepository.save(other);
                notificationService.createNotification(
                        other.getFreelancer(),
                        "Proposal Update",
                        "The client selected another proposal for project: " + project.getTitle(),
                        Notification.NotificationType.PROPOSAL_REJECTED,
                        "/projects/" + project.getId()
                );
            }
        }

        // Automatically create Contract
        Contract contract = Contract.builder()
                .project(project)
                .proposal(proposal)
                .client(project.getClient())
                .freelancer(proposal.getFreelancer())
                .title(project.getTitle())
                .totalAmount(proposal.getBidAmount())
                .paidAmount(BigDecimal.ZERO)
                .escrowAmount(BigDecimal.ZERO)
                .status(Contract.ContractStatus.ACTIVE)
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusDays(proposal.getEstimatedDays()))
                .milestones(new ArrayList<>())
                .build();

        contract = contractRepository.save(contract);

        // Create default Milestone
        Milestone defaultMilestone = Milestone.builder()
                .contract(contract)
                .title("Full Project Delivery: " + project.getTitle())
                .description("Complete project deliverables according to agreed proposal specification.")
                .amount(proposal.getBidAmount())
                .milestoneOrder(1)
                .dueDate(contract.getEndDate())
                .status(Milestone.MilestoneStatus.PENDING)
                .build();

        milestoneRepository.save(defaultMilestone);

        // Notify freelancer
        notificationService.createNotification(
                proposal.getFreelancer(),
                "Proposal Accepted! Contract Started",
                "Congratulations! Your proposal for '" + project.getTitle() + "' has been accepted by " + project.getClient().getFullName(),
                Notification.NotificationType.PROPOSAL_ACCEPTED,
                "/contracts/" + contract.getId()
        );

        return mapToResponse(proposal);
    }

    @Transactional
    public ProposalResponse rejectProposal(Long proposalId, Long clientId) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));

        if (!proposal.getProject().getClient().getId().equals(clientId)) {
            throw new BadRequestException("Unauthorized");
        }

        proposal.setStatus(ProposalStatus.REJECTED);
        proposalRepository.save(proposal);

        notificationService.createNotification(
                proposal.getFreelancer(),
                "Proposal Update",
                "Your proposal for '" + proposal.getProject().getTitle() + "' was not selected.",
                Notification.NotificationType.PROPOSAL_REJECTED,
                "/projects/" + proposal.getProject().getId()
        );

        return mapToResponse(proposal);
    }

    public ProposalResponse mapToResponse(Proposal proposal) {
        FreelancerProfile profile = freelancerProfileRepository.findByUserId(proposal.getFreelancer().getId()).orElse(null);

        return ProposalResponse.builder()
                .id(proposal.getId())
                .projectId(proposal.getProject().getId())
                .projectTitle(proposal.getProject().getTitle())
                .freelancerId(proposal.getFreelancer().getId())
                .freelancerName(proposal.getFreelancer().getFullName())
                .freelancerAvatarUrl(proposal.getFreelancer().getAvatarUrl())
                .freelancerTitle(profile != null ? profile.getTitle() : "Freelancer")
                .freelancerRating(profile != null ? profile.getRating() : 5.0)
                .freelancerVerified(proposal.getFreelancer().isIdentityVerified())
                .freelancerSkills(profile != null ? profile.getSkills().stream().map(Skill::getName).collect(Collectors.toSet()) : null)
                .coverLetter(proposal.getCoverLetter())
                .bidAmount(proposal.getBidAmount())
                .estimatedDays(proposal.getEstimatedDays())
                .proposedMilestonesJson(proposal.getProposedMilestonesJson())
                .portfolioLinks(proposal.getPortfolioLinks())
                .status(proposal.getStatus())
                .createdAt(proposal.getCreatedAt())
                .build();
    }
}
