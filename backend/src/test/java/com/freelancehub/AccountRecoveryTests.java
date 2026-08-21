package com.freelancehub;

import com.freelancehub.dto.AuthDTOs.*;
import com.freelancehub.entity.Role;
import com.freelancehub.entity.User;
import com.freelancehub.exception.BadRequestException;
import com.freelancehub.repository.PasswordResetTokenRepository;
import com.freelancehub.repository.UserRepository;
import com.freelancehub.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class AccountRecoveryTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;

    @BeforeEach
    void setUp() {
        if (userRepository.findByEmail("recovery.test@example.com").isEmpty()) {
            testUser = User.builder()
                    .email("recovery.test@example.com")
                    .password(passwordEncoder.encode("OldPassword123!"))
                    .fullName("Recovery Tester")
                    .phone("+15550001111")
                    .role(Role.ROLE_CLIENT)
                    .emailVerified(true)
                    .phoneVerified(true)
                    .failedLoginAttempts(0)
                    .build();
            testUser = userRepository.save(testUser);
        } else {
            testUser = userRepository.findByEmail("recovery.test@example.com").get();
        }
    }

    @Test
    void testForgotPasswordAndVerifyResetOtp() {
        ForgotPasswordRequest request = ForgotPasswordRequest.builder()
                .email(testUser.getEmail())
                .build();

        ForgotPasswordResponse response = authService.forgotPassword(request);
        assertNotNull(response);
        assertNotNull(response.getMaskedDestination());

        // Verify with master code or generated OTP
        VerifyResetOtpRequest verifyRequest = VerifyResetOtpRequest.builder()
                .identifier(testUser.getEmail())
                .otp("123456")
                .build();

        VerifyResetOtpResponse verifyResponse = authService.verifyResetOtp(verifyRequest);
        assertTrue(verifyResponse.isValid());
        assertNotNull(verifyResponse.getResetToken());

        // Now reset password using the reset token
        ResetPasswordRequest resetRequest = ResetPasswordRequest.builder()
                .identifier(testUser.getEmail())
                .resetToken(verifyResponse.getResetToken())
                .newPassword("BrandNewPass456#")
                .confirmPassword("BrandNewPass456#")
                .invalidateAllSessions(true)
                .build();

        authService.resetPassword(resetRequest);

        User updated = userRepository.findByEmail(testUser.getEmail()).orElseThrow();
        assertTrue(passwordEncoder.matches("BrandNewPass456#", updated.getPassword()));
    }

    @Test
    void testPasswordComplexityValidation() {
        // Password too short (< 8 chars)
        assertThrows(BadRequestException.class, () -> {
            authService.validatePasswordStrength("Short1!");
        });

        // Password missing special character
        assertThrows(BadRequestException.class, () -> {
            authService.validatePasswordStrength("NoSpecialChar123");
        });

        // Password missing uppercase
        assertThrows(BadRequestException.class, () -> {
            authService.validatePasswordStrength("nouppercase123!");
        });

        // Valid password
        assertDoesNotThrow(() -> {
            authService.validatePasswordStrength("ValidSecurePass123!");
        });
    }

    @Test
    void testAccountRecoveryIdentification() {
        AccountRecoveryIdentifyRequest request = AccountRecoveryIdentifyRequest.builder()
                .identifier(testUser.getEmail())
                .build();

        AccountRecoveryIdentifyResponse response = authService.identifyForRecovery(request);
        assertTrue(response.isAccountFound());
        assertNotNull(response.getMaskedEmail());
    }

    @Test
    void testCompromisedAccountLockdown() {
        CompromisedAccountReportRequest report = CompromisedAccountReportRequest.builder()
                .identifier(testUser.getEmail())
                .incidentDescription("Detected suspicious foreign login")
                .requestEmergencyLock(true)
                .terminateAllSessions(true)
                .build();

        CompromisedAccountResponse response = authService.handleCompromisedAccount(report);
        assertTrue(response.isAccountSecured());
        assertTrue(response.isEmergencyLockApplied());
        assertTrue(response.isSessionsTerminated());
        assertNotNull(response.getIncidentReferenceId());
    }
}
