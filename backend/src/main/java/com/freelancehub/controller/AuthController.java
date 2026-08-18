package com.freelancehub.controller;

import com.freelancehub.dto.ApiResponse;
import com.freelancehub.dto.AuthDTOs.*;
import com.freelancehub.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for registration, login, OTP verification, and password resets")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/client/register")
    @Operation(summary = "Register a new client account")
    public ResponseEntity<ApiResponse<AuthResponse>> registerClient(@Valid @RequestBody ClientRegisterRequest request) {
        AuthResponse response = authService.registerClient(request);
        return ResponseEntity.ok(ApiResponse.ok("Client registered successfully", response));
    }

    @PostMapping("/freelancer/register")
    @Operation(summary = "Register a new freelancer account")
    public ResponseEntity<ApiResponse<AuthResponse>> registerFreelancer(@Valid @RequestBody FreelancerRegisterRequest request) {
        AuthResponse response = authService.registerFreelancer(request);
        return ResponseEntity.ok(ApiResponse.ok("Freelancer registered successfully", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Login to FreelanceHub account")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify email or phone OTP code")
    public ResponseEntity<ApiResponse<Boolean>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        boolean verified = authService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.ok("Verification successful", verified));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset OTP")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.ok("Password reset instructions sent to your email", null));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using OTP")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.ok("Password reset successfully", null));
    }
}
