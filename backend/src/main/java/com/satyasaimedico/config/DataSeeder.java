package com.satyasaimedico.config;

import com.satyasaimedico.model.Admin;
import com.satyasaimedico.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Only seed if no admin exists (first startup)
        if (adminRepository.count() == 0) {
            Admin admin = Admin.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .build();

            adminRepository.save(admin);

            System.out.println("════════════════════════════════════════════");
            System.out.println("  DEFAULT ADMIN CREATED");
            System.out.println("  Username: admin");
            System.out.println("  Password: admin123");
            System.out.println("  ⚠️  CHANGE THIS PASSWORD IN PRODUCTION!");
            System.out.println("════════════════════════════════════════════");
        }
    }
}
