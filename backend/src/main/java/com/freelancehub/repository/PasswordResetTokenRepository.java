package com.freelancehub.repository;

import com.freelancehub.entity.PasswordResetToken;
import com.freelancehub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findFirstByUserAndIsUsedFalseOrderByCreatedAtDesc(User user);

    Optional<PasswordResetToken> findFirstByUserAndOtpCodeAndIsUsedFalse(User user, String otpCode);

    @Modifying
    @Query("UPDATE PasswordResetToken t SET t.isUsed = true WHERE t.user = :user AND t.isUsed = false")
    void invalidateAllActiveTokensForUser(@Param("user") User user);

    @Modifying
    @Query("DELETE FROM PasswordResetToken t WHERE t.expiryDate < :now OR t.isUsed = true")
    void deleteExpiredOrUsedTokens(@Param("now") LocalDateTime now);
}
