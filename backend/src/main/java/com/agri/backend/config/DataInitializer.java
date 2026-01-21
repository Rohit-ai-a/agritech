package com.agri.backend.config;

import com.agri.backend.model.Role;
import com.agri.backend.model.User;
import com.agri.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail(adminUsername)) {
            User admin = User.builder()
                    .name("Administrator")
                    .email(adminUsername)
                    .passwordHash(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .state("Maharashtra")
                    .kycStatus(true)
                    .build();
            userRepository.save(admin);
            System.out.println("Admin user seeded: " + adminUsername);
        }
    }
}
