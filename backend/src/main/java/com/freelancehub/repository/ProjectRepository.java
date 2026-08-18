package com.freelancehub.repository;

import com.freelancehub.entity.Project;
import com.freelancehub.entity.Project.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByClientIdOrderByCreatedAtDesc(Long clientId);
    Page<Project> findByClientId(Long clientId, Pageable pageable);
    List<Project> findByStatus(ProjectStatus status);

    @Query("SELECT DISTINCT p FROM Project p " +
            "LEFT JOIN p.requiredSkills s " +
            "WHERE (:status IS NULL OR p.status = :status) " +
            "AND (:category IS NULL OR LOWER(p.category) = LOWER(:category)) " +
            "AND (:experienceLevel IS NULL OR p.experienceLevel = :experienceLevel) " +
            "AND (:minBudget IS NULL OR p.budgetMax >= :minBudget) " +
            "AND (:maxBudget IS NULL OR p.budgetMin <= :maxBudget) " +
            "AND (:skill IS NULL OR LOWER(s.name) = LOWER(:skill)) " +
            "AND (:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "     OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Project> searchProjects(
            @Param("keyword") String keyword,
            @Param("category") String category,
            @Param("status") ProjectStatus status,
            @Param("experienceLevel") String experienceLevel,
            @Param("minBudget") BigDecimal minBudget,
            @Param("maxBudget") BigDecimal maxBudget,
            @Param("skill") String skill,
            Pageable pageable
    );

    long countByStatus(ProjectStatus status);
}
