/**
 * Custom Error Classes
 * 
 * Provides typed error classes for better error handling and discrimination.
 */

/**
 * SecurityError - thrown when a security violation is detected.
 * 
 * Used for:
 * - Path traversal attempts
 * - Invalid component ID formats
 * - Unknown component access attempts
 */
export class SecurityError extends Error {
    constructor(
        message: string,
        public readonly code: SecurityErrorCode = 'SECURITY_ERROR'
    ) {
        super(message);
        this.name = 'SecurityError';

        // Maintains proper stack trace for where error was thrown (V8 engines)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SecurityError);
        }
    }
}

export type SecurityErrorCode =
    | 'SECURITY_ERROR'
    | 'INVALID_ID_FORMAT'
    | 'UNKNOWN_COMPONENT'
    | 'PATH_TRAVERSAL_ATTEMPT';
