package com.satyasaimedico.exception;

/**
 * Custom exception for "resource not found" scenarios.
 * Extends RuntimeException so we don't need to declare it in method signatures.
 *
 * Example usage:
 *   throw new ResourceNotFoundException("Doctor not found with id: " + id);
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
