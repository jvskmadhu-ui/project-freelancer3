package com.freelancehub.service;

import com.freelancehub.dto.UserDTOs.*;
import com.freelancehub.entity.User;
import com.freelancehub.exception.ResourceNotFoundException;
import com.freelancehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return UserProfileDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .location(user.getLocation())
                .timezone(user.getTimezone())
                .emailVerified(user.isEmailVerified())
                .phoneVerified(user.isPhoneVerified())
                .identityVerified(user.isIdentityVerified())
                .isSuspended(user.isSuspended())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Transactional
    public UserProfileDTO updateProfile(Long userId, UserProfileDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (request.getFullName() != null) user.setFullName(request.getFullName().trim());
        if (request.getPhone() != null) user.setPhone(request.getPhone().trim());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        if (request.getLocation() != null) user.setLocation(request.getLocation().trim());
        if (request.getTimezone() != null) user.setTimezone(request.getTimezone().trim());

        user = userRepository.save(user);
        return getUserProfile(user.getId());
    }
}
