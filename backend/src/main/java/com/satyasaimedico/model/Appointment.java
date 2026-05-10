package com.satyasaimedico.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * ============================================================
 * APPOINTMENT ENTITY — Maps to the `appointment` table
 * ============================================================
 *
 * This is the CORE entity of our system.
 * It links a Patient to a Doctor on a specific date.
 *
 * 🎓 RELATIONSHIP:
 *   Patient (1) ──→ Appointments (many)
 *   Doctor  (1) ──→ Appointments (many)
 *
 * This means:
 * - A patient can have many appointments (with different doctors)
 * - A doctor can have many appointments (from different patients)
 * - Each appointment belongs to exactly ONE patient and ONE doctor
 *
 * 🎓 LIFECYCLE:
 *   PENDING → CONFIRMED → COMPLETED
 *                ↓
 *             CANCELLED
 *
 * Admin can move appointments through these statuses.
 */
@Entity
@Table(name = "appointment")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 🎓 MANY-TO-ONE → Many appointments belong to one doctor.
     *
     * @JoinColumn(name = "doctor_id") → Creates a foreign key column
     *   that references the doctor table's primary key.
     *
     * In SQL terms:
     *   doctor_id BIGINT NOT NULL,
     *   FOREIGN KEY (doctor_id) REFERENCES doctor(id)
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    /**
     * Many appointments belong to one patient.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    /**
     * Appointment date.
     * 
     * 🎓 LocalDate vs LocalDateTime:
     *   LocalDate → Only date (2026-03-17) — used when time doesn't matter
     *   LocalDateTime → Date + time (2026-03-17T10:30:00)
     *
     * We use LocalDate because appointments are for a specific DAY,
     * not a specific time slot.
     */
    @Column(nullable = false)
    private LocalDate appointmentDate;

    /**
     * Appointment status.
     * Uses String instead of Enum for flexibility —
     * Admin might want to add custom statuses later.
     *
     * Values: PENDING, CONFIRMED, COMPLETED, CANCELLED
     */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING";

    /**
     * When the appointment was created.
     *
     * 🎓 @PrePersist LIFECYCLE CALLBACK:
     * JPA calls the @PrePersist method AUTOMATICALLY
     * just before inserting a new row into the database.
     * This ensures createdAt is always set without manual effort.
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * JPA lifecycle callback — runs before INSERT.
     * Sets the creation timestamp automatically.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
