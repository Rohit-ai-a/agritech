package com.agri.backend.controller;

import com.agri.backend.service.TrustService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/trust")
@RequiredArgsConstructor
public class TrustController {

    private final TrustService trustService;

    @PostMapping("/assign-inspector")
    public ResponseEntity<Void> assignInspector(@RequestParam UUID tradeId, @RequestParam UUID inspectorId) {
        trustService.assignInspector(tradeId, inspectorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/inspection/{id}/respond")
    public ResponseEntity<Void> respondToAssignment(@PathVariable UUID id, @RequestParam boolean accept) {
        trustService.respondToAssignment(id, accept);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/complete-inspection")
    public ResponseEntity<Void> completeInspection(
            @RequestBody com.agri.backend.dto.TrustDto.InspectionRequest request) {
        trustService.completeInspection(request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/logistics")
    public ResponseEntity<com.agri.backend.dto.TrustDto.LogisticsResponse> updateLogistics(
            @RequestBody com.agri.backend.dto.TrustDto.LogisticsUpdate update) {
        return ResponseEntity.ok(trustService.updateLogistics(update));
    }

    @GetMapping("/inspection/{tradeId}")
    public ResponseEntity<com.agri.backend.dto.TrustDto.InspectionResponse> getInspection(@PathVariable UUID tradeId) {
        return ResponseEntity.ok(trustService.getInspection(tradeId));
    }

    @GetMapping("/logistics/{tradeId}")
    public ResponseEntity<com.agri.backend.dto.TrustDto.LogisticsResponse> getLogistics(@PathVariable UUID tradeId) {
        return ResponseEntity.ok(trustService.getLogistics(tradeId));
    }

    @GetMapping("/my-inspections")
    public ResponseEntity<java.util.List<com.agri.backend.dto.TrustDto.InspectionResponse>> getMyInspections() {
        return ResponseEntity.ok(trustService.getMyAssignedInspections());
    }
}
