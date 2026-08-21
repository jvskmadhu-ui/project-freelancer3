package com.freelancehub.dto;

import com.freelancehub.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class AuthDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginRequest {
        @NotBlank(message = "Email or phone number is required")
        private String email; // Accepts email or phone number

        private String identifier; // Alias for email/phone

        @NotBlank(message = "Password is required")
        private String password;

        private boolean rememberMe;

        public String getLoginIdentifier() {
            if (identifier != null && !identifier.isBlank()) {
                return identifier.trim();
            }
            return email != null ? email.trim() : "";
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClientRegisterRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        private String password;

        private String phone;
        private String companyName;
        private String website;
        private String industry;
        private String location;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FreelancerRegisterRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        private String password;

        private String phone;
        private String professionalTitle;
        private BigDecimal hourlyRate;
        private String location;
        private List<String> skills;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private String tokenType;
        private Long userId;
        private String email;
        private String phone;
        private String fullName;
        private Role role;
        private String avatarUrl;
        private boolean emailVerified;
        private boolean phoneVerified;
        private boolean identityVerified;
        private Long profileId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VerifyOtpRequest {
        private String email;
        private String identifier;

        @NotBlank(message = "OTP code is required")
        private String code;

        private String type; // EMAIL or PHONE

        public String getTargetIdentifier() {
            if (identifier != null && !identifier.isBlank()) {
                return identifier.trim();
            }
            return email != null ? email.trim() : "";
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ForgotPasswordRequest {
        private String email;
        private String identifier; // Supports email or phone
        private String channel; // EMAIL or PHONE

        public String getTargetIdentifier() {
            if (identifier != null && !identifier.isBlank()) {
                return identifier.trim();
            }
            return email != null ? email.trim() : "";
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ForgotPasswordResponse {
        private String message;
        private String maskedDestination;
        private String channel;
        private int expiresInMinutes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VerifyResetOtpRequest {
        private String email;
        private String identifier;

        @NotBlank(message = "OTP code is required")
        private String otp;

        private String code; // Alias for otp

        public String getOtpCode() {
            if (otp != null && !otp.isBlank()) return otp.trim();
            return code != null ? code.trim() : "";
        }

        public String getTargetIdentifier() {
            if (identifier != null && !identifier.isBlank()) {
                return identifier.trim();
            }
            return email != null ? email.trim() : "";
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyResetOtpResponse {
        private boolean valid;
        private String resetToken;
        private int expiresInMinutes;
        private String message;
        private String identifier;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResendResetOtpRequest {
        private String email;
        private String identifier;
        private String channel; // EMAIL or PHONE

        public String getTargetIdentifier() {
            if (identifier != null && !identifier.isBlank()) {
                return identifier.trim();
            }
            return email != null ? email.trim() : "";
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResetPasswordRequest {
        private String email;
        private String identifier;
        private String resetToken;
        private String otp;

        @NotBlank(message = "New password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        private String newPassword;

        private String confirmPassword;

        @Builder.Default
        private boolean invalidateAllSessions = true;

        public String getTargetIdentifier() {
            if (identifier != null && !identifier.isBlank()) {
                return identifier.trim();
            }
            return email != null ? email.trim() : "";
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AccountRecoveryIdentifyRequest {
        @NotBlank(message = "Account identifier is required")
        private String identifier; // Email, phone, or username
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AccountRecoveryIdentifyResponse {
        private boolean accountFound;
        private String maskedEmail;
        private String maskedPhone;
        private boolean hasSecurityQuestion;
        private String securityQuestion;
        private boolean identityVerified;
        private List<String> availableChannels;
        private String recoverySessionId;
        private String message;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AccountRecoveryVerifyStepRequest {
        @NotBlank(message = "Identifier is required")
        private String identifier;

        @NotBlank(message = "Verification step is required")
        private String step; // OTP, SECURITY_QUESTION, IDENTITY_CONFIRMATION

        private String otpCode;
        private String securityAnswer;
        private String fullName;
        private String lastFourPhone;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AccountRecoveryVerifyStepResponse {
        private boolean stepSuccess;
        private String currentStep;
        private String nextStep; // OTP, SECURITY_QUESTION, IDENTITY_CONFIRMATION, RESET_PASSWORD, COMPLETED
        private String resetToken;
        private String message;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CompromisedAccountReportRequest {
        @NotBlank(message = "Account identifier is required")
        private String identifier;

        private String incidentDescription;
        private boolean requestEmergencyLock;
        private boolean terminateAllSessions;
        private String contactEmail;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompromisedAccountResponse {
        private boolean accountSecured;
        private boolean emergencyLockApplied;
        private boolean sessionsTerminated;
        private String incidentReferenceId;
        private String resetToken;
        private String message;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChangePasswordRequest {
        @NotBlank(message = "Current password is required")
        private String currentPassword;

        @NotBlank(message = "New password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        private String newPassword;

        @NotBlank(message = "Confirm password is required")
        private String confirmPassword;

        @Builder.Default
        private boolean invalidateOtherSessions = true;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentLoginActivityDTO {
        private Long id;
        private String ipAddress;
        private String deviceType;
        private String userAgent;
        private String location;
        private String status;
        private String failureReason;
        private LocalDateTime createdAt;
        private boolean currentSession;
    }
}
