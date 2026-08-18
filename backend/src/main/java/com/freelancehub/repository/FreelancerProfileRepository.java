package com.freelancehub.repository;

import com.freelancehub.entity.FreelancerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface FreelancerProfileRepository extends JpaRepository<FreelancerProfile, Long> {
    Optional<FreelancerProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);

    @Query("SELECT DISTINCT fp FROM FreelancerProfile fp " +
            "JOIN fp.user u " +
            "LEFT JOIN fp.skills s " +
            "WHERE u.isSuspended = false " +
            "AND (:verifiedOnly IS NULL OR :verifiedOnly = false OR u.identityVerified = true) " +
            "AND (:minRate IS NULL OR fp.hourlyRate >= :minRate) " +
            "AND (:maxRate IS NULL OR fp.hourlyRate <= :maxRate) " +
            "AND (:minRating IS NULL OR fp.rating >= :minRating) " +
            "AND (:availability IS NULL OR fp.availability = :availability) " +
            "AND (:skill IS NULL OR LOWER(s.name) = LOWER(:skill)) " +
            "AND (:keyword IS NULL OR LOWER(fp.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "     OR LOWER(fp.overview) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "     OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<FreelancerProfile> searchFreelancers(
            @Param("keyword") String keyword,
            @Param("skill") String skill,
            @Param("minRate") BigDecimal minRate,
            @Param("maxRate") BigDecimal maxRate,
            @Param("minRating") Double minRating,
            @Param("availability") String availability,
            @Param("verifiedOnly") Boolean verifiedOnly,
            Pageable pageable
    );
}
