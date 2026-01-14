package com.agri.backend.controller;

import com.agri.backend.dto.TradeDto;
import com.agri.backend.model.Role;
import com.agri.backend.model.Trade;
import com.agri.backend.model.TradeStatus;
import com.agri.backend.model.User;
import com.agri.backend.repository.TradeRepository;
import com.agri.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.NonNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final TradeRepository tradeRepository;
    private final UserRepository userRepository;
    private final com.agri.backend.repository.CropRepository cropRepository;

    @GetMapping("/trades/agreed")
    public ResponseEntity<List<TradeDto.TradeResponse>> getAgreedTrades() {
        List<Trade> trades = tradeRepository.findByStatus(TradeStatus.AGREED);
        // We need manually map or expose mapper. For speed, manual small validation.
        return ResponseEntity.ok(trades.stream().map(t -> TradeDto.TradeResponse.builder()
                .id(t.getId())
                .cropName(t.getCrop().getName())
                .farmerName(t.getFarmer().getName())
                .buyerName(t.getBuyer().getName())
                .finalPrice(t.getFinalPrice())
                .status(t.getStatus())
                .createdAt(t.getCreatedAt())
                .build()).collect(Collectors.toList()));
    }

    @GetMapping("/inspectors")
    public ResponseEntity<List<UserDto>> getInspectors() {
        List<User> inspectors = userRepository.findByRole(Role.INSPECTOR);
        return ResponseEntity
                .ok(inspectors.stream().map(u -> new UserDto(u.getId(), u.getName())).collect(Collectors.toList()));
    }

    @PostMapping("/trades/{id}/force-close")
    public ResponseEntity<Void> forceCloseDispute(@PathVariable @NonNull UUID id,
            @RequestParam boolean resolveToBuyer) {
        Trade trade = tradeRepository.findById(id).orElseThrow(() -> new RuntimeException("Trade not found"));
        if (trade.getStatus() != TradeStatus.DISPUTED) {
            throw new RuntimeException("Only disputed trades can be force-closed");
        }

        // Logic: If resolveToBuyer is true, maybe we cancel?
        // For simplicity, let's just mark it COMPLETED or CANCELLED based on admin
        // decision.
        trade.setStatus(resolveToBuyer ? TradeStatus.COMPLETED : TradeStatus.CANCELLED);
        tradeRepository.save(trade);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<Void> updateUserStatus(@PathVariable UUID userId, @RequestParam boolean active) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(active);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .map(u -> new UserDto(u.getId(), u.getName(), u.getEmail(), u.getRole(), u.isActive()))
                .collect(Collectors.toList()));
    }

    @GetMapping("/metrics")
    public ResponseEntity<SystemMetrics> getMetrics() {
        return ResponseEntity.ok(new SystemMetrics(
                userRepository.count(),
                tradeRepository.count(),
                cropRepository.count()));
    }

    @lombok.Data
    @lombok.AllArgsConstructor
    public static class UserDto {
        private UUID id;
        private String name;
        private String email;
        private Role role;
        private boolean active;

        public UserDto(UUID id, String name) {
            this.id = id;
            this.name = name;
        }
    }

    @lombok.Data
    @lombok.AllArgsConstructor
    public static class SystemMetrics {
        private long totalUsers;
        private long totalTrades;
        private long totalListings;
    }
}
