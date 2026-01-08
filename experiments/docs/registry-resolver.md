# Registry & Resolver System

This document explains the component registry and resolver architecture, and how to maintain them.

## Architecture Overview

The component system uses a **registry-driven architecture** to enable zero-touch component additions.

```
┌─────────────────┐
│  registry.json  │  ← Component metadata (what exists)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   resolver.ts   │  ← Dynamic imports (how to load)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Site Pages     │  ← Automatically loads components
└─────────────────┘
```

**Key Principle:** Site pages NEVER import components directly. They ONLY read from the registry.

---

## Registry (`registry.json`)

**Location:** `src/lib/registry/registry.json`

### Purpose

- **Single source of truth** for all available components
- **Metadata storage** for filtering, categorization, and display
- **Version control** for component history

### Structure

```json
{
  "version": "1.0.0",
  "components": [
    {
      "id": "component-id",
      "title": "Component Title",
      "description": "Brief description",
      "category": "ui",
      "status": "experimental",
      "tags": ["tag1", "tag2"],
      "date": "2026-01-07",
      "featured": false,
      "new": true,
      "source": {
        "type": "mdx",
        "path": "src/content/component-id/index.mdx"
      },
      "demo": {
        "variants": ["default"],
        "defaultProps": {}
      },
      "design": {
        "surface": "flat",
        "motion": "spring"
      },
      "dependencies": ["package-name"]
    }
  ]
}
```

### Field Reference

#### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique kebab-case identifier | `"magnetic-button"` |
| `title` | string | Human-readable title | `"Magnetic Button"` |
| `description` | string | One-sentence description | `"A magnetic, cursor-following..."` |
| `category` | string | Component category (lowercase) | `"ui"` |
| `status` | string | Maturity level | `"experimental"` or `"stable"` |
| `tags` | array | Technology/feature tags | `["gsap", "animation"]` |
| `date` | string | ISO date (YYYY-MM-DD) | `"2026-01-07"` |
| `featured` | boolean | Show on homepage | `false` |
| `new` | boolean | Show "new" badge | `true` |
| `dependencies` | array | NPM packages required | `["gsap", "framer-motion"]` |

#### Nested Objects

**`source`:**
```json
{
  "type": "mdx",
  "path": "src/content/component-id/index.mdx"
}
```

**`demo`:**
```json
{
  "variants": ["default", "compact", "large"],
  "defaultProps": {}
}
```

**`design`:**
```json
{
  "surface": "flat" | "elevated" | "outlined",
  "motion": "spring" | "tween" | "physics"
}
```

---

## Resolver (`resolver.ts`)

**Location:** `src/lib/registry/resolver.ts`

### Purpose

- **Dynamic component loading** with code splitting
- **Static analysis support** for bundlers (Webpack/Turbopack)
- **Runtime validation** of registry integrity

### Key Sections

#### 1. Demo Imports Map

```typescript
const demoImports = {
  "adaptive-tooltip": () => import("@/components/demos/adaptive-tooltip/AdaptiveTooltipDemo"),
  "motion-surface": () => import("@/components/demos/motion-surface/MotionSurfaceDemo"),
  "magnetic-button": () => import("@/components/demos/magnetic-button/MagneticButtonDemo"),
} as const satisfies Record<string, () => Promise<{ default: ComponentType<Record<string, unknown>> }>>;
```

**Why this pattern?**
- Bundlers need **static string paths** for code splitting
- Dynamic `import(variable)` breaks tree-shaking
- This is the **minimal touch point** when adding components

**How to add:**
```typescript
// Add one line per component:
"component-id": () => import("@/components/demos/component-id/ComponentIdDemo"),
```

#### 2. Registry Queries

Helper functions to read from registry:

```typescript
// Get single component metadata
getComponentMetadata(id: string): RegistryComponent | null

// Get all components
getAllComponentsMetadata(): RegistryComponent[]

// Get featured components
getFeaturedComponentsMetadata(): RegistryComponent[]

// Get by category
getComponentsByCategory(category: string): RegistryComponent[]

// Get all categories
getAllCategories(): string[]
```

#### 3. Component Resolution

Main function to dynamically load components:

```typescript
resolveComponent(id: string): Promise<{
  Component: ComponentType<Record<string, unknown>>;
  metadata: RegistryComponent;
}>
```

**Usage in site pages:**

```tsx
const { Component, metadata } = await resolveComponent("magnetic-button");

return (
  <div>
    <h1>{metadata.title}</h1>
    <Component />
  </div>
);
```

---

## Runtime Validation

The resolver includes automatic validation that runs in the browser:

```typescript
function validateRegistryIntegrity(): void {
  // Checks for:
  // 1. Registry entries without demo mappings
  // 2. Demo mappings without registry entries
}
```

**Console Output:**

✅ **Success:**
```
[resolver] Registry validation passed: 4 components registered
```

❌ **Missing Demo:**
```
[resolver] Registry validation failed!
The following components are in registry.json but have no demo mapping:
  new-component
Add entry to demoImports in src/lib/registry/resolver.ts
```

⚠️ **Orphaned Demo:**
```
[resolver] Demo imports have entries not in registry:
  old-component
These demos will never be used.
```

---

## Adding a Component to Registry

