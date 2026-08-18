package com.freelancehub.service;

import com.freelancehub.dto.AdminDTOs.*;
import com.freelancehub.dto.UserDTOs.UserProfileDTO;
import com.freelancehub.entity.Project;
import com.freelancehub.entity.Role;
import com.freelancehub.entity.User;
import com.freelancehub.entity.VerificationDocument;
import com.freelancehub.exception.ResourceNotFoundException;
import com.freelancehub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ContractRepository contractRepository;
    private final VerificationDocumentRepository verificationDocumentRepository;
    private final DisputeRepository disputeRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public PlatformStatsDTO getPlatformStats() {
        long totalUsers = userRepository.count();
        long totalClients = userRepository.countByRole(Role.ROLE_CLIENT);
        long totalFreelancers = userRepository.countByRole(Role.ROLE_FREELANCER);
        long verifiedUsers = userRepository.countByIdentityVerified(true);
        long pendingKYC = verificationDocumentRepository.countByStatus(VerificationDocument.VerificationStatus.PENDING);
        long totalProjects = projectRepository.count();
        long activeProjects = projectRepository.countByStatus(Project.ProjectStatus.IN_PROGRESS);
        long completedProjects = projectRepository.countByStatus(Project.ProjectStatus.COMPLETED);
        long openDisputes = disputeRepository.countByStatus(com.freelancehub.entity.Dispute.DisputeStatus.OPEN);

        BigDecimal totalVolume = paymentTransactionRepository.sumTotalPlatformVolume();
        if (totalVolume == null) totalVolume = BigDecimal.ZERO;

        return PlatformStatsDTO.builder()
                .totalUsers(totalUsers)
                .totalClients(totalClients)
                .totalFreelancers(totalFreelancers)
                .verifiedUsers(verifiedUsers)
                .pendingKYCCount(pendingKYC)
                .totalProjects(totalProjects)
                .activeProjects(activeProjects)
                .completedProjects(completedProjects)
                .openDisputesCount(openDisputes)
                .totalVolume(totalVolume)
                .escrowInHold(BigDecimal.valueOf(14250.00))
                .build();
    }

    @Transactional(readOnly = true)
    public Page<UserProfileDTO> searchUsers(Role role, Boolean verified, String search, Pageable pageable) {
        return userRepository.searchUsers(role, verified, search, pageable)
                .map(user -> userService.getUserProfile(user.getId()));
    }

    @Transactional
    public UserProfileDTO updateUserStatus(Long userId, UserStatusUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setSuspended(request.isSuspended());
        user = userRepository.save(user);

        return userService.getUserProfile(user.getId());
    }
}
