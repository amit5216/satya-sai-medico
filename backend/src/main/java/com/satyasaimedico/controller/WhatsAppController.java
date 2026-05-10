package com.satyasaimedico.controller;

import com.satyasaimedico.service.WhatsAppService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * ============================================================
 * WHATSAPP CONTROLLER — Medicine Inquiry Link Generation
 * ============================================================
 *
 * Generates WhatsApp click-to-chat URLs for the frontend.
 * The frontend can also generate these links client-side,
 * but having a backend endpoint allows:
 * 1. Centralized WhatsApp number management
 * 2. Analytics tracking (which medicines are inquired most)
 * 3. Future webhook integration for automated replies
 */
@RestController
@RequestMapping("/api/whatsapp")
@RequiredArgsConstructor
public class WhatsAppController {

    private final WhatsAppService whatsAppService;

    /**
     * GET /api/whatsapp/medicine?name=Paracetamol
     * Returns the WhatsApp link for medicine price inquiry.
     */
    @GetMapping("/medicine")
    public ResponseEntity<Map<String, String>> getMedicineLink(
            @RequestParam String name) {
        String link = whatsAppService.generateMedicineInquiryLink(name);
        return ResponseEntity.ok(Map.of(
            "whatsappLink", link,
            "medicine", name
        ));
    }

    /**
     * GET /api/whatsapp/inquiry?subject=General%20Health%20Checkup
     * Returns a general inquiry WhatsApp link.
     */
    @GetMapping("/inquiry")
    public ResponseEntity<Map<String, String>> getInquiryLink(
            @RequestParam String subject) {
        String link = whatsAppService.generateGeneralInquiryLink(subject);
        return ResponseEntity.ok(Map.of(
            "whatsappLink", link,
            "subject", subject
        ));
    }
}
