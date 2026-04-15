package com.satyasaimedico.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

/**
 * ============================================================
 * PATIENT ENTITY — Maps to the `patient` table
 * ============================================================
 *
 * Represents a patient who books appointments.
 * Mobile number is the unique identifier (not email).
 *
 * 🎓 WHY MOBILE AS UNIQUE IDENTIFIER?
 * In India, mobile numbers are more reliable than email:
 * 1. Everyone has a mobile number
 * 2. Not everyone has an email address
 * 3. OTP verification uses mobile numbers
 * 4. WhatsApp communication uses mobile numbers
 */
@Entity
@Table(name = "patient")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    /**
     * Patient's mobile number — used as unique identifier.
     * Format: 10 digits (e.g., "7385312823")
     *
     * @Column(unique = true) creates a UNIQUE INDEX in MySQL,
     * so no two patients can have the same mobile number.
     */
    @Column(unique = true, nullable = false, length = 15)
    private String mobile;

    /**
     * Whether the mobile number has been verified via OTP.
     * We only allow appointment booking after OTP verification.
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean verified = false;

    /**
     * One patient can book many appointments over time.
     */
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, 
               fetch = FetchType.LAZY)
    @JsonIgnore  // Prevents infinite recursion: Patient → Appointment → Patient → ...
    private List<Appointment> appointments;
}
