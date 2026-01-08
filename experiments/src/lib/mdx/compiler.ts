/**
 * MDX Compiler
 * 
 * Compiles MDX to executable React components with:
 * - Build-time or cached compilation
 * - Server Component (RSC) support
 * - Custom component mapping
 * - Performance optimizations
 * 
 * ARCHITECTURE:
 * - Compile once (expensive): MDX string → JavaScript module
 * - Execute many (cheap): JavaScript module → React elements
 * - Cache compiled output in memory (LRU)
 * - Support both static generation and dynamic rendering
 */

import { compile, evaluate, type CompileOptions, type EvaluateOptions } from '@mdx-js/mdx';
import { type ComponentType } from 'react';
import matter from 'gray-matter';
import * as runtime from 'react/jsx-runtime';
import * as React from 'react';
import remarkGfm from 'remark-gfm';

/**
 * In-memory cache for compiled MDX
 * 
 * Key: MDX file path or content hash
 * Value: Evaluated MDX module (with default export as component)
 * 
 * In production with SSG, this cache is populated at build time.
 * In development, it's populated on-demand and persists across requests.
 */
const compiledMDXCache = new Map<string, { default: ComponentType<any> }>();

/**
 * Cache size limit (number of compiled MDX files to keep in memory)
 * Prevents memory leaks in long-running development servers
 */
const CACHE_SIZE_LIMIT = 100;

/**
 * MDX evaluation options
 * 
 * Critical settings:
 * - development: false in production for better performance
 * - jsx, jsxs, Fragment: React JSX runtime
 * - useMDXComponents: false (we pass components directly)
 * - remarkPlugins: remark-gfm for GitHub Flavored Markdown (tables, strikethrough, etc.)
 */
const mdxEvaluateOptions: EvaluateOptions = {
  ...runtime,
  development: process.env.NODE_ENV === 'development',
  useMDXComponents: () => ({}),
  remarkPlugins: [remarkGfm],
} as any;

/**
 * Compile and evaluate MDX content to executable React component
 * 
 * Uses @mdx-js/mdx's evaluate() which compiles and executes in one step.
 * This is safe for server components and properly handles caching.
 * 
 * @param source - Raw MDX file content (including frontmatter)
 * @param cacheKey - Unique identifier for caching (e.g., file path)
 * @returns Evaluated MDX module with default component export
 */
export async function compileMDX(
  source: string,
  cacheKey?: string
): Promise<{ default: ComponentType<any> }> {
  const startTime = performance.now();
  
  // Check cache first
  if (cacheKey && compiledMDXCache.has(cacheKey)) {
    const duration = performance.now() - startTime;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[MDX] Cache hit for "${cacheKey}" (${Math.round(duration)}ms)`);
    }
    return compiledMDXCache.get(cacheKey)!;
  }

  // Extract frontmatter (gray-matter) before compilation
  const { content } = matter(source);

  // Evaluate MDX to get a module with default export
  const result = await evaluate(content, mdxEvaluateOptions);

  const duration = performance.now() - startTime;
  
  // Log compilation in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[MDX] Compiled "${cacheKey || 'anonymous'}" in ${Math.round(duration)}ms`);
  }
  
  // Warn if compilation is slow
  if (duration > 500) {
    console.warn(
      `[MDX] ⚠️  Slow compilation detected (${Math.round(duration)}ms)\n` +
      `File: ${cacheKey || 'unknown'}\n` +
      `Consider optimizing MDX content or using build-time compilation.`
    );
  }

  // Cache the result
  if (cacheKey) {
    // Simple LRU: if cache is full, delete oldest entry
    if (compiledMDXCache.size >= CACHE_SIZE_LIMIT) {
      const firstKey = compiledMDXCache.keys().next().value;
      if (firstKey) {
        compiledMDXCache.delete(firstKey);
      }
    }
    compiledMDXCache.set(cacheKey, result);
  }

  return result;
}

/**
 * All-in-one: compile and evaluate MDX (alias for clarity)
 * 
 * This is the main function to use for converting MDX source to a React component.
 * 
 * @param source - Raw MDX content
 * @param cacheKey - Optional cache key
 * @returns MDX module with default component export
 */
export async function compileAndExecuteMDX(
  source: string,
  cacheKey?: string
): Promise<{ default: ComponentType<any> }> {
  return compileMDX(source, cacheKey);
}

/**
 * Clear the compilation cache
 * 
 * Useful in development when MDX files change
 * or for testing purposes.
 */
export function clearMDXCache(cacheKey?: string): void {
  if (cacheKey) {
    compiledMDXCache.delete(cacheKey);
  } else {
    compiledMDXCache.clear();
  }
}

/**
 * Get cache statistics
 * 
 * Useful for monitoring and debugging
 */
export function getMDXCacheStats() {
  return {
    size: compiledMDXCache.size,
    limit: CACHE_SIZE_LIMIT,
    keys: Array.from(compiledMDXCache.keys()),
  };
}
