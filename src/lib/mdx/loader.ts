import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { compileAndExecuteMDX } from './compiler';
import type { ComponentType } from 'react';
import type { MDXFrontmatter } from './types';

export interface LoadedMDX {
  frontmatter: MDXFrontmatter;
  source: any;
  rawContent: string;
}

export async function loadMDXFile(filePath: string): Promise<LoadedMDX> {
  const rawContent = readFileSync(filePath, 'utf-8');
  const { data: frontmatter } = matter(rawContent);

  const { source } = await compileAndExecuteMDX(
    rawContent,
    filePath
  );

  return {
    frontmatter: frontmatter as MDXFrontmatter,
    source,
    rawContent,
  };
}

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
    console.error(`Failed to load MDX for component "${slug}":`, error);
    return null;
  }
}

export async function preloadComponentMDX(slugs: string[]): Promise<Map<string, LoadedMDX>> {
  const loaded = new Map<string, LoadedMDX>();
  
  for (const slug of slugs) {
    try {
      const mdx = await loadComponentMDX(slug);
      if (mdx) {
        loaded.set(slug, mdx);
      }
    } catch (error) {
      console.error(`Failed to preload MDX for "${slug}":`, error);
    }
  }
  
  return loaded;
}
