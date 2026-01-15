import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import { LRUCache } from 'lru-cache';

/**
 * MDX Compiler with LRU Cache
 * 
 * Features:
 * - LRU eviction with configurable max size (50MB default)
 * - TTL-based expiration (1 hour)
 * - Size-based eviction using serialized content length
 */

interface CachedMDX {
  source: any;
  compiledAt: number;
}

// LRU Cache configuration
const CACHE_MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour
const CACHE_MAX_ENTRIES = 200;

/**
 * Calculate approximate size of compiled MDX in bytes
 */
function calculateSize(value: CachedMDX): number {
  // Rough estimate: JSON stringify length in bytes
  try {
    return JSON.stringify(value.source).length * 2; // *2 for UTF-16
  } catch {
    return 1024; // Default 1KB if can't calculate
  }
}

/**
 * LRU Cache for compiled MDX
 * - Evicts least recently used items when size limit reached
 * - Automatically expires items after TTL
 */
const compiledMDXCache = new LRUCache<string, CachedMDX>({
  max: CACHE_MAX_ENTRIES,
  maxSize: CACHE_MAX_SIZE_BYTES,
  sizeCalculation: calculateSize,
  ttl: CACHE_TTL_MS,
  // In development, don't use TTL to allow hot reload
  ttlAutopurge: process.env.NODE_ENV === 'production',
});

/**
 * Compile MDX content using next-mdx-remote
 * Returns the serialized source instead of a component to allow RSC boundary crossing
 */
export async function compileMDX(
  source: string,
  cacheKey?: string
): Promise<{ source: any }> {
  // Check cache
  if (cacheKey) {
    const cached = compiledMDXCache.get(cacheKey);
    if (cached) {
      return { source: cached.source };
    }
  }

  const { content } = matter(source);

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [],
    },
    parseFrontmatter: false,
  });

  // Cache the result
  if (cacheKey) {
    compiledMDXCache.set(cacheKey, {
      source: mdxSource,
      compiledAt: Date.now(),
    });
  }

  return { source: mdxSource };
}

export async function compileAndExecuteMDX(
  source: string,
  cacheKey?: string
): Promise<{ source: any }> {
  return compileMDX(source, cacheKey);
}

export function clearMDXCache(): void {
  compiledMDXCache.clear();
}

export function getMDXCacheStats() {
  return {
    size: compiledMDXCache.size,
    calculatedSize: compiledMDXCache.calculatedSize,
    maxSize: CACHE_MAX_SIZE_BYTES,
    maxEntries: CACHE_MAX_ENTRIES,
    ttl: CACHE_TTL_MS,
  };
}

