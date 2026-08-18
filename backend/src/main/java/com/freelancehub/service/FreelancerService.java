package com.freelancehub.service;

import com.freelancehub.dto.FreelancerDTOs.*;
import com.freelancehub.entity.FreelancerProfile;
import com.freelancehub.entity.PortfolioItem;
import com.freelancehub.entity.Skill;
import com.freelancehub.entity.User;
import com.freelancehub.exception.ResourceNotFoundException;
import com.freelancehub.repository.FreelancerProfileRepository;
import com.freelancehub.repository.PortfolioItemRepository;
import com.freelancehub.repository.SkillRepository;
import com.freelancehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FreelancerService {

    private final FreelancerProfileRepository freelancerProfileRepository;
    private final PortfolioItemRepository portfolioItemRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<FreelancerProfileResponse> searchFreelancers(
            String keyword,
            String skill,
            BigDecimal minRate,
            BigDecimal maxRate,
            Double minRating,
            String availability,
            Boolean verifiedOnly,
            Pageable pageable
    ) {
        return freelancerProfileRepository.searchFreelancers(
                keyword, skill, minRate, maxRate, minRating, availability, verifiedOnly, pageable
        ).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public FreelancerProfileResponse getProfileById(Long id) {
        FreelancerProfile profile = freelancerProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Freelancer profile not found with id: " + id));
        return mapToResponse(profile);
    }

    @Transactional(readOnly = true)
    public FreelancerProfileResponse getProfileByUserId(Long userId) {
        FreelancerProfile profile = freelancerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Freelancer profile not found for user: " + userId));
        return mapToResponse(profile);
    }

    @Transactional
    public FreelancerProfileResponse updateProfile(Long userId, UpdateFreelancerProfileRequest request) {
        FreelancerProfile profile = freelancerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Freelancer profile not found"));

        User user = profile.getUser();
        if (request.getLocation() != null) user.setLocation(request.getLocation().trim());
        if (request.getTimezone() != null) user.setTimezone(request.getTimezone().trim());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl().trim());
        userRepository.save(user);

        if (request.getTitle() != null) profile.setTitle(request.getTitle());
        if (request.getOverview() != null) profile.setOverview(request.getOverview());
        if (request.getHourlyRate() != null) profile.setHourlyRate(request.getHourlyRate());
        if (request.getProjectBaseRate() != null) profile.setProjectBaseRate(request.getProjectBaseRate());
        if (request.getAvailability() != null) profile.setAvailability(request.getAvailability());
        if (request.getLanguages() != null) profile.setLanguages(request.getLanguages());
        if (request.getExperienceYears() != null) profile.setExperienceYears(request.getExperienceYears());
        if (request.getEducationJson() != null) profile.setEducationJson(request.getEducationJson());
        if (request.getExperienceJson() != null) profile.setExperienceJson(request.getExperienceJson());
        if (request.getCertificationsJson() != null) profile.setCertificationsJson(request.getCertificationsJson());

        if (request.getSkills() != null) {
            profile.setSkills(new HashSet<>());
            for (String skillName : request.getSkills()) {
                Skill skill = skillRepository.findByNameIgnoreCase(skillName.trim())
                        .orElseGet(() -> skillRepository.save(Skill.builder().name(skillName.trim()).build()));
                profile.getSkills().add(skill);
            }
        }

        profile = freelancerProfileRepository.save(profile);
        return mapToResponse(profile);
    }

    @Transactional
    public PortfolioItemDTO addPortfolioItem(Long userId, AddPortfolioItemRequest request) {
        FreelancerProfile profile = freelancerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Freelancer profile not found"));

        PortfolioItem item = PortfolioItem.builder()
                .freelancerProfile(profile)
                .title(request.getTitle())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .projectUrl(request.getProjectUrl())
                .tags(request.getTags())
                .build();

        item = portfolioItemRepository.save(item);

        return PortfolioItemDTO.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .imageUrl(item.getImageUrl())
                .projectUrl(item.getProjectUrl())
                .tags(item.getTags())
                .build();
    }

    @Transactional
    public void deletePortfolioItem(Long userId, Long itemId) {
        FreelancerProfile profile = freelancerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Freelancer profile not found"));

        PortfolioItem item = portfolioItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio item not found"));

        if (!item.getFreelancerProfile().getId().equals(profile.getId())) {
            throw new ResourceNotFoundException("Not authorized to delete this portfolio item");
        }

        portfolioItemRepository.delete(item);
    }

    public FreelancerProfileResponse mapToResponse(FreelancerProfile profile) {
        List<PortfolioItemDTO> portfolioDTOs = profile.getPortfolioItems().stream()
                .map(item -> PortfolioItemDTO.builder()
                        .id(item.getId())
                        .title(item.getTitle())
                        .description(item.getDescription())
                        .imageUrl(item.getImageUrl())
                        .projectUrl(item.getProjectUrl())
                        .tags(item.getTags())
                        .build())
                .toList();

        return FreelancerProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .fullName(profile.getUser().getFullName())
                .email(profile.getUser().getEmail())
                .avatarUrl(profile.getUser().getAvatarUrl())
                .location(profile.getUser().getLocation())
                .timezone(profile.getUser().getTimezone())
                .identityVerified(profile.getUser().isIdentityVerified())
                .title(profile.getTitle())
                .overview(profile.getOverview())
                .hourlyRate(profile.getHourlyRate())
                .projectBaseRate(profile.getProjectBaseRate())
                .availability(profile.getAvailability())
                .languages(profile.getLanguages())
                .responseTimeHours(profile.getResponseTimeHours())
                .experienceYears(profile.getExperienceYears())
                .completedProjectsCount(profile.getCompletedProjectsCount())
                .successRate(profile.getSuccessRate())
                .rating(profile.getRating())
                .totalReviewsCount(profile.getTotalReviewsCount())
                .educationJson(profile.getEducationJson())
                .experienceJson(profile.getExperienceJson())
                .certificationsJson(profile.getCertificationsJson())
                .skills(profile.getSkills().stream().map(Skill::getName).collect(Collectors.toSet()))
                .portfolioItems(portfolioDTOs)
                .createdAt(profile.getCreatedAt())
                .build();
    }
}
