package com.agri.backend.repository;

import com.agri.backend.model.Logistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LogisticsRepository extends JpaRepository<Logistics, UUID> {
    Optional<Logistics> findByTradeId(UUID tradeId);
}
