package com.agri.backend.controller;

import com.agri.backend.dto.TradeDto;
import com.agri.backend.model.TradeStatus;
import com.agri.backend.service.TradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trades")
@RequiredArgsConstructor
public class TradeController {

    private final TradeService service;

    @PostMapping
    public ResponseEntity<TradeDto.TradeResponse> initiateTrade(@RequestBody TradeDto.TradeRequest request) {
        return ResponseEntity.ok(service.initiateTrade(request));
    }

    @GetMapping("/my-trades")
    public ResponseEntity<List<TradeDto.TradeResponse>> getMyTrades() {
        return ResponseEntity.ok(service.getMyTrades());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TradeDto.TradeResponse> updateStatus(
            @PathVariable UUID id,
            @RequestParam TradeStatus status) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }

    @GetMapping("/{id}/events")
    public ResponseEntity<java.util.List<com.agri.backend.model.TradeEvent>> getTradeEvents(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getTradeEvents(id));
    }
}
