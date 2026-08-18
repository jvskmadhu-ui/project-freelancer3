package com.freelancehub.repository;

import com.freelancehub.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRevieweeIdOrderByCreatedAtDesc(Long revieweeId);
    Page<Review> findByRevieweeIdOrderByCreatedAtDesc(Long revieweeId, Pageable pageable);
    List<Review> findByReviewerIdOrderByCreatedAtDesc(Long reviewerId);
    Optional<Review> findByProjectIdAndReviewerId(Long projectId, Long reviewerId);
    boolean existsByProjectIdAndReviewerId(Long projectId, Long reviewerId);

    @Query("SELECT AVG(r.overallRating) FROM Review r WHERE r.reviewee.id = :revieweeId")
    Double calculateAverageRatingForUser(@Param("revieweeId") Long revieweeId);

    long countByRevieweeId(Long revieweeId);
}
