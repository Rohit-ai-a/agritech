package com.agri.backend.service;

import com.agri.backend.dto.CropDto;
import com.agri.backend.model.Crop;
import com.agri.backend.model.CropStatus;
import com.agri.backend.model.Role;
import com.agri.backend.model.User;
import com.agri.backend.repository.CropRepository;
import com.agri.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime; // Fallback if auditing acts up in tests
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CropService {

    private final CropRepository cropRepository;
    private final UserRepository userRepository;

    @Transactional
    public CropDto.CropResponse createCrop(CropDto.CropRequest request) {
        User user = getCurrentUser();
        if (user.getRole() != Role.FARMER) {
            throw new RuntimeException("Only Farmers can post crops");
        }

        Crop crop = Crop.builder()
                .farmer(user)
                .name(request.getName())
                .category(request.getCategory())
                .quantity(request.getQuantity())
                .pricePerUnit(request.getPricePerUnit())
                .locationState(request.getLocationState())
                .imageUrl(request.getImageUrl())
                .status(CropStatus.AVAILABLE)
                .createdAt(LocalDateTime.now()) // Manual timestamp setting for safety
                .build();

        Crop saved = cropRepository.save(crop);
        return mapToResponse(saved);
    }

    public List<CropDto.CropResponse> getAllAvailableCrops(String state) {
        List<Crop> crops;
        if (state != null && !state.isBlank()) {
            crops = cropRepository.findByLocationStateAndStatus(state, CropStatus.AVAILABLE);
        } else {
            crops = cropRepository.findByStatus(CropStatus.AVAILABLE);
        }
        return crops.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<CropDto.CropResponse> getMyCrops() {
        User user = getCurrentUser();
        return cropRepository.findByFarmerId(user.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private CropDto.CropResponse mapToResponse(Crop crop) {
        return CropDto.CropResponse.builder()
                .id(crop.getId())
                .farmerName(crop.getFarmer().getName())
                .farmerId(crop.getFarmer().getId())
                .name(crop.getName())
                .category(crop.getCategory())
                .quantity(crop.getQuantity())
                .pricePerUnit(crop.getPricePerUnit())
                .locationState(crop.getLocationState())
                .imageUrl(crop.getImageUrl())
                .status(crop.getStatus())
                .createdAt(crop.getCreatedAt())
                .build();
    }
}
