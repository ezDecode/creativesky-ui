/**
 * Unit Tests: source-reader.ts
 * 
 * Tests for path traversal prevention and input validation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDemoSourceCode, getComponentSourceCode } from '@/lib/source-reader';
import { SecurityError } from '@/lib/errors';

// Mock the fs module
vi.mock('fs', () => ({
    default: {
        existsSync: vi.fn(() => true),
        readFileSync: vi.fn(() => 'mock source code'),
    },
    existsSync: vi.fn(() => true),
    readFileSync: vi.fn(() => 'mock source code'),
}));

// Mock the registry resolver
vi.mock('@/lib/registry/resolver', () => ({
    getComponentMetadata: vi.fn((id: string) => {
        const validComponents: Record<string, any> = {
            'adaptive-tooltip': { id: 'adaptive-tooltip', pricing: 'free' },
            'magnetic-button': { id: 'magnetic-button', pricing: 'free' },
            'filter-chips': { id: 'filter-chips', pricing: 'paid' },
            'scroll-reveal-text': { id: 'scroll-reveal-text', pricing: 'free' },
        };
        return validComponents[id] || null;
    }),
}));

describe('source-reader', () => {
    describe('getDemoSourceCode', () => {
        it('should throw SecurityError for path traversal attempts', () => {
            expect(() => getDemoSourceCode('../etc/passwd')).toThrow(SecurityError);
            expect(() => getDemoSourceCode('../../secret')).toThrow(SecurityError);
            expect(() => getDemoSourceCode('..\\..\\windows\\system32')).toThrow(SecurityError);
        });

        it('should throw SecurityError with INVALID_ID_FORMAT code for malformed IDs', () => {
            try {
                getDemoSourceCode('../etc/passwd');
            } catch (err) {
                expect(err).toBeInstanceOf(SecurityError);
                expect((err as SecurityError).code).toBe('INVALID_ID_FORMAT');
            }
        });

        it('should throw SecurityError for unknown components', () => {
            expect(() => getDemoSourceCode('nonexistent-component')).toThrow(SecurityError);
        });

        it('should throw SecurityError with UNKNOWN_COMPONENT code', () => {
            try {
                getDemoSourceCode('unknown-component');
            } catch (err) {
                expect(err).toBeInstanceOf(SecurityError);
                expect((err as SecurityError).code).toBe('UNKNOWN_COMPONENT');
            }
        });

        it('should return source code for valid component IDs', () => {
            const result = getDemoSourceCode('adaptive-tooltip');
            expect(result).toBe('mock source code');
        });

        it('should allow lowercase letters, numbers, and hyphens only', () => {
            // These should all throw for format violations
            expect(() => getDemoSourceCode('Component')).toThrow(SecurityError); // uppercase
            expect(() => getDemoSourceCode('my_component')).toThrow(SecurityError); // underscore
            expect(() => getDemoSourceCode('my.component')).toThrow(SecurityError); // dot
            expect(() => getDemoSourceCode('my component')).toThrow(SecurityError); // space
        });
    });

    describe('getComponentSourceCode', () => {
        it('should throw SecurityError for path traversal attempts', () => {
            expect(() => getComponentSourceCode('../etc/passwd')).toThrow(SecurityError);
            expect(() => getComponentSourceCode('../../secret')).toThrow(SecurityError);
        });

        it('should throw SecurityError for unknown components', () => {
            expect(() => getComponentSourceCode('fake-component')).toThrow(SecurityError);
        });

        it('should return source code for valid component IDs', () => {
            const result = getComponentSourceCode('magnetic-button');
            expect(result).toBe('mock source code');
        });
    });
});
