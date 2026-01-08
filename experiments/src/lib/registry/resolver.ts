import type { ComponentType } from "react";
import type { RegistryComponent } from "../types";
import registryData from "./registry.json";

/**
 * Component Resolver
 *
 * This is the ONLY way demo components should be loaded.
 * - No direct imports in demo pages
 * - Uses dynamic imports for code splitting
 * - Registry-driven only
 *
 * INVARIANTS:
 * - Site pages ONLY read from registry
 * - Site pages NEVER manually import components
 * - Adding a new component requires NO site code changes
 * 
 * HOW TO ADD A NEW COMPONENT:
 * 1. Add entry to registry.json
 * 2. Create demo at src/components/demos/<id>/<PascalCase>Demo.tsx
 * 3. Add to demoImports object below (required for bundler static analysis)
 * 4. Create MDX at src/content/<id>/index.mdx
 * 
 * That's it! No other code changes needed.
 */

const registry = registryData as {
  version: string;
  components: RegistryComponent[];
};

/**
 * Demo Import Registry
 *
 * STATIC IMPORT MAP - Required for bundler analysis and code splitting.
 * 
 * WHY THIS PATTERN:
 * - Dynamic import() with string interpolation breaks tree-shaking
 * - Webpack/Turbopack needs static paths to create split chunks
 * - This is the minimal touch point: just add one line per component
 * 
 * NAMING CONVENTION:
 * - Key: matches registry.json `id` (kebab-case)
 * - Path: @/components/demos/{id}/{PascalCase}Demo
 * - Export: default export
 */
const demoImports = {
  "adaptive-tooltip": () => import("@/components/demos/adaptive-tooltip/AdaptiveTooltipDemo"),
  "motion-surface": () => import("@/components/demos/motion-surface/MotionSurfaceDemo"),
  "vanish-form": () => import("@/components/demos/vanish-form/VanishFormDemo"),
  "magnetic-button": () => import("@/components/demos/magnetic-button/MagneticButtonDemo"),
} as const satisfies Record<string, () => Promise<{ default: ComponentType<Record<string, unknown>> }>>;

type DemoId = keyof typeof demoImports;

/* ──────────────────────────────────────────────────────────────── */
/* Runtime Assertions                                                */
/* ──────────────────────────────────────────────────────────────── */

/**
 * Validate registry integrity at runtime.
 * Checks that all registry entries have corresponding demo mappings.
 */
function validateRegistryIntegrity(): void {
  const registryIds = new Set(registry.components.map((c) => c.id));
  const importMapIds = new Set(Object.keys(demoImports));

  // Check for registry entries without demos
  const missingDemos = Array.from(registryIds).filter(
    (id) => !importMapIds.has(id)
  );

  if (missingDemos.length > 0) {
    console.error(
      `[resolver] Registry validation failed!\n` +
        `The following components are in registry.json but have no demo mapping:\n` +
        `  ${missingDemos.join(", ")}\n` +
        `Add entry to demoImports in src/lib/registry/resolver.ts`
    );
  }

  // Check for demos without registry entries
  const orphanedDemos = Array.from(importMapIds).filter(
    (id) => !registryIds.has(id)
  );

  if (orphanedDemos.length > 0) {
    console.warn(
      `[resolver] Demo imports have entries not in registry:\n` +
        `  ${orphanedDemos.join(", ")}\n` +
        `These demos will never be used.`
    );
  }

  if (missingDemos.length === 0 && orphanedDemos.length === 0) {
    console.info(
      `[resolver] Registry validation passed: ${registryIds.size} components registered`
    );
  }
}

// Run validation at module load (browser only)
if (typeof window !== "undefined") {
  validateRegistryIntegrity();
}

/* ──────────────────────────────────────────────────────────────── */
/* Registry Queries                                                  */
/* ──────────────────────────────────────────────────────────────── */

export function getComponentMetadata(
  id: string
): RegistryComponent | null {
  return registry.components.find((c) => c.id === id) ?? null;
}

export function getAllComponentsMetadata(): RegistryComponent[] {
  return registry.components;
}

export function getFeaturedComponentsMetadata(): RegistryComponent[] {
  return registry.components.filter((c) => c.featured);
}

export function getComponentsByCategory(
  category: string
): RegistryComponent[] {
  return registry.components.filter((c) => c.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(
    new Set(registry.components.map((c) => c.category))
  ).sort();
}

/* ──────────────────────────────────────────────────────────────── */
/* Component Resolution                                              */
/* ──────────────────────────────────────────────────────────────── */

/**
 * Resolve and dynamically import a demo component by registry ID.
 *
 * This function:
 * - Validates registry existence
 * - Imports demo via explicit import map
 * - Returns the demo component and metadata
 *
 * @throws Error (controlled, descriptive)
 */
export async function resolveComponent(
  id: string
): Promise<{
  Component: ComponentType<Record<string, unknown>>;
  metadata: RegistryComponent;
}> {
  const metadata = getComponentMetadata(id);

  if (!metadata) {
    throw new Error(
      `Component "${id}" not found in registry. ` +
        `Available components: ${registry.components
          .map((c) => c.id)
          .join(", ")}`
    );
  }

  const importFn = demoImports[id as DemoId];

  if (!importFn) {
    throw new Error(
      `Component "${id}" is registered but has no demo import. ` +
        `Add an entry to demoImports in src/lib/registry/resolver.ts`
    );
  }

  try {
    const module = await importFn();
    const Component = module.default;

    if (!Component) {
      throw new Error(
        `No default export found for demo "${id}".`
      );
    }

    return { Component, metadata };
  } catch (error) {
    throw new Error(
      `Failed to resolve demo for "${id}". ` +
        `Error: ${
          error instanceof Error
            ? error.message
            : String(error)
        }`
    );
  }
}
