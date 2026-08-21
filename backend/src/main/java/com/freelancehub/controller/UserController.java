package com.freelancehub.controller;

import com.freelancehub.dto.ApiResponse;
import com.freelancehub.dto.AuthDTOs.ChangePasswordRequest;
import com.freelancehub.dto.AuthDTOs.RecentLoginActivityDTO;
import com.freelancehub.dto.UserDTOs.UserProfileDTO;
import com.freelancehub.security.UserPrincipal;
import com.freelancehub.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Profile & Security", description = "Endpoints for managing user profile information, passwords, and security")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        UserProfileDTO profile = userService.getUserProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get public user profile by ID")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getUserById(@PathVariable Long id) {
        UserProfileDTO profile = userService.getUserProfile(id);
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody UserProfileDTO request
    ) {
        UserProfileDTO updated = userService.updateProfile(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change password from settings (authenticated)")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Password changed successfully.", null));
    }

    @GetMapping("/login-activity")
    @Operation(summary = "Get recent login activity and active sessions")
    public ResponseEntity<ApiResponse<List<RecentLoginActivityDTO>>> getRecentLoginActivity(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<RecentLoginActivityDTO> activity = userService.getRecentLoginActivity(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(activity));
    }

    @PostMapping("/logout-all-sessions")
    @Operation(summary = "Log out from all other active sessions and devices")
    public ResponseEntity<ApiResponse<String>> logoutAllSessions(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        userService.logoutAllSessions(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok("All other sessions have been terminated.", null));
    }
}
