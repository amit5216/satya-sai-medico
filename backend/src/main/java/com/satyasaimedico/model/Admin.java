package com.satyasaimedico.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * ============================================================
 * ADMIN ENTITY — Maps to the `admin` table in MySQL
 * ============================================================
 *
 * 🎓 WHAT IS AN ENTITY?
 * An Entity is a Java class that represents a DATABASE TABLE.
 * Each instance (object) of this class = ONE ROW in the table.
 * Each field = ONE COLUMN in the table.
 *
 * 🎓 HOW JPA/HIBERNATE WORKS INTERNALLY:
 * 1. You annotate a class with @Entity
 * 2. Hibernate reads these annotations at startup
 * 3. It generates CREATE TABLE SQL automatically
 * 4. When you save an Admin object, Hibernate generates INSERT SQL
 * 5. When you find by ID, Hibernate generates SELECT SQL
 *
 * You NEVER write SQL manually — Hibernate does it for you!
 *
 * 🎓 WHAT IS LOMBOK?
 * Lombok eliminates boilerplate code:
 *   @Data      → generates getters, setters, toString, equals, hashCode
 *   @Builder   → generates builder pattern: Admin.builder().username("x").build()
 *   @NoArgsConstructor → generates empty constructor (required by JPA)
 *   @AllArgsConstructor → generates constructor with all fields
 */
@Entity                        // Tells JPA: "This class maps to a database table"
@Table(name = "admin")         // Table name in MySQL (optional if class name = table name)
@Data                          // Lombok: generates getters, setters, toString, equals, hashCode
@Builder                       // Lombok: enables Admin.builder().username("x").build()
@NoArgsConstructor             // Lombok: empty constructor (JPA requirement)
@AllArgsConstructor            // Lombok: constructor with all fields
public class Admin {

    /**
     * @Id → Marks this field as the PRIMARY KEY
     * @GeneratedValue(IDENTITY) → Auto-increment in MySQL
     *    MySQL will automatically assign 1, 2, 3, 4... to each new row
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * @Column(unique = true) → Creates a UNIQUE constraint in MySQL
     *   Prevents duplicate usernames
     * nullable = false → Creates a NOT NULL constraint
     */
    @Column(unique = true, nullable = false, length = 50)
    private String username;

    /**
     * This stores the HASHED password, not plain text!
     * BCrypt hash looks like: $2a$10$N9qo8uLOickgx2ZMRZoMye...
     * We'll hash it using BCryptPasswordEncoder before saving.
     */
    @Column(nullable = false)
    private String password;

    /**
     * Role for future extensibility.
     * For now, it will always be "ADMIN".
     * In the future, you could add "SUPER_ADMIN", "STAFF", etc.
     */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String role = "ADMIN";
}
