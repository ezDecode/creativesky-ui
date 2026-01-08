/**
 * MDX System - Central Export
 * 
 * Complete MDX compilation and rendering system for Next.js App Router.
 * 
 * ARCHITECTURE:
 * - Compiler: MDX → JavaScript (cached)
 * - Loader: Filesystem → Compiled MDX
 * - Components: Custom component mapping
 * - Performance: Monitoring and optimization
 * 
 * USAGE:
 * ```tsx
 * import { loadComponentMDX, getMDXComponents } from '@/lib/mdx';
 * 
 * const mdx = await loadComponentMDX('adaptive-tooltip');
 * return <mdx.Component components={getMDXComponents()} />;
 * ```
 */

// Core compilation
export {
  compileMDX,
  compileAndExecuteMDX,
  clearMDXCache,
  getMDXCacheStats,
} from './compiler';

// File loading
export {
  loadMDXFile,
  loadComponentMDX,
  preloadComponentMDX,
  type LoadedMDX,
} from './loader';

// Component mapping
export {
  getMDXComponents,
  mergeMDXComponents,
  type MDXComponents,
} from './components';

// Build-time utilities
export {
  preloadAllMDX,
  validateMDXCompilation,
} from './preload';

// Performance monitoring
export {
  mdxPerformanceMonitor,
  measureAsync,
  assertCompilePerformance,
  checkCacheHealth,
} from './performance';

// Types
export type {
  MDXFrontmatter,
} from './types';

