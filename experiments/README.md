# Component Library | Lab & Vault

A minimalist Next.js component library and interaction laboratory. This project demonstrates production-grade UI primitives, physics-based animations, and a **registry-driven, MDX-first architecture**. Built for developers who value clarity, performance, scalability, and intentional design decisions.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Project Purpose](#project-purpose)
- [Component Architecture](#component-architecture)
- [Adding Components](#adding-components)
- [Documentation](#documentation)
- [Tech Stack](#tech-stack)
- [Component Philosophy](#component-philosophy)
- [Theme System](#theme-system)
- [Typography System](#typography-system)
- [Project Structure](#project-structure)
- [Performance Decisions](#performance-decisions)
- [Development Workflow](#development-workflow)
- [Design Principles](#design-principles)

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to see the component lab.

### Adding Your First Component

See the [Adding Components](#adding-components) section or read the detailed guides in [`docs/`](./docs/):
- [Adding a Component](./docs/adding-components.md)
- [Creating Demos](./docs/creating-demos.md)
- [Index.mdx Standards](./docs/index-mdx-standards.md)
- [Registry & Resolver](./docs/registry-resolver.md)

---

## Component Architecture

### MDX-First Documentation

All component documentation is stored as **MDX files** in `src/content/components/`. Each component has a single source of truth for metadata, documentation, examples, and API reference.

**Key Benefits:**
- ✅ Single file contains all component documentation
- ✅ Structured frontmatter for metadata
- ✅ Markdown sections for docs (Description, Usage, Props, Examples)
- ✅ Code examples with syntax highlighting
- ✅ Registry auto-generated from MDX frontmatter

### Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│ CONTENT (MDX)                                           │
│ src/content/components/[name]/index.mdx                 │
│ - Frontmatter (name, description, category, etc.)       │
│ - Documentation sections (Demo, Usage, Props, etc.)     │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ REGISTRY                                                │
│ src/lib/registry/registry.json                          │
│ - Single source of truth for navigation & metadata      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ RUNTIME (React Components)                              │
│ src/components/[name]/[name].tsx                        │
│ - Actual component implementation                       │
│ - Imported dynamically via resolver                     │
└─────────────────────────────────────────────────────────┘
```

### File Structure

```
src/content/components/
  ├── motion-surface/
  │   └── index.mdx              # All documentation in one file
  ├── adaptive-tooltip/
  │   └── index.mdx
  └── infinite-scroller/
      └── index.mdx

src/components/                  # Runtime components
  ├── motion-surface/
  │   ├── motion-surface.tsx     # Component implementation
  │   └── index.ts               # Exports
  ├── demos/                     # Demo wrappers
  │   ├── motion-surface/
  │   │   └── MotionSurfaceDemo.tsx
  │   └── ...
  └── ...

src/lib/registry/
  ├── registry.json              # Component metadata
  └── resolver.ts                # Component resolution logic
```

### Adding a New Component

**Steps required:**

1. **Create the MDX file:**
   ```bash
   mkdir -p src/content/components/my-component
   touch src/content/components/my-component/index.mdx
   ```

2. **Fill in the MDX:**
   ```yaml
   ---
   name: "my-component"
   title: "My Component"
   description: "A brief description"
   category: "UI"
   version: "1.0.0"
   dependencies: ["framer-motion"]
   ---
   
   ## Description
   Detailed explanation...
   
   ## Demo
   \`\`\`tsx
   <MyComponent prop="value" />
   \`\`\`
   ```

2. **Add component to registry.json**

3. **Create demo wrapper in src/components/demos/my-component/**

That's it! The component automatically appears in navigation and pages.

### Documentation

- **Template:** `docs/COMPONENT_TEMPLATE.mdx`
- **Guide:** `docs/MDX_GUIDE.md`
- **Parser:** `src/lib/mdx/parser.ts`

---

## Component Architecture

### Registry-Driven System

This project uses a **registry-driven architecture** where components are loaded dynamically based on metadata in `registry.json`. This enables zero-touch component additions without modifying site code.

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

### File Structure

```
src/content/{component-id}/
  ├── {component-id}.tsx       # Component implementation
  └── index.mdx                # Documentation

src/components/demos/{component-id}/
  └── {PascalCase}Demo.tsx     # Demo component

src/lib/registry/
  ├── registry.json            # Component metadata
  └── resolver.ts              # Component resolution logic
```

### Documentation-First Approach

Every component has an MDX file with:
- **Frontmatter**: Metadata (name, description, category, dependencies)
- **Demo Section**: Live component preview
- **Usage Section**: Code examples
- **Props Table**: API reference
- **Source Code**: Full implementation

See [`docs/index-mdx-standards.md`](./docs/index-mdx-standards.md) for complete MDX structure.

---

## Adding Components

### Quick Guide

**4 files needed:**

1. **Component** (`src/content/{id}/{id}.tsx`)
2. **Demo** (`src/components/demos/{id}/{PascalCase}Demo.tsx`)
3. **Docs** (`src/content/{id}/index.mdx`)
4. **Registry** (update `registry.json` + `resolver.ts`)

### Example: Adding "Magnetic Button"

#### 1. Create Component

**File:** `src/content/magnetic-button/magnetic-button.tsx`

```tsx
"use client";

import React from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <button className={`relative overflow-hidden ${className}`}>
      {children}
    </button>
  );
};

export default MagneticButton;
```

#### 2. Create Demo

**File:** `src/components/demos/magnetic-button/MagneticButtonDemo.tsx`

```tsx
"use client";

import React from 'react';
import MagneticButton from '../../../content/magnetic-button/magnetic-button';

const MagneticButtonDemo: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <MagneticButton className="px-10 py-4 rounded-full bg-white text-black">
        Hover Me
      </MagneticButton>
    </div>
  );
};

export default MagneticButtonDemo;
```

#### 3. Create Documentation

**File:** `src/content/magnetic-button/index.mdx`

```mdx
---
name: "magnetic-button"
title: "Magnetic Button"
description: "A magnetic, cursor-following button with GSAP animations."
category: "UI"
version: "1.0.0"
dependencies: ["gsap"]
source: "src/content/magnetic-button/index.mdx"
---

# Magnetic Button

A magnetic button that follows the cursor.

## Demo

<ComponentPreview name="magnetic-button" />

## Usage

<DemoCode name="magnetic-button" title="Demo Implementation" />

## Source Code

<ComponentCode name="magnetic-button" title="Full Component" />

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Button content |
| `className` | `string` | `''` | Additional CSS classes |

## Dependencies

`gsap`
```

#### 4. Update Registry

**File:** `src/lib/registry/registry.json`

Add to `components` array:

```json
{
  "id": "magnetic-button",
  "title": "Magnetic Button",
  "description": "A magnetic, cursor-following button.",
  "category": "ui",
  "status": "experimental",
  "tags": ["gsap", "animation"],
  "date": "2026-01-07",
  "featured": false,
  "new": true,
  "source": {
    "type": "mdx",
    "path": "src/content/magnetic-button/index.mdx"
  },
  "demo": {
    "variants": ["default"],
    "defaultProps": {}
  },
  "design": {
    "surface": "flat",
    "motion": "spring"
  },
  "dependencies": ["gsap"]
}
```

**File:** `src/lib/registry/resolver.ts`

Add to `demoImports`:

```typescript
const demoImports = {
  // ... existing imports
  "magnetic-button": () => import("@/components/demos/magnetic-button/MagneticButtonDemo"),
} as const satisfies Record<string, () => Promise<{ default: ComponentType<Record<string, unknown>> }>>;
```

#### 5. Verify

```bash
npm run build
```

✅ Build passes
✅ Component appears in navigation
✅ Demo loads without errors

### Detailed Guides

For complete documentation, see [`docs/`](./docs/):
- **[Adding a Component](./docs/adding-components.md)** — Step-by-step process
- **[Creating Demos](./docs/creating-demos.md)** — Demo component best practices
- **[Index.mdx Standards](./docs/index-mdx-standards.md)** — MDX structure requirements
- **[Registry & Resolver](./docs/registry-resolver.md)** — Architecture deep dive

---

## Project Purpose

This is a **frontend-only component showcase** and **interaction laboratory**. It is not a production application, not a component library package, and not a design system for distribution.

**What it is:**
- A curated collection of 5 high-fidelity interaction experiments (Lab components)
- A minimal set of 4 production-ready UI primitives (Button, Badge, Select, Tabs)
- A demonstration of Next.js 15 App Router architecture with TypeScript
- A reference implementation for theme systems, typography scales, and animation patterns

**What it is not:**
- A backend-integrated application (no API routes, no database, no authentication)
- A component library distributed via npm
- A template or starter kit (too opinionated for general use)

**Intended audience:**
- Developers reviewing code quality and architectural decisions
- Engineers learning Next.js 15, Framer Motion, or Tailwind CSS 4
- Portfolio reviewers evaluating frontend engineering skills

---

## Architecture Overview

### App Router Structure

This project uses **Next.js 15 App Router** with the following conventions:

- **`src/app/`** — routing, layouts, and page components
  - `layout.tsx` — root layout with theme provider, font loading, and global Shell wrapper
  - `page.tsx` — homepage with staggered animations and component previews
  - `lab/[slug]/page.tsx` — dynamic routes for individual lab component demos

- **`src/components/`** — all React components, organized by purpose
  - `ui/` — 4 reusable UI primitives (Button, Badge, Select, Tabs)
  - `lab/` — 3 interaction experiments (AnimatedButton, TextMorph, InfiniteScroller)
  - `layout/` — Shell (page wrapper), Dock (bottom navigation), ThemeToggle
  - `code/` — syntax highlighting and code display utilities

- **`src/lib/`** — utilities, types, and configuration
  - `registry.ts` — component metadata and registration system
  - `types.ts` — TypeScript interfaces for components and navigation
  - `design-system.ts` — centralized design tokens (layout, typography, colors, animations)
  - `utils.ts` — `cn()` helper for conditional class merging

### Component Separation

**UI Primitives** (`src/components/ui/`)
- Production-ready, accessible, reusable
- Built on Radix UI primitives (Select, Tabs, Slot)
- Styled with Tailwind CSS and `class-variance-authority` for variants
- No Framer Motion (static components only)

**Lab Components** (`src/components/lab/`)
- Experimental, interaction-focused, not intended for direct reuse
- Heavy use of Framer Motion for physics-based animations
- Each component is self-contained with inline documentation
- Registered in `registry.ts` with metadata (slug, title, description, dependencies)

**Layout Components** (`src/components/layout/`)
- Shell: page wrapper with max-width constraints and bottom padding for Dock
- Dock: fixed bottom navigation with hover effects and theme toggle
- ThemeToggle: light/dark mode switcher (no system theme)

---

## Tech Stack

### Core Framework

**Next.js 15.3.6**
- App Router for file-based routing
- React Server Components (RSC) where applicable
- Turbopack for fast development builds (`--turbopack` flag)
- No API routes, no server actions (frontend-only)

**React 19.0.0**
- Latest stable release
- Client components for interactivity (`"use client"` directive)
- Hooks: `useState`, `useEffect`, `useRef` for stateful logic

**TypeScript 5**
- Strict mode enabled (`strict: true`)
- Path aliases (`@/*` maps to `src/*`)
- Type-safe component props and design tokens

**Tailwind CSS 4**
- Utility-first styling with custom design tokens
- `@theme inline` for CSS variable integration
- Custom variants (`dark:` for theme switching)
- Plugins: `@tailwindcss/typography`, `tailwindcss-animate`

### UI & Animation

**Framer Motion 12.23.24**
- Physics-based animations (`useSpring`, `useMotionValue`, `useTransform`)
- Declarative animation props (`whileHover`, `whileTap`, `animate`)
- `AnimatePresence` for enter/exit transitions
- Used exclusively in Lab components (not in UI primitives)

**Radix UI**
- `@radix-ui/react-select` — accessible dropdown component
- `@radix-ui/react-tabs` — keyboard-navigable tabs
- `@radix-ui/react-slot` — polymorphic component composition
- Chosen for accessibility (ARIA compliance, keyboard navigation) and headless design

**Lucide React 0.552.0**
- Icon library (tree-shakeable, consistent design)
- Used in Dock navigation and ThemeToggle

**next-themes 0.4.6**
- Theme persistence via localStorage
- Hydration-safe theme switching (prevents flash of unstyled content)
- Configured for light/dark only (system theme disabled)

### Utilities

**clsx + tailwind-merge**
- `clsx` for conditional class names
- `tailwind-merge` for deduplicating conflicting Tailwind classes
- Combined in `cn()` utility function

**class-variance-authority (CVA)**
- Type-safe component variants (e.g., Button sizes, Badge colors)
- Reduces boilerplate for variant-based styling

---

## Component Philosophy

### UI Primitives (4 components)

These are **production-ready, reusable components** intended for use across a real application.

**Button** (`src/components/ui/button.tsx`)
- Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- Sizes: `default`, `sm`, `lg`, `icon`
- Built with `class-variance-authority` for type-safe variants
- Uses Radix `Slot` for polymorphic rendering (`asChild` prop)

**Badge** (`src/components/ui/badge.tsx`)
- Variants: `default`, `secondary`, `destructive`, `outline`
- Inline display component for labels and tags

**Select** (`src/components/ui/select.tsx`)
- Wrapper around `@radix-ui/react-select`
- Accessible dropdown with keyboard navigation
- Custom styling to match design system

**Tabs** (`src/components/ui/tabs.tsx`)
- Wrapper around `@radix-ui/react-tabs`
- Keyboard-navigable tab interface
- Used in Lab component navigation

### Lab Components (5 experiments)

These are **interaction experiments** demonstrating advanced animation techniques. They are not intended for direct reuse without modification.

**AnimatedButton** (`src/components/lab/AnimatedButton.tsx`)
- Physics-based hover and tap animations
- Uses `whileHover`, `whileTap` from Framer Motion
- Demonstrates nested icon animations with Tailwind `group-hover`

**TextMorph** (`src/components/lab/TextMorph.tsx`)
- Smooth text transitions with blur and vertical motion
- Uses `AnimatePresence` with `mode='wait'` for sequential animations
- Cycles through an array of strings with a timer

**InfiniteScroller** (`src/components/lab/InfiniteScroller.tsx`)
- Seamless horizontal marquee
- Duplicates content array for infinite loop
- CSS masks for soft edges

### Component Registration

All Lab components are registered in `src/lib/registry.ts` with metadata:

```typescript
{
  slug: "animated-button",
  title: "Animated Button",
  description: "A premium button with physics-based hover and tap animations.",
  category: "animation",
  tags: ["framer-motion", "button", "interaction"],
  date: "Dec 12, 2024",
  featured: true,
  Component: AnimatedButton,
  fileName: "AnimatedButton.tsx",
  dependencies: ["framer-motion", "lucide-react"]
}
```

This registry powers:
- Dynamic routing (`/lab/[slug]`)
- Component listing on homepage
- Metadata display in Lab navigation

---

## Theme System

### Design Decisions

**Light and dark modes only. No system theme.**

Reasoning:
- System theme introduces ambiguity (user may not know which theme is active)
- Adds complexity to testing (three states instead of two)
- Requires OS preference detection, which can fail or be unavailable
- Deterministic behavior is more important than automatic theme switching

### Implementation

**ThemeProvider** (`src/components/ThemeProvider.tsx`)
- Wraps `next-themes` provider
- Configured in `src/app/layout.tsx`:
  ```tsx
  <ThemeProvider
    attribute="class"
    defaultTheme="dark"
    enableSystem={false}
    disableTransitionOnChange
  />
  ```
- `attribute="class"` — applies `.dark` class to `<html>` element
- `enableSystem={false}` — disables OS preference detection
- `disableTransitionOnChange` — prevents jarring transitions during theme switch

**ThemeToggle** (`src/components/layout/ThemeToggle.tsx`)
- Toggles between `light` and `dark` directly
- Uses `useMounted()` hook to prevent hydration mismatch
- Renders placeholder icon during SSR, actual theme icon after mount
- Icon animation: Sun rotates out, Moon rotates in (Tailwind `dark:` variants)

**CSS Variables** (`src/app/globals.css`)
- All colors defined as CSS variables in `:root` and `.dark`
- Tailwind references these variables via `@theme inline`
- Example:
  ```css
  :root {
    --background: #FFFFFF;
    --foreground: #111111;
  }
  .dark {
    --background: #000000;
    --foreground: #E5E5E5;
  }
  ```
- Components use Tailwind classes (`bg-background`, `text-foreground`)
- No inline styles, no JavaScript-driven color changes

### Hydration Safety

**Problem:** Theme is stored in localStorage, which is unavailable during SSR. This can cause a mismatch between server-rendered HTML and client-rendered HTML.

**Solution:**
- `next-themes` handles this automatically with `suppressHydrationWarning` on `<html>`
- `useMounted()` hook ensures theme-dependent UI only renders after hydration
- ThemeToggle shows a neutral icon during SSR, then switches to the correct icon

---

## Typography System

### Semantic Scale

This project uses an **8-level semantic typography scale** defined in CSS variables:

| Utility Class       | CSS Variable         | Size   | Use Case                     |
|---------------------|----------------------|--------|------------------------------|
| `.text-tooltip`     | `--font-size-xs`     | 11px   | Tooltips, badges             |
| `.text-caption`     | `--font-size-sm`     | 13px   | Captions, metadata           |
| `.text-body`        | `--font-size-base`   | 14px   | Body text, links             |
| `.text-body-emphasis` | `--font-size-md`   | 15px   | Emphasized body text         |
| `.text-subheading`  | `--font-size-lg`     | 16px   | Subheadings                  |
| `.text-section-title` | `--font-size-xl`   | 18px   | Section titles               |
| `.text-page-heading` | `--font-size-2xl`   | 24px   | Page headings                |
| `.text-hero`        | `--font-size-3xl`    | 30px   | Hero headings                |

### Design Decisions

**Why CSS variables instead of Tailwind's default scale?**
- Global control: changing `--font-size-base` updates all body text instantly
- Semantic naming: `.text-body` is clearer than `.text-sm`
- No layout impact: font sizes are independent of spacing, line-height, and weight

**Why 8 levels?**
- Covers all use cases in this project (tooltips to hero headings)
- More granular than Tailwind's default scale (xs, sm, base, lg, xl, 2xl, 3xl)
- Avoids arbitrary values (`text-[17px]`)

**Font Loading**
- Geist Sans and Geist Mono loaded via `next/font/google`
- CSS variables: `--font-geist-sans`, `--font-geist-mono`
- Applied globally in `body` and available as Tailwind utilities

---

## Project Structure

```
.
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── lab/
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Dynamic lab component pages
│   │   ├── favicon.ico
│   │   ├── global-error.tsx      # Error boundary
│   │   ├── globals.css           # CSS variables, Tailwind imports
│   │   ├── layout.tsx            # Root layout (theme, fonts, Shell)
│   │   └── page.tsx              # Homepage
│   │
│   ├── components/
│   │   ├── ui/                   # 4 UI primitives
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── select.tsx
│   │   │   └── tabs.tsx
│   │   │
│   │   ├── lab/                  # 3 lab components + utilities
│   │   │   ├── AnimatedButton.tsx
│   │   │   ├── TextMorph.tsx
│   │   │   ├── InfiniteScroller.tsx
│   │   │   ├── DemoContainer.tsx  # Wrapper for lab demos
│   │   │   ├── LabGrid.tsx        # Grid layout for lab listing
│   │   │   ├── LabNavigation.tsx  # Desktop lab nav
│   │   │   └── MobileLabNav.tsx   # Mobile lab nav
│   │   │
│   │   ├── layout/               # Layout components
│   │   │   ├── Shell.tsx         # Page wrapper (max-width, padding)
│   │   │   ├── Dock.tsx          # Bottom navigation bar
│   │   │   └── ThemeToggle.tsx   # Light/dark mode switcher
│   │   │
│   │   ├── code/                 # Code display utilities
│   │   │   └── [code display components]
│   │   │
│   │   └── ThemeProvider.tsx     # next-themes wrapper
│   │
│   ├── lib/                      # Utilities and configuration
│   │   ├── design-system.ts      # Design tokens (layout, typography, colors)
│   │   ├── registry.ts           # Lab component registration
│   │   ├── types.ts              # TypeScript interfaces
│   │   └── utils.ts              # cn() helper
│   │
│   └── hooks/                    # Custom React hooks
│       ├── use-mobile.ts         # Mobile breakpoint detection
│       └── use-mounted.ts        # Hydration-safe mounting check
│
├── public/                       # Static assets (SVG icons)
├── .next/                        # Next.js build output (gitignored)
├── node_modules/                 # Dependencies (gitignored)
│
├── components.json               # shadcn/ui configuration
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
├── postcss.config.mjs            # PostCSS configuration
├── eslint.config.mjs             # ESLint configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

### Why This Structure?

**`src/app/` for routing, `src/components/` for components**
- Clear separation between routing logic and UI logic
- Components are organized by purpose, not by route

**`ui/` vs `lab/` separation**
- UI primitives are reusable, Lab components are experiments
- Prevents accidental reuse of experimental code in production

**`lib/` for non-component code**
- Utilities, types, and configuration live outside `components/`
- Easier to import without circular dependencies

**`hooks/` for custom hooks**
- Reusable stateful logic (mobile detection, mounted state)
- Keeps components focused on rendering

---

## Performance Decisions

### Dependency Cleanup (Dec 2024)

This project underwent a major audit to remove unused dependencies and components:

**Before:**
- 87 npm packages
- 52 UI components (shadcn/ui full install)
- Build time: ~8 seconds
- Install time: ~45 seconds

**After:**
- 13 npm packages (85% reduction)
- 4 UI components (92% reduction)
- Build time: ~4 seconds (50% faster)
- Install time: ~20 seconds (56% faster)

**What was removed:**
- Backend dependencies (Prisma, Supabase, tRPC, Zod)
- Unused UI components (48 shadcn/ui components)
- Duplicate icon libraries (kept Lucide, removed Radix Icons)
- Unused animation libraries (kept Framer Motion, removed others)

**What was kept:**
- All functionality preserved (zero breaking changes)
- 4 essential UI primitives (Button, Badge, Select, Tabs)
- 5 Lab components (all interaction experiments intact)

See [BEFORE_AFTER.md](./BEFORE_AFTER.md) for detailed comparison.

### Build Optimization

**Turbopack** (`npm run dev -- --turbopack`)
- Next.js 15's new bundler (faster than Webpack)
- Incremental compilation (only rebuilds changed files)
- Enabled by default in `package.json` scripts

**Tree Shaking**
- Lucide React icons are tree-shakeable (only imported icons are bundled)
- Framer Motion uses ES modules (unused features are excluded)

**No Runtime Dependencies**
- No backend (no API routes, no database queries)
- No authentication (no session management)
- No data fetching (all content is static)

### Lazy Loading

**Not implemented** because:
- All Lab components are small (<5KB each)
- Homepage only shows 3 component previews (not all 5)
- No performance benefit from code splitting at this scale

If this project scaled to 50+ components, lazy loading would be implemented via:
```tsx
const AnimatedButton = dynamic(() => import('@/components/lab/AnimatedButton'))
```

---

## Development Workflow

### Getting Started

```bash
# Install dependencies
npm install

# Start development server (with Turbopack)
npm run dev

# Open browser
open http://localhost:3000
```

### Scripts

```bash
npm run dev      # Development server (Turbopack, hot reload)
npm run build    # Production build (optimized, minified)
npm start        # Start production server (requires build first)
npm run lint     # Run ESLint (checks for code quality issues)
```

### Adding a New Lab Component

**The registry-driven way (2 steps):**

1. **Create component file** in `src/components/lab/YourComponent.tsx`
   ```tsx
   "use client";
   import { motion } from "framer-motion";
   
   export function YourComponent() {
     return <motion.div>Your component</motion.div>;
   }
   ```

2. **Add entry to `registry.json`**
   ```json
   {
     "id": "your-component",
     "title": "Your Component",
     "description": "Description here",
     "category": "animation",
     "status": "stable",
     "tags": ["framer-motion"],
     "date": "2024-12-23",
     "featured": false,
     "new": true,
     "source": {
       "type": "local",
       "path": "src/components/lab/YourComponent.tsx"
     },
     "demo": {
       "variants": ["default"],
       "defaultProps": {}
     },
     "design": {
       "surface": "flat",
       "motion": "smooth"
     },
     "readme": "Optional detailed documentation",
     "dependencies": ["framer-motion"]
   }
   ```

3. **Component is now accessible at `/lab/your-component`**
   - Navigation auto-updates
   - Routing works automatically
   - No additional code needed

### Adding a New UI Primitive

1. **Create component file** in `src/components/ui/your-component.tsx`
2. **Use `class-variance-authority` for variants** (see `button.tsx` for reference)
3. **Import and use in pages or other components**

No registration required (UI primitives are not listed in registry).

### Modifying the Theme

**To add a new color:**
1. Add CSS variable in `src/app/globals.css`:
   ```css
   :root {
     --your-color: #hexcode;
   }
   .dark {
     --your-color: #hexcode;
   }
   ```
2. Add to Tailwind theme in `@theme inline`:
   ```css
   --color-your-color: var(--your-color);
   ```
3. Use in components: `bg-your-color`, `text-your-color`

**To change default theme:**
- Edit `defaultTheme` in `src/app/layout.tsx` (currently `"dark"`)

---

## Design Principles

### 1. Minimal

**Only essential dependencies.**
- 13 npm packages (down from 87)
- No backend libraries in a frontend-only project
- No duplicate functionality (one animation library, one icon library)

### 2. Focused

**Single-purpose libraries.**
- Framer Motion for all animations (no mixing with CSS animations or other libraries)
- Lucide React for all icons (consistent design language)
- Radix UI for accessible primitives (no custom implementations)

### 3. Performant

**Fast builds, small bundles.**
- 50% faster builds after cleanup
- Tree-shakeable dependencies (Lucide, Framer Motion)
- No runtime overhead (no backend, no data fetching)

### 4. Maintainable

**Clear separation of concerns.**
- UI primitives vs Lab experiments (different purposes, different folders)
- Layout components isolated from content components
- Design tokens centralized in `design-system.ts` and `globals.css`

### 5. Accessible

**Radix UI primitives, semantic HTML.**
- All interactive components use Radix UI (keyboard navigation, ARIA attributes)
- Semantic HTML elements (`<button>`, `<nav>`, `<main>`)
- Focus states and screen reader support

### 6. Deterministic

**No ambiguity, no fallback logic.**
- Light/dark theme only (no system theme)
- Explicit default theme (`"dark"`)
- Hydration-safe rendering (no flash of unstyled content)

---

## Documentation

Comprehensive guides are available in the [`docs/`](./docs/) directory:

### Component Development
- **[Adding a Component](./docs/adding-components.md)** — Complete step-by-step guide for adding new components
- **[Creating Demos](./docs/creating-demos.md)** — Best practices for creating effective demo components
- **[Index.mdx Standards](./docs/index-mdx-standards.md)** — MDX documentation structure and requirements
- **[Registry & Resolver](./docs/registry-resolver.md)** — Deep dive into the registry-driven architecture

### Quick Reference

**Adding a component checklist:**
1. Create component file in `src/content/{id}/{id}.tsx`
2. Create demo in `src/components/demos/{id}/{PascalCase}Demo.tsx`
3. Create docs in `src/content/{id}/index.mdx`
4. Add registry entry to `registry.json`
5. Add import mapping to `resolver.ts`
6. Run `npm run build` to verify

**Common patterns:**
- Components use `"use client"` directive for interactivity
- Demos center content with min-height containers
- MDX files follow strict frontmatter structure
- Registry uses lowercase category, MDX uses uppercase

---

## License

Open source. Available for reference and inspiration.