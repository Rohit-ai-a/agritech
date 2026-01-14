package com.agri.backend.service;

import com.agri.backend.dto.TradeDto;
import com.agri.backend.model.*;
import com.agri.backend.repository.CropRepository;
import com.agri.backend.repository.TradeRepository;
import com.agri.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TradeService {

    private final TradeRepository tradeRepository;
    private final CropRepository cropRepository;
    private final UserRepository userRepository;
    private final TradeEventService tradeEventService;

    @Transactional
    public TradeDto.TradeResponse initiateTrade(TradeDto.TradeRequest request) {
        User buyer = getCurrentUser();

        // Guard: Role Check
        if (buyer.getRole() == Role.FARMER) {
            throw new RuntimeException("Farmers cannot initiate purchase");
        }

        // Guard: KYC Check (Enhancement)
        if (!buyer.isKycStatus()) {
            throw new RuntimeException("KYC Verification required to trade. Please verify your identity in profile.");
        }

        Crop crop = cropRepository.findById(request.getCropId())
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        // Guard: Duplicate Trade Check (Enhancement)
        // Prevent buyer from opening multiple requests for the same crop if one is
        // already pending
        boolean alreadyPending = tradeRepository.findByBuyerId(buyer.getId()).stream()
                .anyMatch(t -> t.getCrop().getId().equals(crop.getId()) &&
                        (t.getStatus() == TradeStatus.REQUESTED || t.getStatus() == TradeStatus.NEGOTIATING));

        if (alreadyPending) {
            throw new RuntimeException("You already have a pending request for this crop");
        }

        // Guard: Availability
        if (crop.getStatus() != CropStatus.AVAILABLE) {
            throw new RuntimeException("Crop is not available for trade");
        }

        // Guard: Self-Trading (Enhancement)
        if (crop.getFarmer().getId().equals(buyer.getId())) {
            throw new RuntimeException("You cannot buy your own crop");
        }

        Trade trade = Trade.builder()
                .crop(crop)
                .buyer(buyer)
                .farmer(crop.getFarmer())
                .status(TradeStatus.REQUESTED)
                .finalPrice(request.getOfferPrice() != null ? request.getOfferPrice() : crop.getPricePerUnit())
                .createdAt(LocalDateTime.now())
                .build();

        Trade savedTrade = tradeRepository.save(trade);

        // Log Event (Enhancement)
        tradeEventService.logEvent(savedTrade, "TRADE_INITIATED", "Trade request created by " + buyer.getName());

        return mapToResponse(savedTrade);
    }

    public List<TradeDto.TradeResponse> getMyTrades() {
        User user = getCurrentUser();
        if (user.getRole() == Role.FARMER) {
            return tradeRepository.findByFarmerId(user.getId()).stream()
                    .map(this::mapToResponse).collect(Collectors.toList());
        } else {
            return tradeRepository.findByBuyerId(user.getId()).stream()
                    .map(this::mapToResponse).collect(Collectors.toList());
        }
    }

    @Transactional
    public TradeDto.TradeResponse updateStatus(UUID tradeId, TradeStatus newStatus) {
        Trade trade = tradeRepository.findById(tradeId)
                .orElseThrow(() -> new RuntimeException("Trade not found"));

        if (trade.getStatus() == newStatus)
            return mapToResponse(trade);

        TradeStatus oldStatus = trade.getStatus();
        trade.setStatus(newStatus);

        // Mark crop as SOLD if trade is AGREED
        if (newStatus == TradeStatus.AGREED || newStatus == TradeStatus.COMPLETED) {
            Crop crop = trade.getCrop();
            if (crop.getStatus() == CropStatus.AVAILABLE) {
                crop.setStatus(CropStatus.SOLD);
                cropRepository.save(crop);
            }
        }

        Trade savedTrade = tradeRepository.save(trade);

        // Log Event (Enhancement)
        tradeEventService.logEvent(savedTrade, "STATUS_CHANGE",
                String.format("Status changed from %s to %s", oldStatus, newStatus));

        return mapToResponse(savedTrade);
    }

    public List<TradeEvent> getTradeEvents(UUID tradeId) {
        return tradeEventService.getEvents(tradeId);
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private TradeDto.TradeResponse mapToResponse(Trade trade) {
        return TradeDto.TradeResponse.builder()
                .id(trade.getId())
                .cropId(trade.getCrop().getId())
                .cropName(trade.getCrop().getName())
                .buyerId(trade.getBuyer().getId())
                .buyerName(trade.getBuyer().getName())
                .farmerId(trade.getFarmer().getId())
                .farmerName(trade.getFarmer().getName())
                .finalPrice(trade.getFinalPrice())
                .status(trade.getStatus())
                .createdAt(trade.getCreatedAt())
                .build();
    }
}
