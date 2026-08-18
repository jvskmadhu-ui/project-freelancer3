package com.freelancehub.controller;

import com.freelancehub.dto.ApiResponse;
import com.freelancehub.dto.ProjectDTOs.*;
import com.freelancehub.entity.Project.ProjectStatus;
import com.freelancehub.security.UserPrincipal;
import com.freelancehub.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Endpoints for creating, searching, and managing client projects")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    @Operation(summary = "Create a new project (Client only)")
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateProjectRequest request
    ) {
        ProjectResponse response = projectService.createProject(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Project created successfully", response));
    }

    @GetMapping
    @Operation(summary = "Search and filter projects")
    public ResponseEntity<ApiResponse<Page<ProjectResponse>>> searchProjects(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) String experienceLevel,
            @RequestParam(required = false) BigDecimal minBudget,
            @RequestParam(required = false) BigDecimal maxBudget,
            @RequestParam(required = false) String skill,
            Pageable pageable
    ) {
        Page<ProjectResponse> result = projectService.searchProjects(
                keyword, category, status, experienceLevel, minBudget, maxBudget, skill, pageable
        );
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project details by ID")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(@PathVariable Long id) {
        ProjectResponse response = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/client/my-projects")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    @Operation(summary = "Get list of projects created by current client")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getMyProjects(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<ProjectResponse> projects = projectService.getClientProjects(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(projects));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    @Operation(summary = "Update project status (Client only)")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProjectStatus(
            @PathVariable Long id,
            @RequestParam ProjectStatus status,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ProjectResponse response = projectService.updateProjectStatus(id, principal.getId(), status);
        return ResponseEntity.ok(ApiResponse.ok("Project status updated", response));
    }
}
