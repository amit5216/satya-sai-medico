package com.satyasaimedico.config;

import com.satyasaimedico.model.Admin;
import com.satyasaimedico.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * ============================================================
 * DATA SEEDER — Seeds initial data on application startup
 * ============================================================
 *
 * 🎓 WHAT IS CommandLineRunner?
 * It's a Spring interface with a single method: run().
 * Spring calls run() AUTOMATICALLY after the application starts.
 * Perfect for seeding initial data, running setup tasks, etc.
 *
 * 🎓 WHY WE NEED THIS:
 * When the application starts for the first time, there are
 * NO admin users in the database. You can't login to create an admin
 * because you need to be logged in to create one (chicken-and-egg problem).
 *
 * Solution: Automatically create a default admin on first startup.
 *
 * 🎓 INTERVIEW: "How do you handle initial setup?"
 * → "We use a CommandLineRunner that checks if any admin exists.
 *    If not, it creates a default admin with BCrypt-hashed password.
 *    This runs only on first startup. The password should be changed
 *    immediately in production."
 */
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
