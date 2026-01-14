package com.agri.backend.repository;

import com.agri.backend.model.Crop;
import com.agri.backend.model.CropStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CropRepository extends JpaRepository<Crop, UUID> {
    List<Crop> findByStatus(CropStatus status);

    List<Crop> findByLocationStateAndStatus(String locationState, CropStatus status);

    List<Crop> findByFarmerId(UUID farmerId);
}
