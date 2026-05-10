package com.satyasaimedico.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

/**
 * ============================================================
 * DOCTOR ENTITY — Maps to the `doctor` table
 * ============================================================
 *
 * Each row = one doctor in the hospital.
 * A doctor has a name, specialization, and can sit on
 * multiple days (linked via DoctorSchedule).
 *
 * 🎓 RELATIONSHIP CONCEPT:
 * One Doctor → can have MANY schedules (Monday, Wednesday, Friday)
 * This is a ONE-TO-MANY relationship.
 *
 * In database terms:
 *   doctor table (1) ──→ doctor_schedule table (many)
 *   The doctor_schedule table has a doctor_id FOREIGN KEY
 */
@Entity
@Table(name = "doctor")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    /**
     * e.g., "Gynecologist", "General Physician", "Pediatrician"
     */
    @Column(nullable = false, length = 100)
    private String specialization;

    @Column(length = 15)
    private String phone;

    @Column(length = 100)
    private String email;

    /**
     * URL to the doctor's profile image.
     * Could be a local path or cloud URL (e.g., from Cloudinary).
     */
    @Column(length = 500)
    private String imageUrl;

    /**
     * Short biography displayed on the website.
     * @Column(columnDefinition = "TEXT") → Uses MySQL TEXT type
     *   instead of VARCHAR(255). TEXT can store up to 65,535 characters.
     */
    @Column(columnDefinition = "TEXT")
    private String bio;

    /**
     * Soft delete flag.
     * Instead of actually deleting a doctor from the database,
     * we set active = false. This preserves historical data
     * (past appointments still reference this doctor).
     *
     * 🎓 WHY SOFT DELETE?
     * In production, you NEVER hard-delete data in healthcare.
     * Legal/compliance requirements need historical records.
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    /**
     * 🎓 ONE-TO-MANY RELATIONSHIP
     *
     * @OneToMany → One doctor has many schedule entries
     * mappedBy = "doctor" → The DoctorSchedule entity owns the relationship
     *   (it has the foreign key column "doctor_id")
     *
     * cascade = ALL → When we delete a doctor, also delete their schedules
     * orphanRemoval = true → If a schedule is removed from this list,
     *   delete it from the database too
     *
     * fetch = LAZY → Don't load schedules unless explicitly asked
     *   (performance optimization — avoids loading unnecessary data)
     */
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, 
               orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore  // Prevents infinite recursion: Doctor → Schedule → Doctor → ...
    private List<DoctorSchedule> schedules;
}
