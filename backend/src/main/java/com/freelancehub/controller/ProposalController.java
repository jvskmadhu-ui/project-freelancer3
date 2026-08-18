package com.freelancehub.controller;

import com.freelancehub.dto.ApiResponse;
import com.freelancehub.dto.ProposalDTOs.*;
import com.freelancehub.security.UserPrincipal;
import com.freelancehub.service.ProposalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proposals")
@RequiredArgsConstructor
@Tag(name = "Proposals", description = "Endpoints for proposal submission, review, and acceptance")
public class ProposalController {

    private final ProposalService proposalService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_FREELANCER')")
    @Operation(summary = "Submit a proposal for a project (Freelancer only)")
    public ResponseEntity<ApiResponse<ProposalResponse>> submitProposal(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SubmitProposalRequest request
    ) {
        ProposalResponse response = proposalService.submitProposal(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Proposal submitted successfully", response));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get all proposals submitted for a specific project")
    public ResponseEntity<ApiResponse<List<ProposalResponse>>> getProjectProposals(
            @PathVariable Long projectId
    ) {
        List<ProposalResponse> proposals = proposalService.getProjectProposals(projectId);
        return ResponseEntity.ok(ApiResponse.ok(proposals));
    }

    @GetMapping("/my-proposals")
    @PreAuthorize("hasRole('ROLE_FREELANCER')")
    @Operation(summary = "Get current freelancer's submitted proposals")
    public ResponseEntity<ApiResponse<List<ProposalResponse>>> getMyProposals(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<ProposalResponse> proposals = proposalService.getFreelancerProposals(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(proposals));
    }

    @PostMapping("/{proposalId}/accept")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    @Operation(summary = "Accept proposal and create contract (Client only)")
    public ResponseEntity<ApiResponse<ProposalResponse>> acceptProposal(
            @PathVariable Long proposalId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ProposalResponse response = proposalService.acceptProposal(proposalId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Proposal accepted and contract initiated", response));
    }

    @PostMapping("/{proposalId}/reject")
    @PreAuthorize("hasRole('ROLE_CLIENT')")
    @Operation(summary = "Reject proposal (Client only)")
    public ResponseEntity<ApiResponse<ProposalResponse>> rejectProposal(
            @PathVariable Long proposalId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ProposalResponse response = proposalService.rejectProposal(proposalId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Proposal rejected", response));
    }
}
