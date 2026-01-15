/**
 * MDX Build-Time Preloader
 * 
 * This script compiles all MDX files during build time
 * to populate the cache and ensure optimal performance.
 * 
 * USAGE:
 * - Call from Next.js build process
 * - Or run as standalone script: node -r tsx/register scripts/preload-mdx.ts
 * 
 * BENEFITS:
 * - All MDX compiled before first request
 * - Catch compilation errors at build time
 * - Faster initial page loads
 */

import { getAllComponentsMetadata } from '@/lib/registry/resolver';
import { preloadComponentMDX } from '@/lib/mdx/loader';
import { getMDXCacheStats } from '@/lib/mdx/compiler';

/**
 * Preload all component MDX files
 * 
 * This should be called during the build process
 * to ensure all MDX is compiled and cached.
 */
export async function preloadAllMDX() {
  console.log('[MDX Preload] Starting MDX compilation...');
  const startTime = performance.now();

  // Get all component metadata from registry
  const components = getAllComponentsMetadata();
  const slugs = components.map(c => c.id);

  console.log(`[MDX Preload] Found ${slugs.length} components to process`);

  // Preload all MDX files
  const loaded = await preloadComponentMDX(slugs);

  const endTime = performance.now();
  const duration = Math.round(endTime - startTime);

  console.log(`[MDX Preload] ✓ Compiled ${loaded.size} MDX files in ${duration}ms`);

  // Show cache stats
  const stats = getMDXCacheStats();
  console.log(`[MDX Preload] Cache size: ${stats.size}/${stats.maxEntries}`);

  return loaded;
}

/**
 * Validate that all MDX files compile successfully
 * 
 * Returns list of components with MDX errors
 */
export async function validateMDXCompilation() {
  const components = getAllComponentsMetadata();
  const errors: Array<{ slug: string; error: string }> = [];

  for (const component of components) {
    try {
      const { loadComponentMDX } = await import('@/lib/mdx/loader');
      await loadComponentMDX(component.id);
    } catch (error) {
      errors.push({
        slug: component.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (errors.length > 0) {
    console.error('[MDX Validation] Compilation errors found:');
    errors.forEach(({ slug, error }) => {
      console.error(`  - ${slug}: ${error}`);
    });
  } else {
    console.log('[MDX Validation] ✓ All MDX files compiled successfully');
  }

  return errors;
}

// Run preloader if executed directly
if (require.main === module) {
  preloadAllMDX()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('[MDX Preload] Failed:', error);
      process.exit(1);
    });
}
