package com.freelancehub.controller;

import com.freelancehub.dto.ApiResponse;
import com.freelancehub.entity.Skill;
import com.freelancehub.repository.SkillRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
@Tag(name = "Skills", description = "Endpoints for retrieving system skills and categories")
public class SkillController {

    private final SkillRepository skillRepository;

    @GetMapping
    @Operation(summary = "Get all available skills")
    public ResponseEntity<ApiResponse<List<Skill>>> getAllSkills() {
        return ResponseEntity.ok(ApiResponse.ok(skillRepository.findAll()));
    }
}
