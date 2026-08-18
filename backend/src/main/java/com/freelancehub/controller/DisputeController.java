package com.freelancehub.controller;

import com.freelancehub.dto.ApiResponse;
import com.freelancehub.dto.DisputeDTOs.*;
import com.freelancehub.security.UserPrincipal;
import com.freelancehub.service.DisputeService;
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

import java.util.List;

@RestController
@RequestMapping("/api/disputes")
@RequiredArgsConstructor
@Tag(name = "Dispute Resolution", description = "Endpoints for raising contract disputes, submitting evidence, and admin arbitration")
public class DisputeController {

    private final DisputeService disputeService;

    @PostMapping
    @Operation(summary = "Raise a new dispute on a contract")
    public ResponseEntity<ApiResponse<DisputeResponse>> openDispute(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateDisputeRequest request
    ) {
        DisputeResponse response = disputeService.openDispute(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Dispute opened. FreelanceHub Mediation team notified.", response));
    }

    @GetMapping("/my-disputes")
    @Operation(summary = "Get list of disputes where current user is initiator or defendant")
    public ResponseEntity<ApiResponse<List<DisputeResponse>>> getMyDisputes(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<DisputeResponse> disputes = disputeService.getUserDisputes(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(disputes));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Admin: Get all platform disputes")
    public ResponseEntity<ApiResponse<Page<DisputeResponse>>> getAllDisputes(Pageable pageable) {
        Page<DisputeResponse> page = disputeService.getAllDisputesPaged(pageable);
        return ResponseEntity.ok(ApiResponse.ok(page));
    }

    @PostMapping("/admin/{disputeId}/resolve")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Admin: Resolve dispute with arbitrated action")
    public ResponseEntity<ApiResponse<DisputeResponse>> resolveDispute(
            @PathVariable Long disputeId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ResolveDisputeRequest request
    ) {
        DisputeResponse response = disputeService.resolveDispute(disputeId, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Dispute resolved successfully", response));
    }
}
