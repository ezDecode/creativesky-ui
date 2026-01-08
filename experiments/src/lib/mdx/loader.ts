/**
 * MDX File Loader
 * 
 * Handles loading and compiling MDX files from the filesystem.
 * Optimized for Next.js App Router with:
 * - Static generation support (generateStaticParams)
 * - Caching for performance
 * - Error handling and fallbacks
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { compileAndExecuteMDX } from './compiler';
import type { ComponentType } from 'react';
import type { MDXFrontmatter } from './types';

/**
 * Result of loading an MDX file
 */
export interface LoadedMDX {
  /** Frontmatter metadata */
  frontmatter: MDXFrontmatter;
  /** Compiled React component (default export from MDX module) */
  Content: ComponentType<{ components?: Record<string, ComponentType<any>> }>;
  /** Original raw content (for debugging) */
  rawContent: string;
}

/**
 * Load and compile an MDX file from the filesystem
 * 
 * This function:
 * 1. Reads the file from disk
 * 2. Extracts frontmatter
 * 3. Compiles MDX to React component
 * 4. Caches the compilation result
 * 
 * Safe for use in Server Components (async/await compatible).
 * 
 * @param filePath - Absolute path to MDX file
 * @returns Compiled MDX with frontmatter
 */
export async function loadMDXFile(filePath: string): Promise<LoadedMDX> {
  // Read file content
  const rawContent = readFileSync(filePath, 'utf-8');
  
  // Parse frontmatter
  const { data: frontmatter } = matter(rawContent);
  
  // Compile MDX (with caching via filePath as key)
  const mdxModule = await compileAndExecuteMDX(
    rawContent,
    filePath // Use file path as cache key
  );
  
  return {
    frontmatter: frontmatter as MDXFrontmatter,
    Content: mdxModule.default,
    rawContent,
  };
}

/**
 * Load MDX from a component registry path
 * 
 * Convenience function for the common pattern:
 * /src/content/{slug}/index.mdx
 * 
 * @param slug - Component slug (e.g., "adaptive-tooltip")
 * @returns Loaded MDX or null if not found
 */
export async function loadComponentMDX(slug: string): Promise<LoadedMDX | null> {
  try {
    const mdxPath = join(
      process.cwd(),
      'src',
      'content',
      slug,
      'index.mdx'
    );
    
    return await loadMDXFile(mdxPath);
  } catch (error) {
    // File doesn't exist or compilation failed
    console.error(`Failed to load MDX for component "${slug}":`, error);
    return null;
  }
}

/**
 * Preload multiple MDX files (for build-time optimization)
 * 
 * Use this in generateStaticParams or in a build script
 * to compile all MDX files upfront.
 * 
 * @param slugs - Array of component slugs
 * @returns Map of slug to loaded MDX
 */
export async function preloadComponentMDX(
  slugs: string[]
): Promise<Map<string, LoadedMDX>> {
  const results = new Map<string, LoadedMDX>();
  
  await Promise.all(
    slugs.map(async (slug) => {
      const loaded = await loadComponentMDX(slug);
      if (loaded) {
        results.set(slug, loaded);
      }
    })
  );
  
  return results;
}
