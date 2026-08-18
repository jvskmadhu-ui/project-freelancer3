package com.freelancehub.repository;

import com.freelancehub.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT m FROM ChatMessage m WHERE " +
            "(m.sender.id = :user1Id AND m.recipient.id = :user2Id) OR " +
            "(m.sender.id = :user2Id AND m.recipient.id = :user1Id) " +
            "ORDER BY m.createdAt ASC")
    List<ChatMessage> findConversation(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);

    @Query("SELECT m FROM ChatMessage m WHERE " +
            "(m.sender.id = :user1Id AND m.recipient.id = :user2Id) OR " +
            "(m.sender.id = :user2Id AND m.recipient.id = :user1Id) " +
            "ORDER BY m.createdAt DESC")
    Page<ChatMessage> findConversationPaged(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id, Pageable pageable);

    List<ChatMessage> findByContractIdOrderByCreatedAtAsc(Long contractId);

    long countByRecipientIdAndIsReadFalse(Long recipientId);

    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.recipient.id = :recipientId AND m.sender.id = :senderId AND m.isRead = false")
    long countUnreadFromSender(@Param("recipientId") Long recipientId, @Param("senderId") Long senderId);

    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.recipient.id = :recipientId AND m.sender.id = :senderId AND m.isRead = false")
    void markConversationAsRead(@Param("recipientId") Long recipientId, @Param("senderId") Long senderId);

    @Query("SELECT DISTINCT " +
            "CASE WHEN m.sender.id = :userId THEN m.recipient.id ELSE m.sender.id END " +
            "FROM ChatMessage m WHERE m.sender.id = :userId OR m.recipient.id = :userId")
    List<Long> findDistinctConversationPartnerIds(@Param("userId") Long userId);
}
