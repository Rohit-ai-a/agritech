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

    @GetMapping("/trades/pending-assignment")
    public ResponseEntity<List<TradeDto.TradeResponse>> getPendingAssignmentTrades() {
        List<Trade> trades = tradeRepository.findAll().stream()
                .filter(t -> t.getStatus() == TradeStatus.AGREED || t.getStatus() == TradeStatus.INSPECTION_REQUESTED)
                .collect(Collectors.toList());
        // We need manually map or expose mapper. For speed, manual small validation.
        return ResponseEntity.ok(trades.stream().map(t -> TradeDto.TradeResponse.builder()
                .id(t.getId())
                .cropId(t.getCrop().getId()) // Added cropId which was missing in builder call if used
                .cropName(t.getCrop().getName())
                .farmerName(t.getFarmer().getName())
                .farmerState(t.getFarmer().getState()) // Populate state
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
                .ok(inspectors.stream().map(u -> new UserDto(u.getId(), u.getName(), u.getState()))
                        .collect(Collectors.toList()));
    }

    // ... forceCloseDispute ...

    // ... updateUserStatus ...

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .map(u -> new UserDto(u.getId(), u.getName(), u.getEmail(), u.getState(), u.getRole(), u.isActive())) // Update
                                                                                                                      // constructor
                                                                                                                      // call
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
        private String state;
        private Role role;
        private boolean active;

        public UserDto(UUID id, String name, String state) {
            this.id = id;
            this.name = name;
            this.state = state;
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
