package com.freelancehub.controller;

import com.freelancehub.dto.ApiResponse;
import com.freelancehub.dto.FreelancerDTOs.*;
import com.freelancehub.security.UserPrincipal;
import com.freelancehub.service.FreelancerService;
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

@RestController
@RequestMapping("/api/freelancers")
@RequiredArgsConstructor
@Tag(name = "Freelancers", description = "Endpoints for discovering, searching, and managing freelancer profiles")
public class FreelancerController {

    private final FreelancerService freelancerService;

    @GetMapping
    @Operation(summary = "Search and filter freelancers")
    public ResponseEntity<ApiResponse<Page<FreelancerProfileResponse>>> searchFreelancers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) BigDecimal minRate,
            @RequestParam(required = false) BigDecimal maxRate,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String availability,
            @RequestParam(required = false) Boolean verifiedOnly,
            Pageable pageable
    ) {
        Page<FreelancerProfileResponse> result = freelancerService.searchFreelancers(
                keyword, skill, minRate, maxRate, minRating, availability, verifiedOnly, pageable
        );
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get freelancer profile details by ID")
    public ResponseEntity<ApiResponse<FreelancerProfileResponse>> getFreelancerById(@PathVariable Long id) {
        FreelancerProfileResponse response = freelancerService.getProfileById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get freelancer profile by User ID")
    public ResponseEntity<ApiResponse<FreelancerProfileResponse>> getFreelancerByUserId(@PathVariable Long userId) {
        FreelancerProfileResponse response = freelancerService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('ROLE_FREELANCER')")
    @Operation(summary = "Update authenticated freelancer's profile")
    public ResponseEntity<ApiResponse<FreelancerProfileResponse>> updateFreelancerProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody UpdateFreelancerProfileRequest request
    ) {
        FreelancerProfileResponse response = freelancerService.updateProfile(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Freelancer profile updated successfully", response));
    }

    @PostMapping("/portfolio")
    @PreAuthorize("hasRole('ROLE_FREELANCER')")
    @Operation(summary = "Add portfolio item to freelancer profile")
    public ResponseEntity<ApiResponse<PortfolioItemDTO>> addPortfolioItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AddPortfolioItemRequest request
    ) {
        PortfolioItemDTO item = freelancerService.addPortfolioItem(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Portfolio item added successfully", item));
    }

    @DeleteMapping("/portfolio/{itemId}")
    @PreAuthorize("hasRole('ROLE_FREELANCER')")
    @Operation(summary = "Delete portfolio item")
    public ResponseEntity<ApiResponse<Void>> deletePortfolioItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long itemId
    ) {
        freelancerService.deletePortfolioItem(principal.getId(), itemId);
        return ResponseEntity.ok(ApiResponse.ok("Portfolio item deleted successfully", null));
    }
}
