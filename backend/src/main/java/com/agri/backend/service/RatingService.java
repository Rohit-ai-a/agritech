package com.agri.backend.service;

import com.agri.backend.model.*;
import com.agri.backend.repository.RatingRepository;
import com.agri.backend.repository.TradeRepository;
import com.agri.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final TradeRepository tradeRepository;
    private final UserRepository userRepository;

    @Transactional
    public Rating submitRating(UUID tradeId, int score, String comment) {
        User currentUser = getCurrentUser();
        Trade trade = tradeRepository.findById(tradeId)
                .orElseThrow(() -> new RuntimeException("Trade not found"));

        if (trade.getStatus() != TradeStatus.COMPLETED) {
            throw new RuntimeException("Can only rate completed trades");
        }

        if (ratingRepository.existsByTradeIdAndRaterId(tradeId, currentUser.getId())) {
            throw new RuntimeException("You have already rated this trade");
        }

        User targetUser;
        if (currentUser.getId().equals(trade.getBuyer().getId())) {
            targetUser = trade.getFarmer();
        } else if (currentUser.getId().equals(trade.getFarmer().getId())) {
            targetUser = trade.getBuyer();
        } else {
            throw new RuntimeException("You are not a party to this trade");
        }

        Rating rating = Rating.builder()
                .trade(trade)
                .rater(currentUser)
                .ratedUser(targetUser)
                .score(score)
                .comment(comment)
                .createdAt(LocalDateTime.now())
                .build();

        return ratingRepository.save(rating);
    }

    public List<Rating> getUserRatings(@NonNull UUID userId) {
        return ratingRepository.findByRatedUserId(userId);
    }

    public Double getAverageRating(UUID userId) {
        return ratingRepository.getAverageRating(userId);
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
