package com.agri.backend.service;

import com.agri.backend.model.Trade;
import com.agri.backend.model.TradeEvent;
import com.agri.backend.repository.TradeEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TradeEventService {

    private final TradeEventRepository tradeEventRepository;

    @Transactional
    public void logEvent(Trade trade, String eventType, String description) {
        TradeEvent event = TradeEvent.builder()
                .trade(trade)
                .eventType(eventType)
                .description(description)
                .build();
        tradeEventRepository.save(event);
    }

    public List<TradeEvent> getEvents(UUID tradeId) {
        return tradeEventRepository.findByTradeIdOrderByTimestampAsc(tradeId);
    }
}
