import { type ComponentType } from 'react';
import matter from 'gray-matter';
import { getMDXComponents } from './components';
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
 */
export async function compileMDX(
  source: string,
  cacheKey?: string
): Promise<{ default: ComponentType<any> }> {
  // Check cache
  if (cacheKey && compiledMDXCache.has(cacheKey)) {
    const cached = compiledMDXCache.get(cacheKey)!;
    const age = Date.now() - cached.compiledAt;
    
    if (process.env.NODE_ENV === 'development' || age < CACHE_TTL_MS) {
      const { MDXRemote } = await import('next-mdx-remote');
      const Component = (props: any) => (
        <MDXRemote {...cached.source} components={{ ...getMDXComponents(), ...props.components }} />
      );
      return { default: Component as any };
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

  const { MDXRemote } = await import('next-mdx-remote');
  const Component = (props: any) => (
    <MDXRemote {...mdxSource} components={{ ...getMDXComponents(), ...props.components }} />
  );

  return { default: Component as any };
}

export async function compileAndExecuteMDX(
  source: string,
  cacheKey?: string
): Promise<{ default: ComponentType<any> }> {
  return compileMDX(source, cacheKey);
}

export function clearMDXCache(): void {
  compiledMDXCache.clear();
}
