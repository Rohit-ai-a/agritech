package com.agri.backend.controller;

import com.agri.backend.dto.CropDto;
import com.agri.backend.service.CropService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
@RequiredArgsConstructor
public class CropController {

    private final CropService service;

    @PostMapping
    public ResponseEntity<CropDto.CropResponse> createCrop(@RequestBody CropDto.CropRequest request) {
        return ResponseEntity.ok(service.createCrop(request));
    }

    @GetMapping
    public ResponseEntity<List<CropDto.CropResponse>> getAllCrops(
            @RequestParam(required = false) String state) {
        return ResponseEntity.ok(service.getAllAvailableCrops(state));
    }

    @GetMapping("/my-listings")
    public ResponseEntity<List<CropDto.CropResponse>> getMyCrops() {
        return ResponseEntity.ok(service.getMyCrops());
    }
}
