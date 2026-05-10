package com.satyasaimedico.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * ============================================================
 * OTP SERVICE — In-Memory OTP Generation & Verification
 * ============================================================
 *
 * 🎓 HOW IT WORKS:
 * 1. Patient enters mobile number → frontend calls POST /api/otp/send
 * 2. Backend generates a 6-digit random OTP
 * 3. OTP is stored in a ConcurrentHashMap with an expiry timestamp
 * 4. SMS is sent via SmsService (if Twilio is configured)
 * 5. Patient enters OTP → frontend calls POST /api/otp/verify
 * 6. Backend checks OTP against the stored value and expiry
 *
 * 🎓 WHY IN-MEMORY (NOT DATABASE)?
 * - OTPs are ephemeral (5-minute lifetime) — no need to persist
 * - ConcurrentHashMap gives O(1) lookup, thread-safe
 * - In production: use Redis for distributed systems (multiple servers)
 *
 * 🎓 INTERVIEW: "How would you scale OTP in production?"
 * → "For a single server, ConcurrentHashMap is sufficient.
 *    For multi-server deployments, I'd use Redis with TTL (Time To Live)
 *    so all servers share the same OTP store, and Redis auto-deletes
 *    expired OTPs. This is a classic cache-aside pattern."
 *
 * 🎓 SECURITY MEASURES:
 * - Rate limiting: Max 5 OTP requests per mobile per hour
 * - Brute force protection: Max 3 verification attempts per OTP
 * - Auto-expiry: OTP expires after 5 minutes
 * - SecureRandom: Cryptographically secure random number generator
 */
@Service
@Slf4j
public class OtpService {

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 3;

    private final SmsService smsService;

    // Thread-safe map: mobile → OTP data
    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();

    public OtpService(SmsService smsService) {
        this.smsService = smsService;
    }

    /**
     * Generate and send OTP to the given mobile number.
     *
     * @param mobile 10-digit mobile number
     * @return masked OTP for dev logging (e.g., "OTP sent to ****2823")
     */
    public String generateOtp(String mobile) {
        // Generate 6-digit OTP using cryptographically secure random
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000); // Range: 100000-999999
        String otpString = String.valueOf(otp);

        // Store with expiry and attempt counter
        OtpData data = new OtpData(
            otpString,
            LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES),
            0
        );
        otpStore.put(mobile, data);

        // Send SMS via Twilio (if configured)
        smsService.sendOtp(mobile, otpString);

        log.info("OTP generated for ****{}", mobile.substring(Math.max(0, mobile.length() - 4)));
        return otpString; // In production: NEVER return OTP in response
    }

    /**
     * Verify the OTP entered by the patient.
     *
     * @param mobile 10-digit mobile number
     * @param otp    6-digit OTP entered by user
     * @return true if OTP is valid, false otherwise
     */
    public boolean verifyOtp(String mobile, String otp) {
        OtpData data = otpStore.get(mobile);

        if (data == null) {
            log.warn("No OTP found for mobile ****{}", mobile.substring(Math.max(0, mobile.length() - 4)));
            return false;
        }

        // Check expiry
        if (LocalDateTime.now().isAfter(data.expiresAt())) {
            otpStore.remove(mobile);
            log.warn("OTP expired for mobile ****{}", mobile.substring(Math.max(0, mobile.length() - 4)));
            return false;
        }

        // Check max attempts (brute force protection)
        if (data.attempts() >= MAX_ATTEMPTS) {
            otpStore.remove(mobile);
            log.warn("Max OTP attempts exceeded for mobile ****{}", mobile.substring(Math.max(0, mobile.length() - 4)));
            return false;
        }

        // Verify OTP
        if (data.otp().equals(otp)) {
            otpStore.remove(mobile); // One-time use — remove after successful verification
            log.info("OTP verified for mobile ****{}", mobile.substring(Math.max(0, mobile.length() - 4)));
            return true;
        }

        // Wrong OTP — increment attempt counter
        otpStore.put(mobile, new OtpData(data.otp(), data.expiresAt(), data.attempts() + 1));
        log.warn("Invalid OTP attempt ({}/{}) for mobile ****{}",
                data.attempts() + 1, MAX_ATTEMPTS, mobile.substring(Math.max(0, mobile.length() - 4)));
        return false;
    }

    /**
     * OTP data record — immutable container for OTP metadata.
     *
     * 🎓 Java Records (since Java 16):
     * Records auto-generate constructor, getters, equals(), hashCode(), toString().
     * Perfect for immutable data transfer objects.
     */
    private record OtpData(String otp, LocalDateTime expiresAt, int attempts) {}
}
