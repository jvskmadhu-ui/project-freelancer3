package com.freelancehub.controller;

import com.freelancehub.dto.AdminDTOs.*;
import com.freelancehub.dto.ApiResponse;
import com.freelancehub.dto.UserDTOs.UserProfileDTO;
import com.freelancehub.entity.Role;
import com.freelancehub.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin Console", description = "Endpoints for platform analytics, user moderation, and governance")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    @Operation(summary = "Get overall platform metrics and statistics")
    public ResponseEntity<ApiResponse<PlatformStatsDTO>> getPlatformStats() {
        PlatformStatsDTO stats = adminService.getPlatformStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/users")
    @Operation(summary = "Search and paginate platform users")
    public ResponseEntity<ApiResponse<Page<UserProfileDTO>>> searchUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) Boolean verified,
            @RequestParam(required = false) String search,
            Pageable pageable
    ) {
        Page<UserProfileDTO> page = adminService.searchUsers(role, verified, search, pageable);
        return ResponseEntity.ok(ApiResponse.ok(page));
    }

    @PatchMapping("/users/{userId}/status")
    @Operation(summary = "Suspend or reactivate a user account")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateUserStatus(
            @PathVariable Long userId,
            @RequestBody UserStatusUpdateRequest request
    ) {
        UserProfileDTO updated = adminService.updateUserStatus(userId, request);
        return ResponseEntity.ok(ApiResponse.ok("User status updated", updated));
    }
}
