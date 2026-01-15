import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { compileAndExecuteMDX } from './compiler';
import { parseFrontmatter, type MDXFrontmatter } from './frontmatter-schema';

export interface LoadedMDX {
  frontmatter: MDXFrontmatter;
  source: any;
  rawContent: string;
}

export async function loadMDXFile(filePath: string): Promise<LoadedMDX> {
  const rawContent = readFileSync(filePath, 'utf-8');
  const { data } = matter(rawContent);

  // Validate frontmatter with Zod (returns safe defaults on failure)
  const frontmatter = parseFrontmatter(data);

  const { source } = await compileAndExecuteMDX(
    rawContent,
    filePath
  );

  return {
    frontmatter,
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
