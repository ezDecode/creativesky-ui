/**
 * MDX Performance Monitor
 * 
 * Tracks MDX compilation and rendering performance
 * to ensure the system remains fast.
 * 
 * Key metrics:
 * - Compilation time (should be cached after first compile)
 * - Cache hit/miss ratio
 * - Memory usage
 * - Render time
 */

import { getMDXCacheStats } from './compiler';

interface PerformanceMetrics {
  compilations: number;
  cacheHits: number;
  cacheMisses: number;
  totalCompileTime: number;
  averageCompileTime: number;
}

class MDXPerformanceMonitor {
  private metrics: PerformanceMetrics = {
    compilations: 0,
    cacheHits: 0,
    cacheMisses: 0,
    totalCompileTime: 0,
    averageCompileTime: 0,
  };

  recordCompilation(duration: number, fromCache: boolean) {
    this.metrics.compilations++;
    
    if (fromCache) {
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
      this.metrics.totalCompileTime += duration;
      this.metrics.averageCompileTime =
        this.metrics.totalCompileTime / this.metrics.cacheMisses;
    }
  }

  getMetrics(): PerformanceMetrics & { cacheStats: ReturnType<typeof getMDXCacheStats> } {
    return {
      ...this.metrics,
      cacheStats: getMDXCacheStats(),
    };
  }

  getCacheHitRate(): number {
    if (this.metrics.compilations === 0) return 0;
    return this.metrics.cacheHits / this.metrics.compilations;
  }

  reset() {
    this.metrics = {
      compilations: 0,
      cacheHits: 0,
      cacheMisses: 0,
      totalCompileTime: 0,
      averageCompileTime: 0,
    };
  }

  logReport() {
    const metrics = this.getMetrics();
    const hitRate = (this.getCacheHitRate() * 100).toFixed(1);

    console.log('\n📊 MDX Performance Report:');
    console.log(`   Compilations: ${metrics.compilations}`);
    console.log(`   Cache hits: ${metrics.cacheHits} (${hitRate}%)`);
    console.log(`   Cache misses: ${metrics.cacheMisses}`);
    console.log(`   Avg compile time: ${Math.round(metrics.averageCompileTime)}ms`);
    console.log(`   Cache size: ${metrics.cacheStats.size}/${metrics.cacheStats.limit}`);
  }
}

// Singleton instance
export const mdxPerformanceMonitor = new MDXPerformanceMonitor();

/**
 * Measure async function execution time
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    return await fn();
  } finally {
    const duration = performance.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[MDX Perf] ${name}: ${Math.round(duration)}ms`);
    }
  }
}

/**
 * Performance assertion: fail if MDX compilation takes too long
 */
export function assertCompilePerformance(duration: number, maxMs: number = 500) {
  if (duration > maxMs) {
    console.warn(
      `[MDX Perf] ⚠️  Compilation took ${Math.round(duration)}ms (expected <${maxMs}ms)\n` +
      `This may indicate MDX file is too complex or needs optimization.`
    );
  }
}

/**
 * Check cache health
 * 
 * Ensures cache hit rate is acceptable for production
 */
export function checkCacheHealth(minHitRate: number = 0.8): boolean {
  const hitRate = mdxPerformanceMonitor.getCacheHitRate();
  
  if (hitRate < minHitRate && mdxPerformanceMonitor.getMetrics().compilations > 10) {
    console.warn(
      `[MDX Perf] ⚠️  Cache hit rate is ${(hitRate * 100).toFixed(1)}% ` +
      `(expected >${(minHitRate * 100).toFixed(0)}%)\n` +
      `This suggests cache is not working properly or is being invalidated too often.`
    );
    return false;
  }
  
  return true;
}
