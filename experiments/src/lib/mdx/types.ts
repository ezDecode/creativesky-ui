/**
 * MDX Type Definitions
 * 
 * Core types for the compiled MDX system.
 * 
 * ARCHITECTURE NOTES:
 * - Frontmatter is extracted via gray-matter before compilation
 * - MDX content is compiled to React components (no section extraction)
 * - LoadedMDX (in loader.ts) is the primary interface for working with MDX
 */

export interface MDXFrontmatter {
  name: string;
  title: string;
  description: string;
  category: string;
  version?: string;
  source?: string;
  tags?: string[];
  dependencies?: string[];
  [key: string]: any;
}
