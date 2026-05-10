package com.satyasaimedico.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

/**
 * ============================================================
 * DOCTOR SCHEDULE ENTITY — Maps to the `doctor_schedule` table
 * ============================================================
 *
 * This is the "junction" entity that maps which doctor sits on which day.
 * One doctor can sit on multiple days.
 * Multiple doctors can sit on the same day.
 *
 * Example data:
 *   | id | doctor_id | day_of_week |
 *   |----|-----------|-------------|
 *   | 1  | 1         | MONDAY      |
 *   | 2  | 1         | WEDNESDAY   |
 *   | 3  | 2         | MONDAY      |  ← Dr.2 also sits on Monday
 *   | 4  | 3         | TUESDAY     |
 *
 * This gives us the timetable:
 *   Monday:    Dr.1, Dr.2
 *   Tuesday:   Dr.3
 *   Wednesday: Dr.1
 *
 * 🎓 WHY A SEPARATE TABLE?
 * Instead of storing "MONDAY,WEDNESDAY" as a comma-separated string
 * in the doctor table, we use a separate table because:
 * 1. SQL can't easily query comma-separated values
 * 2. We can add constraints (unique doctor + day combos)
 * 3. We can easily query "all doctors on Monday"
 * 4. This follows DATABASE NORMALIZATION principles
 */
@Entity
@Table(name = "doctor_schedule",
       // Unique constraint: A doctor can't have duplicate day entries
       uniqueConstraints = @UniqueConstraint(
           columnNames = {"doctor_id", "day_of_week"}
       ))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 🎓 MANY-TO-ONE RELATIONSHIP
     *
     * @ManyToOne → Many schedules belong to ONE doctor
     * @JoinColumn → Specifies the FOREIGN KEY column name in this table
     *
     * This creates: doctor_id BIGINT FOREIGN KEY REFERENCES doctor(id)
     *
     * fetch = EAGER → Always load the doctor when loading a schedule
     *   (We almost always need the doctor's name when showing schedules)
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonIgnoreProperties({"schedules", "hibernateLazyInitializer"})
    private Doctor doctor;

    /**
     * Day of the week: MONDAY, TUESDAY, WEDNESDAY, etc.
     *
     * 🎓 @Enumerated(STRING) vs ORDINAL:
     *   STRING  → Stores "MONDAY" in DB (readable, recommended)
     *   ORDINAL → Stores 0, 1, 2... (fragile — if enum order changes, data breaks!)
     *
     * ALWAYS use STRING for enums in production.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false, length = 15)
    private DayOfWeek dayOfWeek;

    /**
     * Days of the week enum.
     * Using our own enum instead of java.time.DayOfWeek
     * for cleaner JPA mapping.
     */
    public enum DayOfWeek {
        MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
    }
}
