package com.freelancehub.repository;

import com.freelancehub.entity.Dispute;
import com.freelancehub.entity.Dispute.DisputeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    List<Dispute> findByContractIdOrderByCreatedAtDesc(Long contractId);
    List<Dispute> findByInitiatorIdOrDefendantIdOrderByCreatedAtDesc(Long initiatorId, Long defendantId);
    Page<Dispute> findByStatus(DisputeStatus status, Pageable pageable);
    long countByStatus(DisputeStatus status);
}
