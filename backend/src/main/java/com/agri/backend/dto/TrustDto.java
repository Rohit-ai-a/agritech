package com.agri.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

public class TrustDto {

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class InspectionRequest {
        private UUID tradeId;
        private String result; // PASSED, FAILED
        private String grade;
        private String certificateUrl;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class InspectionResponse {
        private UUID id;
        private UUID tradeId;
        private String inspectorName;
        private String assignmentStatus;
        private String result;
        private String grade;
        private String certificateUrl;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LogisticsUpdate {
        private UUID tradeId;
        private String status; // PICKED_UP, IN_TRANSIT, DELIVERED
        private String currentLocation;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LogisticsResponse {
        private UUID id;
        private UUID tradeId;
        private String trackingId;
        private String status;
        private String currentLocation;
    }
}
