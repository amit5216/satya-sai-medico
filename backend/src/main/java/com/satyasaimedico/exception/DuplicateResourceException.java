package com.satyasaimedico.exception;

/**
 * Custom exception for duplicate resources.
 * Example: Trying to register a patient with an existing mobile number.
 */
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}
