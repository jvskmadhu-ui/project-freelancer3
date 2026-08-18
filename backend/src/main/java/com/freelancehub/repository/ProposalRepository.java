package com.freelancehub.repository;

import com.freelancehub.entity.Proposal;
import com.freelancehub.entity.Proposal.ProposalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    List<Proposal> findByProjectIdOrderByCreatedAtDesc(Long projectId);
    List<Proposal> findByFreelancerIdOrderByCreatedAtDesc(Long freelancerId);
    Optional<Proposal> findByProjectIdAndFreelancerId(Long projectId, Long freelancerId);
    boolean existsByProjectIdAndFreelancerId(Long projectId, Long freelancerId);
    long countByFreelancerId(Long freelancerId);
    long countByFreelancerIdAndStatus(Long freelancerId, ProposalStatus status);
}
