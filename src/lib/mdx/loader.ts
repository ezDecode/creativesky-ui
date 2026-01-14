import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { compileAndExecuteMDX } from './compiler';
import type { ComponentType } from 'react';
import type { MDXFrontmatter } from './types';

export interface LoadedMDX {
  frontmatter: MDXFrontmatter;
  Content: ComponentType<{ components?: Record<string, ComponentType<any>> }>;
  rawContent: string;
}

export async function loadMDXFile(filePath: string): Promise<LoadedMDX> {
  const rawContent = readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: mdxBody } = matter(rawContent);

  const mdxModule = await compileAndExecuteMDX(
    rawContent,
    filePath
  );

  return {
    frontmatter: frontmatter as MDXFrontmatter,
    Content: mdxModule.default,
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
