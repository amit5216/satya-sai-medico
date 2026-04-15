package com.satyasaimedico.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * ============================================================
 * HOSPITAL SERVICE ENTITY — Maps to the `hospital_service` table
 * ============================================================
 *
 * Represents services offered by the hospital:
 * - Health Checkups
 * - Pregnancy Care
 * - Delivery Services
 * - Any custom services added by Admin
 *
 * 🎓 WHY TABLE NAME "hospital_service" (not "service")?
 * "service" is a RESERVED WORD in MySQL. Using it as a table name
 * would cause SQL errors. Always avoid reserved words!
 * Other reserved words to avoid: order, group, user, select, table
 */
@Entity
@Table(name = "hospital_service")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HospitalService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    /**
     * Detailed description shown on the website.
     * Using TEXT type for longer content.
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * URL or icon class name for the service icon.
     * Could be a Font Awesome class or image URL.
     */
    @Column(length = 500)
    private String iconUrl;

    /**
     * Controls visibility on the website.
     * Admin can add services but keep them hidden until ready.
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
}
