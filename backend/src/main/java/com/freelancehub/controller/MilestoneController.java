package com.freelancehub.controller;

import com.freelancehub.dto.ApiResponse;
import com.freelancehub.dto.ContractDTOs.*;
import com.freelancehub.security.UserPrincipal;
import com.freelancehub.service.MilestoneService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/milestones")
@RequiredArgsConstructor
@Tag(name = "Milestones", description = "Endpoints for managing contract milestones, deliverable submissions, and approvals")
public class MilestoneController {

    private final MilestoneService milestoneService;

    @PostMapping("/contract/{contractId}")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    @Operation(summary = "Add a new milestone to an active contract (Client only)")
    public ResponseEntity<ApiResponse<MilestoneResponse>> addMilestone(
            @PathVariable Long contractId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateMilestoneRequest request
    ) {
        MilestoneResponse response = milestoneService.addMilestone(contractId, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Milestone added successfully", response));
    }

    @PostMapping("/{milestoneId}/submit")
    @PreAuthorize("hasRole('ROLE_FREELANCER')")
    @Operation(summary = "Submit deliverables for milestone review (Freelancer only)")
    public ResponseEntity<ApiResponse<MilestoneResponse>> submitWork(
            @PathVariable Long milestoneId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SubmitMilestoneWorkRequest request
    ) {
        MilestoneResponse response = milestoneService.submitDeliverable(milestoneId, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Deliverables submitted for client review", response));
    }

    @PostMapping("/{milestoneId}/approve")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    @Operation(summary = "Approve milestone deliverable and release funds (Client only)")
    public ResponseEntity<ApiResponse<MilestoneResponse>> approveMilestone(
            @PathVariable Long milestoneId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        MilestoneResponse response = milestoneService.approveAndReleaseMilestone(milestoneId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Milestone approved and funds released to freelancer", response));
    }
}
