/**
 * Registry Schema
 * 
 * Zod schemas for runtime validation of registry.json
 * Ensures data integrity and provides clear error messages on parse failures.
 */

import { z } from 'zod';

// Component category enum
export const ComponentCategorySchema = z.enum([
    'animation',
    'interaction',
    'form',
    'navigation',
    'layout',
    'visual',
    'data-display',
    'feedback',
    'ui',
]);

// Component status enum
export const ComponentStatusSchema = z.enum(['stable', 'experimental', 'deprecated']);

// Component pricing enum
export const ComponentPricingSchema = z.enum(['free', 'paid']);

// Component source type enum
export const ComponentSourceTypeSchema = z.enum(['local', 'remote', 'user-uploaded', 'mdx']);

// Component source schema
export const ComponentSourceSchema = z.object({
    type: ComponentSourceTypeSchema,
    path: z.string().min(1),
    url: z.string().url().optional(),
});

// Component demo schema
export const ComponentDemoSchema = z.object({
    variants: z.array(z.string()).default(['default']),
    defaultProps: z.record(z.string(), z.unknown()).default({}),
    scrollable: z.boolean().optional(),
    external: z.string().url().optional(),
    minHeight: z.string().optional(),
});

// Component design schema
export const ComponentDesignSchema = z.object({
    surface: z.enum(['flat', 'elevated', 'inset', 'glassmorphic']),
    motion: z.enum(['spring', 'smooth', 'linear', 'none', 'scroll-locked']),
});

// Author schema
export const AuthorSchema = z.object({
    name: z.string().min(1),
    url: z.string().url().optional(),
});

// Single component schema
export const RegistryComponentSchema = z.object({
    id: z.string().regex(/^[a-z0-9-]+$/, 'Component ID must be lowercase alphanumeric with hyphens'),
    title: z.string().min(1),
    description: z.string().min(1),
    category: ComponentCategorySchema,
    status: ComponentStatusSchema,
    pricing: ComponentPricingSchema,
    tags: z.array(z.string()).default([]),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
    featured: z.boolean().optional().default(false),
    new: z.boolean().optional().default(false),
    source: ComponentSourceSchema,
    demo: ComponentDemoSchema,
    design: ComponentDesignSchema,
    readme: z.string().optional(),
    dependencies: z.array(z.string()).optional().default([]),
    author: AuthorSchema.optional(),
});

// Full registry schema
export const RegistrySchema = z.object({
    version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semver format'),
    components: z.array(RegistryComponentSchema),
});

// Type exports for use in other files
export type RegistryComponent = z.infer<typeof RegistryComponentSchema>;
export type Registry = z.infer<typeof RegistrySchema>;
