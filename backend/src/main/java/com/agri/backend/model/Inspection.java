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
@Table(name = "inspections")
public class Inspection {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "trade_id", nullable = false)
    private Trade trade;

    @ManyToOne
    @JoinColumn(name = "inspector_id")
    private User inspector;

    private String grade; // A, B, C
    private String certificateUrl;

    // Status of the assignment request: REQUESTED, ACCEPTED, REJECTED
    private String assignmentStatus;

    // Status of the inspection itself
    private String inspectionResult; // PASSED / FAILED
}
