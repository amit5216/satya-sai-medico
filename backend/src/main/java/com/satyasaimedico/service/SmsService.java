package com.satyasaimedico.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * ============================================================
 * SMS SERVICE — Twilio Integration
 * ============================================================
 *
 * Twilio is a cloud communications platform.
 * Free trial gives $15 credits (~200 SMS), no recharge needed.
 *
 * HOW IT WORKS:
 * 1. Twilio SDK is initialized with Account SID + Auth Token
 * 2. Message.creator() sends SMS via Twilio REST API
 * 3. Twilio delivers the SMS to the user's phone
 *
 * FLOW:
 *   Admin confirms/cancels appointment
 *       ↓
 *   AppointmentService.updateAppointmentStatus()
 *       ↓
 *   SmsService.sendAppointmentConfirmation() / sendAppointmentCancellation()
 *       ↓
 *   Twilio SDK → Twilio API
 *       ↓
 *   User receives SMS on mobile
 *
 * NOTE: SMS failure never breaks the appointment status update.
 */
@Service
@Slf4j
public class SmsService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String fromNumber;

    // Initialize Twilio SDK once when the bean is created
    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
        log.info("Twilio SMS service initialized");
    }

    public void sendAppointmentConfirmation(String mobile, Long bookingId,
                                             String doctorName, String date) {
        String message = String.format(
            "Dear Patient, your appointment at Satya Sai Medico is CONFIRMED. " +
            "Booking ID: #%d ,"+
            "Doctor: %s ," + 
            "Date: %s. " +
            "Please arrive 20 mins early. -Satya Sai Medico",
            bookingId, doctorName, date
        );
        sendSms(mobile, message);
    }

    public void sendAppointmentCancellation(String mobile, Long bookingId,
                                             String doctorName, String date) {
        String message = String.format(
            "We're sorry! Your appointment at Satya Sai Medico has been CANCELLED. " +
            "Booking ID: #%d ,"+
            "Doctor: %s ,"+
            "Date: %s. " +
            "Please call us to reschedule. We apologize for the inconvenience. -Satya Sai Medico",
            bookingId, doctorName, date
        );
        sendSms(mobile, message);
    }

    private void sendSms(String mobile, String message) {
        try {
            Message msg = Message.creator(
                new PhoneNumber("+91" + mobile),
                new PhoneNumber(fromNumber),
                message
            ).create();
            log.info("SMS sent to {} | SID: {} | Status: {}", mobile, msg.getSid(), msg.getStatus());
        } catch (Exception e) {
            // SMS failure should NEVER break the main appointment flow
            log.error("SMS failed for {}: {}", mobile, e.getMessage());
        }
    }
}
