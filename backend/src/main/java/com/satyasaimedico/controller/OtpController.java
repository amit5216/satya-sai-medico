package com.satyasaimedico.controller;

import com.satyasaimedico.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * ============================================================
 * OTP CONTROLLER — Mobile Verification Endpoints
 * ============================================================
 *
 * 🎓 FLOW:
 *   POST /api/otp/send    → Generate & send OTP to mobile
 *   POST /api/otp/verify   → Verify OTP entered by patient
 *
 * 🎓 INTERVIEW: "Why separate OTP from Appointment?"
 * → "Single Responsibility Principle. OTP is a reusable verification
 *    mechanism that could be used for login, password reset, etc.
 *    By keeping it separate, we can reuse it across features."
 */
@RestController
@RequestMapping("/api/otp")
@RequiredArgsConstructor
public class OtpController {

    private final OtpService otpService;

    /**
     * POST /api/otp/send
     * Body: { "mobile": "7385312823" }
     * Response: { "message": "OTP sent successfully", "expiresInMinutes": 5 }
     */
    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendOtp(@RequestBody Map<String, String> body) {
        String mobile = body.get("mobile");

        if (mobile == null || !mobile.matches("^[0-9]{10}$")) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid mobile number. Must be 10 digits."
            ));
        }

        String generatedOtp = otpService.generateOtp(mobile);

        // DEV MODE: Return OTP in response for testing (remove in production!)
        return ResponseEntity.ok(Map.of(
            "message", "OTP sent successfully",
            "expiresInMinutes", 5,
            "devOtp", generatedOtp  // ⚠️ Remove this line in production
        ));
    }

    /**
     * POST /api/otp/verify
     * Body: { "mobile": "7385312823", "otp": "123456" }
     * Response: { "verified": true }
     */
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, String> body) {
        String mobile = body.get("mobile");
        String otp = body.get("otp");

        if (mobile == null || otp == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Mobile and OTP are required"
            ));
        }

        boolean verified = otpService.verifyOtp(mobile, otp);

        if (verified) {
            return ResponseEntity.ok(Map.of(
                "verified", true,
                "message", "Mobile number verified successfully"
            ));
        } else {
            return ResponseEntity.ok(Map.of(
                "verified", false,
                "message", "Invalid or expired OTP. Please try again."
            ));
        }
    }
}
