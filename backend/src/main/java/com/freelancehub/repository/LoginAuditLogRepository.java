package com.freelancehub.repository;

import com.freelancehub.entity.LoginAuditLog;
import com.freelancehub.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoginAuditLogRepository extends JpaRepository<LoginAuditLog, Long> {

    List<LoginAuditLog> findTop10ByUserOrderByCreatedAtDesc(User user);

    List<LoginAuditLog> findTop10ByEmailOrderByCreatedAtDesc(String email);

    Page<LoginAuditLog> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
}
