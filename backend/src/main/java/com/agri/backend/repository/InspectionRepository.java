package com.agri.backend.repository;

import com.agri.backend.model.Inspection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InspectionRepository extends JpaRepository<Inspection, UUID> {
    Optional<Inspection> findByTradeId(UUID tradeId);

    java.util.List<Inspection> findByInspectorId(UUID inspectorId);
}
