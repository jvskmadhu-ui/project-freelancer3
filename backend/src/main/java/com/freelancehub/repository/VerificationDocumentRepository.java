package com.freelancehub.repository;

import com.freelancehub.entity.VerificationDocument;
import com.freelancehub.entity.VerificationDocument.VerificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VerificationDocumentRepository extends JpaRepository<VerificationDocument, Long> {
    List<VerificationDocument> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<VerificationDocument> findFirstByUserIdOrderByCreatedAtDesc(Long userId);
    Page<VerificationDocument> findByStatus(VerificationStatus status, Pageable pageable);
    long countByStatus(VerificationStatus status);
}
