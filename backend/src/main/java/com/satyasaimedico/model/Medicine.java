package com.satyasaimedico.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * ============================================================
 * MEDICINE ENTITY — Maps to the `medicine` table
 * ============================================================
 *
 * Represents wholesale medicine products shown on the website.
 * Users can click "Contact for Price" which opens WhatsApp
 * with a prefilled message.
 *
 * NOTE: We do NOT store prices here because:
 * 1. Wholesale prices change frequently
 * 2. Prices depend on quantity and buyer
 * 3. The business model is "Contact for Price" via WhatsApp
 */
@Entity
@Table(name = "medicine")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Product image URL.
     * Will be displayed on the Wholesale Medicines page.
     */
    @Column(length = 500)
    private String imageUrl;

    /**
     * Category for filtering/grouping medicines.
     * e.g., "Antibiotics", "Pain Relief", "Vitamins", etc.
     */
    @Column(length = 100)
    private String category;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
}
