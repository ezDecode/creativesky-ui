# Adding a New Component

This guide walks through the complete process of adding a new component to the project.

## Overview

Adding a component requires **4 files** and **NO code changes** to existing site files:

1. Component implementation (`src/content/{id}/{id}.tsx`)
2. Demo component (`src/components/demos/{id}/{PascalCase}Demo.tsx`)
3. Documentation (`src/content/{id}/index.mdx`)
4. Registry entries (`src/lib/registry/registry.json` + `resolver.ts`)

---

## Step-by-Step Process

### Step 1: Choose a Component ID

Pick a unique kebab-case identifier:

✅ Good: `magnetic-button`, `adaptive-tooltip`, `motion-drawer`
❌ Bad: `MagneticButton`, `magnetic_button`, `btn-magnetic`

**This ID will be used everywhere** (folder names, registry, imports).

---

### Step 2: Create Component File

**Location:** `src/content/{component-id}/{component-id}.tsx`

**Example:** `src/content/magnetic-button/magnetic-button.tsx`

```tsx
"use client";

import React from 'react';
// ... your imports

interface ComponentNameProps {
  children: React.ReactNode;
  className?: string;
  // ... your props
}

const ComponentName: React.FC<ComponentNameProps> = ({ 
  children,
  className = '',
  // ... destructure props
}) => {
  // ... your component logic

  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default ComponentName;
```

**Requirements:**
- Must use `"use client"` directive if using hooks/interactivity
- Must have default export
- Should be TypeScript with proper interface
- Should include proper prop types and defaults

---

### Step 3: Create Demo Component

**Location:** `src/components/demos/{component-id}/{PascalCase}Demo.tsx`

**Example:** `src/components/demos/magnetic-button/MagneticButtonDemo.tsx`

```tsx
"use client";

import React from 'react';
import ComponentName from '../../../content/{component-id}/{component-id}';

const ComponentNameDemo: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <ComponentName
        // ... demo props
      >
        Demo Content
      </ComponentName>
    </div>
  );
};

export default ComponentNameDemo;
```

**Requirements:**
- Must be in `src/components/demos/{component-id}/` folder
- File name must be `{PascalCase}Demo.tsx`
- Must use `"use client"` directive
- Must have default export
- Import path: `'../../../content/{component-id}/{component-id}'`
- Should showcase component in a visually appealing way

**Naming Convention:**
- `magnetic-button` → `MagneticButtonDemo.tsx`
- `adaptive-tooltip` → `AdaptiveTooltipDemo.tsx`
- `motion-surface` → `MotionSurfaceDemo.tsx`

---

### Step 4: Create Documentation

**Location:** `src/content/{component-id}/index.mdx`

Follow the complete guide: [Index.mdx Standards](./index-mdx-standards.md)

**Quick Template:**

```mdx
---
name: "{component-id}"
title: "Component Title"
description: "One-line description of the component."
category: "UI"
version: "1.0.0"
dependencies: ["package-name"]
source: "src/content/{component-id}/index.mdx"
---

# Component Title

Description paragraph explaining what the component does.

## Demo

<ComponentPreview name="{component-id}" />

## Usage

<DemoCode name="{component-id}" title="Demo Implementation" />

## Source Code

<ComponentCode name="{component-id}" title="Full Component" />

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to display |

## Dependencies

`package-name`
```

---

### Step 5: Update Registry

**File:** `src/lib/registry/registry.json`

Add entry to the `components` array:

```json
{
  "id": "component-id",
  "title": "Component Title",
  "description": "One-line description.",
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
```

**Field Guide:**

| Field | Example | Notes |
|-------|---------|-------|
| `id` | `"magnetic-button"` | Must match folder/file names |
| `title` | `"Magnetic Button"` | Human-readable title |
| `description` | `"A magnetic..."` | One sentence |
| `category` | `"ui"` | Lowercase in registry |
| `status` | `"experimental"` or `"stable"` | Component maturity |
| `tags` | `["gsap", "animation"]` | Related technologies |
| `date` | `"2026-01-07"` | ISO date (YYYY-MM-DD) |
| `featured` | `false` | Show on homepage? |
| `new` | `true` | Show "new" badge? |

---

### Step 6: Update Resolver

**File:** `src/lib/registry/resolver.ts`

Add one line to the `demoImports` object:

```typescript
const demoImports = {
  "adaptive-tooltip": () => import("@/components/demos/adaptive-tooltip/AdaptiveTooltipDemo"),
  "motion-surface": () => import("@/components/demos/motion-surface/MotionSurfaceDemo"),
  // ADD THIS LINE:
  "component-id": () => import("@/components/demos/component-id/ComponentIdDemo"),
} as const satisfies Record<string, () => Promise<{ default: ComponentType<Record<string, unknown>> }>>;
```

**Important:**
- Key must match component ID (kebab-case)
- Path must use `@/components/demos/` alias
- File name must be PascalCase with `Demo` suffix
- Alphabetical order is recommended but not required

---

## Verification Checklist

After adding a component, verify:

- [ ] Component file exists at `src/content/{id}/{id}.tsx`
- [ ] Demo file exists at `src/components/demos/{id}/{PascalCase}Demo.tsx`
- [ ] Documentation exists at `src/content/{id}/index.mdx`
- [ ] Registry entry added to `registry.json`
- [ ] Resolver import added to `resolver.ts`
- [ ] All IDs match (folder, files, registry, resolver)
- [ ] Build passes (`npm run build`)
- [ ] Component preview loads without errors
- [ ] No console errors in browser

---

## File Structure Summary

```
src/
├── content/
│   └── {component-id}/
│       ├── {component-id}.tsx     ← Component implementation
│       └── index.mdx              ← Documentation
├── components/
│   └── demos/
│       └── {component-id}/
│           └── {PascalCase}Demo.tsx  ← Demo component
└── lib/
    └── registry/
        ├── registry.json          ← Add metadata
        └── resolver.ts            ← Add import mapping
```

---

## Example: Adding "Magnetic Button"

1. **ID:** `magnetic-button`

2. **Files Created:**
   - `src/content/magnetic-button/magnetic-button.tsx`
   - `src/components/demos/magnetic-button/MagneticButtonDemo.tsx`
   - `src/content/magnetic-button/index.mdx`

3. **Registry Entry:**
   ```json
   {
     "id": "magnetic-button",
     "title": "Magnetic Button",
     "category": "ui",
     "status": "experimental",
     "dependencies": ["gsap"]
   }
   ```

4. **Resolver Import:**
   ```typescript
   "magnetic-button": () => import("@/components/demos/magnetic-button/MagneticButtonDemo"),
   ```

5. **Result:** Component appears in lab, demo loads, documentation renders.

---

## Troubleshooting

### Component not showing in lab
- Check registry entry exists
- Verify `id` matches everywhere
- Ensure `category` is set

### Demo fails to load
- Check resolver import path
- Verify demo file has default export
- Check for TypeScript errors

### Documentation not rendering
- Verify frontmatter is valid YAML
- Check MDX syntax
- Ensure component IDs match in `<ComponentPreview>`

### Build errors
- Run `npm run build` to see full errors
- Check TypeScript types
- Verify all imports resolve

---

## See Also

- [Index.mdx Standards](./index-mdx-standards.md)
- [Creating Demos](./creating-demos.md)
- [Registry & Resolver](./registry-resolver.md)
