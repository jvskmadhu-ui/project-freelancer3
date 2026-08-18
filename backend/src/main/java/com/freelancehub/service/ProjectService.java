package com.freelancehub.service;

import com.freelancehub.dto.ProjectDTOs.*;
import com.freelancehub.entity.ClientProfile;
import com.freelancehub.entity.Project;
import com.freelancehub.entity.Project.ProjectStatus;
import com.freelancehub.entity.Skill;
import com.freelancehub.entity.User;
import com.freelancehub.exception.ResourceNotFoundException;
import com.freelancehub.repository.ClientProfileRepository;
import com.freelancehub.repository.ProjectRepository;
import com.freelancehub.repository.SkillRepository;
import com.freelancehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ClientProfileRepository clientProfileRepository;
    private final SkillRepository skillRepository;

    @Transactional
    public ProjectResponse createProject(Long clientId, CreateProjectRequest request) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        Project project = Project.builder()
                .client(client)
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .category(request.getCategory().trim())
                .budgetType(request.getBudgetType())
                .budgetMin(request.getBudgetMin())
                .budgetMax(request.getBudgetMax())
                .experienceLevel(request.getExperienceLevel() != null ? request.getExperienceLevel() : "INTERMEDIATE")
                .estimatedDurationDays(request.getEstimatedDurationDays())
                .deadline(request.getDeadline())
                .status(ProjectStatus.OPEN)
                .attachmentsJson(request.getAttachmentsJson())
                .proposalsCount(0)
                .requiredSkills(new HashSet<>())
                .build();

        if (request.getRequiredSkills() != null) {
            for (String skillName : request.getRequiredSkills()) {
                Skill skill = skillRepository.findByNameIgnoreCase(skillName.trim())
                        .orElseGet(() -> skillRepository.save(Skill.builder().name(skillName.trim()).build()));
                project.getRequiredSkills().add(skill);
            }
        }

        project = projectRepository.save(project);

        // Update client posted count
        clientProfileRepository.findByUserId(clientId).ifPresent(cp -> {
            cp.setProjectsPostedCount(cp.getProjectsPostedCount() + 1);
            clientProfileRepository.save(cp);
        });

        return mapToResponse(project);
    }

    @Transactional(readOnly = true)
    public Page<ProjectResponse> searchProjects(
            String keyword,
            String category,
            ProjectStatus status,
            String experienceLevel,
            BigDecimal minBudget,
            BigDecimal maxBudget,
            String skill,
            Pageable pageable
    ) {
        return projectRepository.searchProjects(
                keyword, category, status, experienceLevel, minBudget, maxBudget, skill, pageable
        ).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return mapToResponse(project);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getClientProjects(Long clientId) {
        return projectRepository.findByClientIdOrderByCreatedAtDesc(clientId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public ProjectResponse updateProjectStatus(Long projectId, Long clientId, ProjectStatus status) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getClient().getId().equals(clientId)) {
            throw new ResourceNotFoundException("Unauthorized to modify this project");
        }

        project.setStatus(status);
        project = projectRepository.save(project);
        return mapToResponse(project);
    }

    public ProjectResponse mapToResponse(Project project) {
        ClientProfile clientProfile = clientProfileRepository.findByUserId(project.getClient().getId()).orElse(null);

        return ProjectResponse.builder()
                .id(project.getId())
                .clientId(project.getClient().getId())
                .clientName(project.getClient().getFullName())
                .clientEmail(project.getClient().getEmail())
                .clientAvatarUrl(project.getClient().getAvatarUrl())
                .clientCompany(clientProfile != null ? clientProfile.getCompanyName() : null)
                .clientVerified(project.getClient().isIdentityVerified())
                .clientRating(clientProfile != null ? clientProfile.getRating() : 5.0)
                .title(project.getTitle())
                .description(project.getDescription())
                .category(project.getCategory())
                .budgetType(project.getBudgetType())
                .budgetMin(project.getBudgetMin())
                .budgetMax(project.getBudgetMax())
                .experienceLevel(project.getExperienceLevel())
                .estimatedDurationDays(project.getEstimatedDurationDays())
                .deadline(project.getDeadline())
                .status(project.getStatus())
                .attachmentsJson(project.getAttachmentsJson())
                .proposalsCount(project.getProposalsCount())
                .requiredSkills(project.getRequiredSkills().stream().map(Skill::getName).collect(Collectors.toSet()))
                .createdAt(project.getCreatedAt())
                .build();
    }
}
