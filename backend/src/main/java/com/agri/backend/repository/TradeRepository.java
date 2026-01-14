package com.agri.backend.repository;

import com.agri.backend.model.Trade;
import com.agri.backend.model.TradeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TradeRepository extends JpaRepository<Trade, UUID> {
    List<Trade> findByBuyerId(UUID buyerId);

    List<Trade> findByFarmerId(UUID farmerId);

    List<Trade> findByStatus(TradeStatus status);
}
