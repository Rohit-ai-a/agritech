package com.agri.backend.dto;

import com.agri.backend.model.TradeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class TradeDto {

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TradeRequest {
        private UUID cropId;
        private BigDecimal offerPrice;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TradeResponse {
        private UUID id;
        private UUID cropId;
        private String cropName;
        private UUID buyerId;
        private String buyerName;
        private UUID farmerId;
        private String farmerName;
        private BigDecimal finalPrice;
        private TradeStatus status;
        private LocalDateTime createdAt;
    }
}
