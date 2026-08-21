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
@Tag(name = "Authentication", description = "Endpoints for registration, login, OTP verification, password resets, and account recovery")
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
    @Operation(summary = "Login to FreelanceHub account with email or phone number")
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
    @Operation(summary = "Request password reset OTP via email or phone")
    public ResponseEntity<ApiResponse<ForgotPasswordResponse>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        ForgotPasswordResponse response = authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.ok("Password reset instructions sent", response));
    }

    @PostMapping("/verify-reset-otp")
    @Operation(summary = "Verify password reset OTP and obtain a single-use reset token")
    public ResponseEntity<ApiResponse<VerifyResetOtpResponse>> verifyResetOtp(@Valid @RequestBody VerifyResetOtpRequest request) {
        VerifyResetOtpResponse response = authService.verifyResetOtp(request);
        return ResponseEntity.ok(ApiResponse.ok("OTP verified successfully", response));
    }

    @PostMapping("/resend-reset-otp")
    @Operation(summary = "Resend a new password reset OTP code")
    public ResponseEntity<ApiResponse<ForgotPasswordResponse>> resendResetOtp(@Valid @RequestBody ResendResetOtpRequest request) {
        ForgotPasswordResponse response = authService.resendResetOtp(request);
        return ResponseEntity.ok(ApiResponse.ok("New OTP code generated and dispatched", response));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset account password using reset token or OTP code")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.ok("Password reset successfully. Please log in with your new password.", null));
    }

    @PostMapping("/recovery/identify")
    @Operation(summary = "Step 1: Identify account for multi-step recovery")
    public ResponseEntity<ApiResponse<AccountRecoveryIdentifyResponse>> identifyForRecovery(@Valid @RequestBody AccountRecoveryIdentifyRequest request) {
        AccountRecoveryIdentifyResponse response = authService.identifyForRecovery(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/recovery/verify-step")
    @Operation(summary = "Multi-step verification for complex account recovery")
    public ResponseEntity<ApiResponse<AccountRecoveryVerifyStepResponse>> verifyRecoveryStep(@Valid @RequestBody AccountRecoveryVerifyStepRequest request) {
        AccountRecoveryVerifyStepResponse response = authService.verifyRecoveryStep(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/recovery/compromised")
    @Operation(summary = "Report compromised account and trigger emergency security lockdown")
    public ResponseEntity<ApiResponse<CompromisedAccountResponse>> reportCompromisedAccount(@Valid @RequestBody CompromisedAccountReportRequest request) {
        CompromisedAccountResponse response = authService.handleCompromisedAccount(request);
        return ResponseEntity.ok(ApiResponse.ok("Emergency security lockdown activated", response));
    }
}