### Step 1: Add to `registry.json`

Add a new object to the `components` array:

```json
{
  "id": "my-component",
  "title": "My Component",
  "description": "Description here.",
  "category": "ui",
  "status": "experimental",
  "tags": ["react", "animation"],
  "date": "2026-01-07",
  "featured": false,
  "new": true,
  "source": {
    "type": "mdx",
    "path": "src/content/my-component/index.mdx"
  },
  "demo": {
    "variants": ["default"],
    "defaultProps": {}
  },
  "design": {
    "surface": "flat",
    "motion": "spring"
  },
  "dependencies": ["framer-motion"]
}
```

### Step 2: Add to `resolver.ts`

Add import mapping to `demoImports`:

```typescript
const demoImports = {
  // ... existing imports
  "my-component": () => import("@/components/demos/my-component/MyComponentDemo"),
} as const satisfies Record<string, () => Promise<{ default: ComponentType<Record<string, unknown>> }>>;
```

### Step 3: Verify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Check browser console** for validation messages

3. **Test resolution:**
   - Navigate to component page
   - Verify demo loads
   - No console errors

---

## Common Issues

### Issue: "Component not found in registry"

**Cause:** Registry entry missing or ID mismatch

**Fix:**
```json
// Ensure ID in registry.json matches folder name
{
  "id": "magnetic-button",  // ← Must match exactly
  // ...
}
```

### Issue: "No demo import"

**Cause:** Missing entry in `demoImports` in `resolver.ts`

**Fix:**
```typescript
const demoImports = {
  // Add this line:
  "magnetic-button": () => import("@/components/demos/magnetic-button/MagneticButtonDemo"),
};
```

### Issue: "Registry validation failed"

**Cause:** Mismatch between registry and resolver

**Fix:** Ensure every registry entry has a corresponding demo import:

```typescript
// registry.json has: "magnetic-button"
// resolver.ts must have:
"magnetic-button": () => import("..."),
```

### Issue: Component loads but shows wrong content

**Cause:** Demo import path is incorrect

**Fix:**
```typescript
// ❌ Wrong path
"magnetic-button": () => import("@/components/demos/MagneticButtonDemo"),

// ✅ Correct path
"magnetic-button": () => import("@/components/demos/magnetic-button/MagneticButtonDemo"),
```

---

## Maintenance Tasks

### Adding a New Category

1. Add components with the new category in `registry.json`:
   ```json
   { "category": "layout" }
   ```

2. Category automatically appears via `getAllCategories()`

### Marking a Component as Featured

```json
{
  "id": "magnetic-button",
  "featured": true,  // ← Set to true
  // ...
}
```

### Deprecating a Component

```json
{
  "id": "old-component",
  "status": "deprecated",  // ← Change status
  "new": false,
  // ...
}
```

### Removing a Component

1. Remove from `registry.json` components array
2. Remove from `demoImports` in `resolver.ts`
3. Optionally delete component files (or keep for history)

---

## Best Practices

### ✅ DO

- Keep registry entries alphabetically sorted by `id`
- Use ISO date format (YYYY-MM-DD) for `date` field
- Keep `tags` lowercase and consistent
- Run `npm run build` after registry changes
- Check browser console for validation

### ❌ DON'T

- Don't duplicate IDs
- Don't manually import components in site pages
- Don't skip resolver updates when adding to registry
- Don't use dynamic paths in resolver imports
- Don't modify the resolver validation logic without understanding it

---

## Type Safety

The resolver uses TypeScript's advanced features:

```typescript
// Ensures all registry IDs have demo imports
type DemoId = keyof typeof demoImports;

// Ensures type-safe promises
satisfies Record<string, () => Promise<{ default: ComponentType<...> }>>
```

This catches mismatches at build time.

---

## Performance

### Code Splitting

Each component demo is loaded as a separate chunk:

```
build/
├── adaptive-tooltip-demo.[hash].js
├── magnetic-button-demo.[hash].js
└── motion-surface-demo.[hash].js
```

### Lazy Loading

Components are only loaded when their page is visited:

```tsx
// Page visit triggers:
const { Component } = await resolveComponent("magnetic-button");
// → Loads magnetic-button-demo chunk
```

---

## Debugging

### Enable Verbose Logging

The resolver logs validation in browser console. Check:

1. Open DevTools → Console
2. Look for `[resolver]` messages
3. Verify component count matches expectations

### Test Resolution Manually

In browser console:

```javascript
import { resolveComponent } from '@/lib/registry/resolver';

const result = await resolveComponent('magnetic-button');
console.log(result);
// Should show: { Component, metadata }
```

---

## Migration Guide

### From Direct Imports to Registry

**Before (manual imports):**
```tsx
import MagneticButton from '@/content/magnetic-button/magnetic-button';

export default function Page() {
  return <MagneticButton />;
}
```

**After (registry-driven):**
```tsx
import { resolveComponent } from '@/lib/registry/resolver';

export default async function Page() {
  const { Component, metadata } = await resolveComponent('magnetic-button');
  return <Component />;
}
```

---

## See Also

- [Adding a Component](./adding-components.md)
- [Creating Demos](./creating-demos.md)
- [Index.mdx Standards](./index-mdx-standards.md)
