package com.agri.backend.repository;

import com.agri.backend.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

@Repository
public interface RatingRepository extends JpaRepository<Rating, UUID> {
    List<Rating> findByRatedUserId(UUID ratedUserId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.ratedUser.id = :userId")
    Double getAverageRating(UUID userId);

    boolean existsByTradeIdAndRaterId(UUID tradeId, UUID raterId);
}
