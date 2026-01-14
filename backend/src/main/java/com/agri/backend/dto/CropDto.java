package com.agri.backend.dto;

import com.agri.backend.model.CropStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class CropDto {

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CropRequest {
        private String name;
        private String category;
        private Double quantity;
        private BigDecimal pricePerUnit;
        private String locationState;
        private String imageUrl;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CropResponse {
        private UUID id;
        private String farmerName;
        private UUID farmerId;
        private String name;
        private String category;
        private Double quantity;
        private BigDecimal pricePerUnit;
        private String locationState;
        private String imageUrl;
        private CropStatus status;
        private LocalDateTime createdAt;
    }
}
