/**
 * MDX Compiler
 * 
 * Compiles MDX to executable React components with:
 * - Build-time or cached compilation
 * - Server Component (RSC) support
 * - Custom component mapping
 * - Performance optimizations
 * - Enhanced markdown features via remark/rehype plugins
 * 
 * PLUGINS:
 * - remark-gfm: GitHub Flavored Markdown (tables, strikethrough, autolinks)
 */

import { evaluate, type EvaluateOptions } from '@mdx-js/mdx';
import { type ComponentType } from 'react';
import matter from 'gray-matter';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';

/**
 * In-memory cache for compiled MDX
 */
const compiledMDXCache = new Map<string, { 
  default: ComponentType<any>;
  compiledAt: number;
}>();

const CACHE_SIZE_LIMIT = 100;
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour in production

/**
 * MDX evaluation options with all plugins
 */
const mdxEvaluateOptions: EvaluateOptions = {
  ...runtime,
  development: process.env.NODE_ENV === 'development',
  useMDXComponents: () => ({}),
  remarkPlugins: [
    remarkGfm, // Tables, strikethrough, autolinks, task lists
  ],
  rehypePlugins: [],
} as any;

/**
 * Compile and evaluate MDX content
 */
export async function compileMDX(
  source: string,
  cacheKey?: string
): Promise<{ default: ComponentType<any> }> {
  const startTime = performance.now();
  
  // Check cache with TTL
  if (cacheKey && compiledMDXCache.has(cacheKey)) {
    const cached = compiledMDXCache.get(cacheKey)!;
    const age = Date.now() - cached.compiledAt;
    
    // In dev, always use cache; in prod, check TTL
    if (process.env.NODE_ENV === 'development' || age < CACHE_TTL_MS) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[MDX] Cache hit for "${cacheKey}" (${Math.round(performance.now() - startTime)}ms)`);
      }
      return { default: cached.default };
    }
  }

  // Extract frontmatter before compilation
  const { content } = matter(source);

  // Evaluate MDX
  const result = await evaluate(content, mdxEvaluateOptions);

  const duration = performance.now() - startTime;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[MDX] Compiled "${cacheKey || 'anonymous'}" in ${Math.round(duration)}ms`);
  }
  
  if (duration > 500) {
    console.warn(`[MDX] ⚠️  Slow compilation: ${Math.round(duration)}ms for ${cacheKey}`);
  }

  // Cache result
  if (cacheKey) {
    if (compiledMDXCache.size >= CACHE_SIZE_LIMIT) {
      const firstKey = compiledMDXCache.keys().next().value;
      if (firstKey) compiledMDXCache.delete(firstKey);
    }
    compiledMDXCache.set(cacheKey, {
      default: result.default,
      compiledAt: Date.now(),
    });
  }

  return { default: result.default };
}

export async function compileAndExecuteMDX(
  source: string,
  cacheKey?: string
): Promise<{ default: ComponentType<any> }> {
  return compileMDX(source, cacheKey);
}

export function clearMDXCache(cacheKey?: string): void {
  if (cacheKey) {
    compiledMDXCache.delete(cacheKey);
  } else {
    compiledMDXCache.clear();
  }
}

export function getMDXCacheStats() {
  return {
    size: compiledMDXCache.size,
    limit: CACHE_SIZE_LIMIT,
    keys: Array.from(compiledMDXCache.keys()),
  };
}
