import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';

/**
 * In-memory cache for compiled MDX
 */
const compiledMDXCache = new Map<string, { 
  source: any;
  compiledAt: number;
}>();

const CACHE_SIZE_LIMIT = 100;
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour in production

/**
 * Compile MDX content using next-mdx-remote
 * Returns the serialized source instead of a component to allow RSC boundary crossing
 */
export async function compileMDX(
  source: string,
  cacheKey?: string
): Promise<{ source: any }> {
  // Check cache
  if (cacheKey && compiledMDXCache.has(cacheKey)) {
    const cached = compiledMDXCache.get(cacheKey)!;
    const age = Date.now() - cached.compiledAt;
    
    if (process.env.NODE_ENV === 'development' || age < CACHE_TTL_MS) {
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

  if (cacheKey) {
    if (compiledMDXCache.size >= CACHE_SIZE_LIMIT) {
      const firstKey = compiledMDXCache.keys().next().value;
      if (firstKey) compiledMDXCache.delete(firstKey);
    }
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
    limit: CACHE_SIZE_LIMIT,
    ttl: CACHE_TTL_MS,
  };
}
