package com.freelancehub.repository;

import com.freelancehub.entity.Contract;
import com.freelancehub.entity.Contract.ContractStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    List<Contract> findByClientIdOrderByCreatedAtDesc(Long clientId);
    List<Contract> findByFreelancerIdOrderByCreatedAtDesc(Long freelancerId);
    Page<Contract> findByClientId(Long clientId, Pageable pageable);
    Page<Contract> findByFreelancerId(Long freelancerId, Pageable pageable);
    Optional<Contract> findByProjectId(Long projectId);

    long countByClientIdAndStatus(Long clientId, ContractStatus status);
    long countByFreelancerIdAndStatus(Long freelancerId, ContractStatus status);

    @Query("SELECT SUM(c.totalAmount) FROM Contract c WHERE c.client.id = :clientId AND c.status = 'COMPLETED'")
    BigDecimal sumTotalSpentByClientId(@Param("clientId") Long clientId);

    @Query("SELECT SUM(c.paidAmount) FROM Contract c WHERE c.freelancer.id = :freelancerId")
    BigDecimal sumEarningsByFreelancerId(@Param("freelancerId") Long freelancerId);
}
