package com.agri.backend.controller;

import com.agri.backend.model.Rating;
import com.agri.backend.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<Rating> submitRating(@RequestParam UUID tradeId, @RequestParam int score,
            @RequestParam String comment) {
        return ResponseEntity.ok(ratingService.submitRating(tradeId, score, comment));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Rating>> getUserRatings(@PathVariable UUID userId) {
        return ResponseEntity.ok(ratingService.getUserRatings(userId));
    }

    @GetMapping("/user/{userId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable UUID userId) {
        return ResponseEntity.ok(ratingService.getAverageRating(userId));
    }
}
