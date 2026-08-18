package com.freelancehub.controller;

import com.freelancehub.dto.ApiResponse;
import com.freelancehub.dto.ReviewDTOs.*;
import com.freelancehub.security.UserPrincipal;
import com.freelancehub.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews & Ratings", description = "Endpoints for creating and retrieving multi-criteria project reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @Operation(summary = "Submit a project rating and review")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateReviewRequest request
    ) {
        ReviewResponse response = reviewService.createReview(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Review submitted successfully", response));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all reviews received by a specific user")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getUserReviews(@PathVariable Long userId) {
        List<ReviewResponse> reviews = reviewService.getReviewsForUser(userId);
        return ResponseEntity.ok(ApiResponse.ok(reviews));
    }

    @GetMapping("/user/{userId}/paged")
    @Operation(summary = "Get paginated reviews for a user")
    public ResponseEntity<ApiResponse<Page<ReviewResponse>>> getUserReviewsPaged(
            @PathVariable Long userId,
            Pageable pageable
    ) {
        Page<ReviewResponse> reviews = reviewService.getReviewsForUserPaged(userId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(reviews));
    }
}
