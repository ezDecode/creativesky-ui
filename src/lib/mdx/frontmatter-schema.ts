/**
 * MDX Frontmatter Schema
 * 
 * Zod schema for validating MDX frontmatter at parse time.
 * If validation fails, returns safe defaults and logs warning.
 */

import { z } from 'zod';

// Frontmatter schema - all fields optional with safe defaults
export const MDXFrontmatterSchema = z.object({
    name: z.string().optional().default('Untitled'),
    title: z.string().optional().default('Untitled'),
    description: z.string().optional().default(''),
    category: z.string().optional().default('uncategorized'),
    version: z.string().optional(),
    source: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    dependencies: z.array(z.string()).optional().default([]),
}).passthrough(); // Allow additional fields

// Safe default frontmatter for when parsing fails
export const DEFAULT_FRONTMATTER: MDXFrontmatter = {
    name: 'Untitled',
    title: 'Untitled',
    description: '',
    category: 'uncategorized',
    tags: [],
    dependencies: [],
};

// Type export
export type MDXFrontmatter = z.infer<typeof MDXFrontmatterSchema>;

/**
 * Safely parse frontmatter with fallback to defaults.
 * Logs warning on parse failure but doesn't throw.
 */
export function parseFrontmatter(data: unknown): MDXFrontmatter {
    const result = MDXFrontmatterSchema.safeParse(data);

    if (!result.success) {
        console.warn('[MDX] Frontmatter validation failed:', result.error.format());
        return DEFAULT_FRONTMATTER;
    }

    return result.data;
}
