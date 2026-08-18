package com.freelancehub.service;

import com.freelancehub.dto.ReviewDTOs.*;
import com.freelancehub.entity.ClientProfile;
import com.freelancehub.entity.FreelancerProfile;
import com.freelancehub.entity.Project;
import com.freelancehub.entity.Review;
import com.freelancehub.entity.Role;
import com.freelancehub.entity.User;
import com.freelancehub.exception.BadRequestException;
import com.freelancehub.exception.ResourceNotFoundException;
import com.freelancehub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final ClientProfileRepository clientProfileRepository;
    private final NotificationService notificationService;

    @Transactional
    public ReviewResponse createReview(Long reviewerId, CreateReviewRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (project.getStatus() != Project.ProjectStatus.COMPLETED) {
            throw new BadRequestException("Reviews can only be submitted for completed projects.");
        }

        if (reviewRepository.existsByProjectIdAndReviewerId(request.getProjectId(), reviewerId)) {
            throw new BadRequestException("You have already reviewed this project.");
        }

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found"));
        User reviewee = userRepository.findById(request.getRevieweeId())
                .orElseThrow(() -> new ResourceNotFoundException("Reviewee not found"));

        double overall = (request.getCommunicationRating() + request.getQualityRating() +
                request.getTimelinessRating() + request.getProfessionalismRating()) / 4.0;
        overall = Math.round(overall * 10.0) / 10.0;

        Review review = Review.builder()
                .project(project)
                .reviewer(reviewer)
                .reviewee(reviewee)
                .communicationRating(request.getCommunicationRating())
                .qualityRating(request.getQualityRating())
                .timelinessRating(request.getTimelinessRating())
                .professionalismRating(request.getProfessionalismRating())
                .overallRating(overall)
                .feedback(request.getFeedback().trim())
                .build();

        review = reviewRepository.save(review);

        // Recalculate reviewee average rating
        Double avgRating = reviewRepository.calculateAverageRatingForUser(reviewee.getId());
        long totalReviews = reviewRepository.countByRevieweeId(reviewee.getId());

        if (avgRating != null) {
            double roundedAvg = Math.round(avgRating * 10.0) / 10.0;
            if (reviewee.getRole() == Role.ROLE_FREELANCER) {
                freelancerProfileRepository.findByUserId(reviewee.getId()).ifPresent(fp -> {
                    fp.setRating(roundedAvg);
                    fp.setTotalReviewsCount((int) totalReviews);
                    freelancerProfileRepository.save(fp);
                });
            } else if (reviewee.getRole() == Role.ROLE_CLIENT) {
                clientProfileRepository.findByUserId(reviewee.getId()).ifPresent(cp -> {
                    cp.setRating(roundedAvg);
                    cp.setTotalReviewsCount((int) totalReviews);
                    clientProfileRepository.save(cp);
                });
            }
        }

        return mapToResponse(review);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsForUser(Long userId) {
        return reviewRepository.findByRevieweeIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviewsForUserPaged(Long userId, Pageable pageable) {
        return reviewRepository.findByRevieweeIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::mapToResponse);
    }

    public ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .projectId(review.getProject().getId())
                .projectTitle(review.getProject().getTitle())
                .reviewerId(review.getReviewer().getId())
                .reviewerName(review.getReviewer().getFullName())
                .reviewerAvatarUrl(review.getReviewer().getAvatarUrl())
                .revieweeId(review.getReviewee().getId())
                .revieweeName(review.getReviewee().getFullName())
                .communicationRating(review.getCommunicationRating())
                .qualityRating(review.getQualityRating())
                .timelinessRating(review.getTimelinessRating())
                .professionalismRating(review.getProfessionalismRating())
                .overallRating(review.getOverallRating())
                .feedback(review.getFeedback())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
