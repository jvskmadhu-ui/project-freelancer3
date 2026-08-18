package com.freelancehub.controller;

import com.freelancehub.dto.ApiResponse;
import com.freelancehub.dto.UserDTOs.*;
import com.freelancehub.security.UserPrincipal;
import com.freelancehub.service.VerificationService;
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
@RequestMapping("/api/verification")
@RequiredArgsConstructor
@Tag(name = "Verification / KYC", description = "Endpoints for identity document verification submissions and approvals")
public class VerificationController {

    private final VerificationService verificationService;

    @PostMapping("/submit")
    @Operation(summary = "Submit identity verification document (KYC)")
    public ResponseEntity<ApiResponse<VerificationDocumentResponse>> submitVerification(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody VerificationDocumentRequest request
    ) {
        VerificationDocumentResponse response = verificationService.submitVerificationDocument(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Verification document submitted for review", response));
    }

    @GetMapping("/history")
    @Operation(summary = "Get current user verification submissions history")
    public ResponseEntity<ApiResponse<List<VerificationDocumentResponse>>> getVerificationHistory(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<VerificationDocumentResponse> history = verificationService.getUserVerificationHistory(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(history));
    }

    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Admin: List pending KYC documents")
    public ResponseEntity<ApiResponse<Page<VerificationDocumentResponse>>> getPendingKYCDocuments(Pageable pageable) {
        Page<VerificationDocumentResponse> page = verificationService.getPendingKYCDocuments(pageable);
        return ResponseEntity.ok(ApiResponse.ok(page));
    }

    @PostMapping("/admin/{docId}/review")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Admin: Approve or reject KYC submission")
    public ResponseEntity<ApiResponse<VerificationDocumentResponse>> reviewKYCDocument(
            @PathVariable Long docId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ReviewKYCRequest request
    ) {
        VerificationDocumentResponse response = verificationService.reviewKYCDocument(docId, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Verification status updated", response));
    }
}
