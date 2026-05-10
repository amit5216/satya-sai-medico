package com.satyasaimedico.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * ============================================================
 * WHATSAPP SERVICE — Link Generation & Integration
 * ============================================================
 *
 * 🎓 WHAT IS THIS?
 * This service generates WhatsApp deep links for medicine inquiries.
 * When a patient clicks "Contact for Price" on a medicine card,
 * they are redirected to WhatsApp with a pre-filled message.
 *
 * 🎓 HOW WHATSAPP API WORKS:
 * WhatsApp provides two integration levels:
 *
 * 1. CLICK-TO-CHAT (what we use):
 *    URL: https://wa.me/{number}?text={encoded_message}
 *    - Free, no API key needed
 *    - Opens WhatsApp with pre-filled message
 *    - User still needs to press "Send"
 *
 * 2. WHATSAPP BUSINESS API (production upgrade):
 *    - Requires Facebook Business verification
 *    - Supports automated replies, chatbots, templates
 *    - Costs money per conversation
 *    - Used by enterprise apps (Uber, Zomato, etc.)
 *
 * 🎓 INTERVIEW: "Why click-to-chat instead of full API?"
 * → "For an MVP/small clinic, click-to-chat is sufficient and free.
 *    It covers 90% of the use case (patient inquires about price).
 *    The full WhatsApp Business API would be the next step when
 *    we need automated responses and order tracking."
 *
 * 🎓 FUTURE SCOPE:
 * - Webhook to receive incoming WhatsApp messages
 * - Auto-reply with medicine price from database
 * - Order placement via WhatsApp chatbot
 */
@Service
@Slf4j
public class WhatsAppService {

    @Value("${app.whatsapp.number}")
    private String whatsappNumber;

    /**
     * Generate a WhatsApp deep link for medicine price inquiry.
     *
     * @param medicineName Name of the medicine
     * @return WhatsApp URL with pre-filled message
     */
    public String generateMedicineInquiryLink(String medicineName) {
        String message = String.format(
            "Hello, I want price details for *%s*. Please share the wholesale price and availability.",
            medicineName
        );
        return buildWhatsAppLink(message);
    }

    /**
     * Generate a WhatsApp deep link for appointment follow-up.
     *
     * @param patientName Patient's name
     * @param doctorName  Doctor's name
     * @param date        Appointment date
     * @return WhatsApp URL with pre-filled message
     */
    public String generateAppointmentLink(String patientName, String doctorName, String date) {
        String message = String.format(
            "Hello, I am %s. I have an appointment with Dr. %s on %s. Please confirm.",
            patientName, doctorName, date
        );
        return buildWhatsAppLink(message);
    }

    /**
     * Generate a general inquiry WhatsApp link.
     *
     * @param subject Subject of inquiry
     * @return WhatsApp URL
     */
    public String generateGeneralInquiryLink(String subject) {
        String message = String.format(
            "Hello, I need help with: %s",
            subject
        );
        return buildWhatsAppLink(message);
    }

    /**
     * Build the actual WhatsApp click-to-chat URL.
     */
    private String buildWhatsAppLink(String message) {
        String encoded = URLEncoder.encode(message, StandardCharsets.UTF_8);
        return String.format("https://wa.me/%s?text=%s", whatsappNumber, encoded);
    }
}
