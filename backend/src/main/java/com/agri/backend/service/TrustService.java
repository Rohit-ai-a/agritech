package com.agri.backend.service;

import com.agri.backend.model.*;
import com.agri.backend.repository.InspectionRepository;
import com.agri.backend.repository.TradeRepository;
import com.agri.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TrustService {

    private final InspectionRepository inspectionRepository;
    private final TradeRepository tradeRepository;
    private final UserRepository userRepository;
    private final com.agri.backend.repository.LogisticsRepository logisticsRepository;

    @Transactional
    public void assignInspector(UUID tradeId, UUID inspectorId) {
        Trade trade = tradeRepository.findById(tradeId)
                .orElseThrow(() -> new RuntimeException("Trade not found"));

        if (trade.getStatus() != TradeStatus.AGREED) {
            throw new RuntimeException("Trade must be AGREED before inspection");
        }

        User inspector = userRepository.findById(inspectorId)
                .orElseThrow(() -> new RuntimeException("Inspector not found"));

        if (inspector.getRole() != Role.INSPECTOR) {
            throw new RuntimeException("User is not an inspector");
        }

        Inspection inspection = Inspection.builder()
                .trade(trade)
                .inspector(inspector)
                .assignmentStatus("REQUESTED")
                .inspectionResult("PENDING")
                .build();

        inspectionRepository.save(inspection);
        trade.setStatus(TradeStatus.INSPECTION_REQUESTED);
        tradeRepository.save(trade);
    }

    @Transactional
    public void respondToAssignment(UUID inspectionId, boolean accepted) {
        Inspection inspection = inspectionRepository.findById(inspectionId)
                .orElseThrow(() -> new RuntimeException("Inspection request not found"));

        if (!"REQUESTED".equals(inspection.getAssignmentStatus())) {
            throw new RuntimeException("Inspection is not in REQUESTED state");
        }

        Trade trade = inspection.getTrade();

        if (accepted) {
            inspection.setAssignmentStatus("ACCEPTED");
            trade.setStatus(TradeStatus.INSPECTION_PENDING);
        } else {
            inspection.setAssignmentStatus("REJECTED");
            trade.setStatus(TradeStatus.AGREED); // Back to pool
            // Optionally delete authentication logic or keep history.
            // Keeping history means we might have multiple inspections for one trade.
            // For simplicity, we just keep it REJECTED.
        }

        inspectionRepository.save(inspection);
        tradeRepository.save(trade);
    }

    @Transactional
    public void completeInspection(com.agri.backend.dto.TrustDto.InspectionRequest request) {
        Inspection inspection = inspectionRepository.findByTradeId(request.getTradeId())
                .orElseThrow(() -> new RuntimeException("Inspection not found"));

        Trade trade = inspection.getTrade();
        if (trade.getStatus() != TradeStatus.INSPECTION_PENDING) {
            throw new RuntimeException("Trade is not pending inspection");
        }

        inspection.setInspectionResult(request.getResult());
        inspection.setGrade(request.getGrade());
        inspection.setCertificateUrl(request.getCertificateUrl());
        inspectionRepository.save(inspection);

        if ("PASSED".equalsIgnoreCase(request.getResult())) {
            trade.setStatus(TradeStatus.INSPECTION_PASSED); // User req: PASSED -> SHIPPED? actually usually passed then
                                                            // shipped.
            // Requirement says: PASSED -> SHIPPED. I will transition to INSPECTION_PASSED
            // first, then creating logistics might imply "Ready to Ship"
            // Actually, let's follow the requirement strictly: "PASSED -> Trade moves to
            // SHIPPED"
            trade.setStatus(TradeStatus.SHIPPED);

            // Create Logistics Record
            Logistics logistics = Logistics.builder()
                    .trade(trade)
                    .status("PICKED_UP") // Or ready? Req says Start with Picked Up
                    .trackingId(UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .currentLocation("Origin: " + trade.getCrop().getLocationState())
                    .build();
            logisticsRepository.save(logistics);

        } else {
            trade.setStatus(TradeStatus.DISPUTED); // Requirement: FAILED -> DISPUTED
        }
        tradeRepository.save(trade);
    }

    @Transactional
    public com.agri.backend.dto.TrustDto.LogisticsResponse updateLogistics(
            com.agri.backend.dto.TrustDto.LogisticsUpdate update) {
        Logistics logistics = logisticsRepository.findByTradeId(update.getTradeId())
                .orElseThrow(() -> new RuntimeException("Logistics record not found"));

        // Strict transition check could go here
        logistics.setStatus(update.getStatus());
        logistics.setCurrentLocation(update.getCurrentLocation());
        Logistics saved = logisticsRepository.save(logistics);

        if ("DELIVERED".equalsIgnoreCase(update.getStatus())) {
            Trade trade = logistics.getTrade();
            trade.setStatus(TradeStatus.COMPLETED);
            tradeRepository.save(trade);
            // Crop sold logic already in TradeService, but safe to double check or rely on
            // that if called.
            // But here we are updating Trade directly.
            // The TradeService.updateStatus had the logic. I should duplicate or call it?
            // Duplicate simple logic here to avoid circular dep.
            com.agri.backend.model.Crop crop = trade.getCrop();
            crop.setStatus(com.agri.backend.model.CropStatus.SOLD);
            // cropRepository.save(crop); // Cascades if configured, else explicit
        }

        return com.agri.backend.dto.TrustDto.LogisticsResponse.builder()
                .id(saved.getId())
                .tradeId(saved.getTrade().getId())
                .trackingId(saved.getTrackingId())
                .status(saved.getStatus())
                .currentLocation(saved.getCurrentLocation())
                .build();
    }

    public com.agri.backend.dto.TrustDto.InspectionResponse getInspection(UUID tradeId) {
        Inspection i = inspectionRepository.findByTradeId(tradeId).orElse(null);
        if (i == null)
            return null;
        return com.agri.backend.dto.TrustDto.InspectionResponse.builder()
                .id(i.getId())
                .tradeId(i.getTrade().getId())
                .inspectorName(i.getInspector().getName())
                .result(i.getInspectionResult())
                .grade(i.getGrade())
                .certificateUrl(i.getCertificateUrl())
                .build();
    }

    public com.agri.backend.dto.TrustDto.LogisticsResponse getLogistics(UUID tradeId) {
        Logistics l = logisticsRepository.findByTradeId(tradeId).orElse(null);
        if (l == null)
            return null;
        return com.agri.backend.dto.TrustDto.LogisticsResponse.builder()
                .id(l.getId())
                .tradeId(l.getTrade().getId())
                .trackingId(l.getTrackingId())
                .status(l.getStatus())
                .currentLocation(l.getCurrentLocation())
                .build();
    }

    public java.util.List<com.agri.backend.dto.TrustDto.InspectionResponse> getMyAssignedInspections() {
        User inspector = getCurrentUser();
        if (inspector.getRole() != Role.INSPECTOR) {
            throw new RuntimeException("Only inspectors can view assigned inspections");
        }
        return inspectionRepository.findByInspectorId(inspector.getId()).stream()
                .map(i -> com.agri.backend.dto.TrustDto.InspectionResponse.builder()
                        .id(i.getId())
                        .tradeId(i.getTrade().getId())
                        .inspectorName(i.getInspector().getName())
                        .assignmentStatus(i.getAssignmentStatus())
                        .result(i.getInspectionResult())
                        .grade(i.getGrade())
                        .certificateUrl(i.getCertificateUrl())
                        .build())
                .collect(java.util.stream.Collectors.toList());
    }

    private User getCurrentUser() {
        org.springframework.security.core.userdetails.UserDetails userDetails = (org.springframework.security.core.userdetails.UserDetails) org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
