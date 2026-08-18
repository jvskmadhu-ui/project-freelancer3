package com.freelancehub.repository;

import com.freelancehub.entity.PaymentTransaction;
import com.freelancehub.entity.PaymentTransaction.PaymentStatus;
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
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    List<PaymentTransaction> findByPayerIdOrderByCreatedAtDesc(Long payerId);
    List<PaymentTransaction> findByPayeeIdOrderByCreatedAtDesc(Long payeeId);
    Page<PaymentTransaction> findByPayerIdOrPayeeIdOrderByCreatedAtDesc(Long payerId, Long payeeId, Pageable pageable);
    Optional<PaymentTransaction> findByGatewayOrderId(String gatewayOrderId);
    Optional<PaymentTransaction> findByGatewayPaymentId(String gatewayPaymentId);
    List<PaymentTransaction> findByContractIdOrderByCreatedAtDesc(Long contractId);
    Page<PaymentTransaction> findByStatus(PaymentStatus status, Pageable pageable);

    @Query("SELECT SUM(p.amount) FROM PaymentTransaction p WHERE p.status = 'SUCCESS'")
    BigDecimal sumTotalPlatformVolume();

    long countByStatus(PaymentStatus status);
}
