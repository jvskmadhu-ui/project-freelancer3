package com.freelancehub.controller;

import com.freelancehub.dto.ApiResponse;
import com.freelancehub.dto.ContractDTOs.ContractResponse;
import com.freelancehub.entity.Contract.ContractStatus;
import com.freelancehub.security.UserPrincipal;
import com.freelancehub.service.ContractService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
@Tag(name = "Contracts", description = "Endpoints for contract management and project workspaces")
public class ContractController {

    private final ContractService contractService;

    @GetMapping("/{id}")
    @Operation(summary = "Get contract details by ID")
    public ResponseEntity<ApiResponse<ContractResponse>> getContractById(@PathVariable Long id) {
        ContractResponse response = contractService.getContractById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/client/my-contracts")
    @Operation(summary = "Get all contracts for current client")
    public ResponseEntity<ApiResponse<List<ContractResponse>>> getClientContracts(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<ContractResponse> contracts = contractService.getClientContracts(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(contracts));
    }

    @GetMapping("/freelancer/my-contracts")
    @Operation(summary = "Get all contracts for current freelancer")
    public ResponseEntity<ApiResponse<List<ContractResponse>>> getFreelancerContracts(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<ContractResponse> contracts = contractService.getFreelancerContracts(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(contracts));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update contract status")
    public ResponseEntity<ApiResponse<ContractResponse>> updateContractStatus(
            @PathVariable Long id,
            @RequestParam ContractStatus status
    ) {
        ContractResponse response = contractService.updateContractStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Contract status updated", response));
    }
}
