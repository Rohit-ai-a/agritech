package com.agri.backend.service;

import com.agri.backend.dto.AuthDto;
import com.agri.backend.model.Role;
import com.agri.backend.model.User;
import com.agri.backend.repository.UserRepository;
import com.agri.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .state(request.getState())
                .kycStatus(false) // Default false
                .build();
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthDto.AuthResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .name(user.getName())
                .build();
    }

    public AuthDto.AuthResponse authenticate(AuthDto.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthDto.AuthResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .name(user.getName())
                .build();
    }
}
