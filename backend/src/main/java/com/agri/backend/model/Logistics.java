package com.agri.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "logistics")
public class Logistics {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "trade_id", nullable = false)
    private Trade trade;

    private String trackingId;
    private String currentLocation;
    private String status; // PICKED_UP, IN_TRANSIT, DELIVERED
}
