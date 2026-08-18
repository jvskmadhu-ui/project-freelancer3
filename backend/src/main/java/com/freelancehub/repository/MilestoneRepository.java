package com.freelancehub.repository;

import com.freelancehub.entity.Milestone;
import com.freelancehub.entity.Milestone.MilestoneStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    List<Milestone> findByContractIdOrderByMilestoneOrderAsc(Long contractId);
    List<Milestone> findByContractIdAndStatus(Long contractId, MilestoneStatus status);
}
