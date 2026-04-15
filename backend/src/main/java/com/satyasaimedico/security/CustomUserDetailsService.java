package com.satyasaimedico.security;

import com.satyasaimedico.model.Admin;
import com.satyasaimedico.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * ============================================================
 * CUSTOM USER DETAILS SERVICE
 * ============================================================
 *
 * 🎓 WHY THIS CLASS EXISTS:
 * Spring Security needs to know HOW to load a user from YOUR database.
 * By default, it doesn't know about your Admin entity.
 *
 * This class bridges the gap:
 *   Spring Security asks: "Give me the user with username 'admin'"
 *   This class says: "Let me check my AdminRepository..."
 *   Returns a Spring Security UserDetails object with username, password, roles.
 *
 * 🎓 HOW SPRING SECURITY USES THIS:
 * 1. JwtAuthenticationFilter extracts username from JWT token
 * 2. Calls this service: loadUserByUsername("admin")
 * 3. This service fetches Admin from database
 * 4. Converts Admin → Spring Security's UserDetails
 * 5. Spring Security sets the authenticated user in SecurityContext
 *
 * 🎓 INTERVIEW: "What is UserDetailsService?"
 * → "It's a Spring Security interface with one method: loadUserByUsername().
 *    It's the contract that tells Spring Security how to find users in YOUR system.
 *    Without it, Spring Security can't authenticate anyone."
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;

    /**
     * Load a user by username for Spring Security authentication.
     *
     * @param username The username to look up
     * @return UserDetails object that Spring Security uses for authentication
     * @throws UsernameNotFoundException if the user doesn't exist
     *
     * 🎓 The returned UserDetails contains:
     *   - username (for identity)
     *   - password (BCrypt hash — Spring Security compares during login)
     *   - authorities/roles (for authorization — what can this user access?)
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Admin not found with username: " + username));

        // Convert our Admin entity → Spring Security's User object
        // SimpleGrantedAuthority("ROLE_ADMIN") → enables @PreAuthorize("hasRole('ADMIN')")
        return new User(
                admin.getUsername(),
                admin.getPassword(),
                Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + admin.getRole())
                )
        );
    }
}
