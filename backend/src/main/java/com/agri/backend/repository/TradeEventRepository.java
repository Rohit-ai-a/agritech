package com.agri.backend.repository;

import com.agri.backend.model.TradeEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TradeEventRepository extends JpaRepository<TradeEvent, UUID> {
    List<TradeEvent> findByTradeIdOrderByTimestampAsc(UUID tradeId);
}
