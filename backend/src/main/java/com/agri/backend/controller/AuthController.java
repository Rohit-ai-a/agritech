package com.agri.backend.controller;

import com.agri.backend.dto.AuthDto;
import com.agri.backend.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthDto.AuthResponse> register(
            @RequestBody AuthDto.RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> authenticate(
            @RequestBody AuthDto.LoginRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }
}
