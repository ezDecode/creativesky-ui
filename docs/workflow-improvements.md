# Application Workflow & Improvements Documentation

## Overview
This document outlines the recent improvements made to the CreativeSky component showcase application, including scroll-based component support, Vault removal, Dock removal, and Lab → Craft rebranding.

---

## ✅ Completed Improvements

### 1. Scroll-Reveal-Text Component Preview Enhancement

**Problem:**
- The scroll-reveal-text component requires extensive scroll distance (~3000px+) to animate properly
- Preview container was not scrollable, preventing proper animation demonstration
- No scroll container reference was being passed to components
- Missing PreviewFrame component that was referenced but didn't exist

**Solution:**
- Created `PreviewFrame.tsx` component with:
  - Proper overflow handling (`overflow-y-auto`, `overflow-x-hidden`)
  - Smooth scrolling behavior
  - Container reference forwarding for scroll-based components
  - Custom scrollbar styling (thin, subtle, with hover effects)

- Updated `DemoContainer.tsx`:
  - Added `scrollable` prop (default: `true`)
  - Passes scroll container reference to PreviewFrame
  - Forwards `onScrollContainerRef` callback

- Enhanced `ComponentPreview.tsx`:
  - Added `scrollable` prop support
  - Uses `useRef` for scroll container reference
  - Properly passes `scrollContainerRef` to component instances
  - Respects `metadata.demo.scrollable` from registry

- Updated registry (`registry.json`):
  - Added `scrollable: true` flag to scroll-reveal-text component metadata

**Files Modified:**
- `src/components/craft/PreviewFrame.tsx` (NEW)
- `src/components/craft/DemoContainer.tsx`
- `src/components/craft/ComponentPreview.tsx`
- `src/lib/registry/registry.json`
- `src/app/globals.css` (added custom scrollbar utilities)

---

### 2. Vault Removal

**Removed:**
- `/src/lib/vault/` folder (complete removal)
  - `resolve-links.ts` - Link metadata resolver
  - `projects.ts` - Static project data
- `/src/app/vault/` folder (complete removal)
  - `page.tsx` - Vault page component
- Vault navigation link from Dock component
- All related imports and references

**Impact:**
- Cleaner, more focused application
- Reduced complexity
- Faster build times

---

### 3. Dock Component Removal

**Removed:**
- `/src/components/layout/Dock.tsx` (complete removal)
- Dock import from `ClientProviders.tsx`
- Bottom navigation bar with:
  - Home/Vault/Component navigation
  - Mention popup actions
  - Anime.js powered animations

**Updated:**
- `src/components/ClientProviders.tsx` - Removed Dock rendering

**Impact:**
- Simplified navigation model
- Reduced bundle size (removed anime.js dependency usage)
- Cleaner UI without fixed bottom navigation

---

### 4. Lab → Craft Rebranding

**Renamed:**
- `/src/app/lab/` → `/src/app/craft/`
- `/src/components/lab/` → `/src/components/craft/`
- `LabNavDrawer.tsx` → `CraftNavDrawer.tsx`
- `LabLayout` → `CraftLayout`
- `LabPage` → `CraftPage`
- `LabNavDrawerProps` → `CraftNavDrawerProps`

**Updated Routes:**
- `/lab` → `/craft`
- `/lab/[slug]` → `/craft/[slug]`

**Updated References:**
- All imports from `@/components/lab/*` → `@/components/craft/*`
- All navigation links from `/lab` → `/craft`
- Page titles and descriptions
- Navigation drawer descriptions

**Files Modified:**
- `src/app/craft/layout.tsx`
- `src/app/craft/page.tsx`
- `src/app/craft/[slug]/page.tsx`
- `src/components/craft/CraftNavDrawer.tsx`
- `src/components/craft/ComponentPreview.tsx`
- `src/components/craft/DemoContainer.tsx`
- `src/components/craft/PreviewFrame.tsx`
- `src/app/page.tsx`
- `src/lib/mdx/components.tsx`

---

## 📋 Application Workflow

### User Journey

1. **Home Page** (`/`)
   - Hero section with identity and introduction
   - Featured experiments (3 random components)
   - Links to Craft section
   - Footer with additional links

2. **Craft Overview** (`/craft`)
   - Complete list of all available components
   - Alphabetically sorted component cards
   - Each card links to individual component page
   - Floating navigation drawer button (bottom-right)

3. **Component Detail Page** (`/craft/[slug]`)
   - **Split Layout:**
     - **Left Column (50%)**: Documentation
       - Component title and description
       - MDX-rendered content (installation, usage, props, examples)
       - Code snippets with syntax highlighting
     - **Right Column (50%)**: Live Preview
       - Interactive component preview
       - Scrollable container for scroll-based components
       - Responsive device toggle (if enabled)
       - Fill-height sticky positioning

4. **Navigation**
   - Floating action button (bottom-right) opens navigation drawer
   - Drawer contains:
     - "Getting started" section with link to Craft overview
     - "Components" section with all components listed
     - Active state highlighting
     - Auto-closes on navigation

### Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Root Layout                             │
│  - Global styles (globals.css)                              │
│  - Font preloading (Zigato Sans)                            │
│  - Dark mode enabled by default                             │
│  - ClientProviders wrapper (simplified)                     │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼────┐      ┌──────▼──────┐      ┌────▼────┐
   │  Home   │      │    Craft    │      │  Other  │
   │  Page   │      │   Section   │      │  Routes │
   └─────────┘      └─────────────┘      └─────────┘
                           │
                    ┌──────┴──────┐
                    │             │
            ┌───────▼──────┐  ┌──▼──────────┐
            │ Craft Index  │  │ Component   │
            │   (/craft)   │  │  Detail     │
            │              │  │ ([slug])    │
            └──────────────┘  └─────────────┘
                                     │
                          ┌──────────┴──────────┐
                          │                     │
                   ┌──────▼──────┐     ┌───────▼────────┐
                   │ MDX Content │     │ Component      │
                   │  (Docs)     │     │   Preview      │
                   └─────────────┘     └────────────────┘
                                              │
                                    ┌─────────┴─────────┐
                                    │                   │
                             ┌──────▼──────┐   ┌───────▼────────┐
                             │DemoContainer│   │  PreviewFrame  │
                             │             │   │  (Scrollable)  │
                             └─────────────┘   └────────────────┘
```

### Component Resolution Flow

```
User navigates to /craft/scroll-reveal-text
            │
            ▼
   ComponentPage renders
            │
            ├─► resolveComponent("scroll-reveal-text")
            │   │
            │   ├─► Reads registry.json
            │   ├─► Validates component exists
            │   ├─► Dynamically imports demo component
            │   └─► Returns { Component, metadata }
            │
            ├─► loadComponentMDX("scroll-reveal-text")
            │   │
            │   ├─► Reads index.mdx file
            │   ├─► Compiles MDX to React component
            │   └─► Returns compiled MDX content
            │
            └─► Renders split layout
                │
                ├─► Left: MDX content with custom components
                └─► Right: ComponentPreview
                          │
                          ├─► DemoContainer (with scrollable support)
                          │   └─► PreviewFrame (forwards scroll ref)
                          │       └─► Component instance
                          │           └─► Receives scrollContainerRef
                          │
                          └─► CraftNavDrawer (floating button)
```

### Registry System

**Location:** `src/lib/registry/registry.json`

**Structure:**
```json
{
  "version": "1.0.0",
  "components": [
    {
      "id": "component-id",
      "title": "Component Title",
      "description": "Description",
      "category": "ui|animation",
      "status": "stable|experimental",
      "tags": ["framer-motion", "animation"],
      "date": "2026-01-13",
      "featured": false,
      "new": true,
      "source": {
        "type": "mdx",
        "path": "src/content/component-id/index.mdx"
      },
      "demo": {
        "variants": ["default"],
        "defaultProps": {},
        "scrollable": true  // NEW: for scroll-based components
      },
      "design": {
        "surface": "flat|elevated|inset|glassmorphic",
        "motion": "smooth|spring|linear|none|scroll-locked"
      },
      "dependencies": ["framer-motion"]
    }
  ]
}
```

### MDX Processing Pipeline

1. **File Read:** `loadComponentMDX()` reads `.mdx` file from content directory
2. **Frontmatter Parsing:** Extracts metadata (name, title, description, etc.)
3. **MDX Compilation:** Converts MDX to React component using `@mdx-js/mdx`
4. **Component Injection:** Custom components available in MDX:
   - `<ComponentPreview />` - Inline component demos
   - `<Callout />` - Highlighted info boxes
   - `<Steps />` - Numbered step lists
   - Enhanced code blocks with syntax highlighting
   - Custom heading anchors with permalink icons
5. **Render:** Compiled component rendered in page with custom styling

---

## 🎨 Design Patterns

### 1. Scrollable Component Pattern

For components that require scroll-based animations:

```tsx
// In registry.json
{
  "demo": {
    "scrollable": true
  }
}

// Component receives scrollContainerRef
export function ScrollBasedComponent({ scrollContainerRef }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainerRef, // Container to track scroll in
    offset: ["start start", "end end"]
  });
  
  // Use scrollYProgress for animations...
}
```

### 2. Registry-Driven Architecture

- All components registered in single source of truth (`registry.json`)
- Dynamic imports prevent unnecessary bundle bloat
- Metadata-driven UI generation (cards, navigation, previews)
- Easy to add new components without modifying routing logic

### 3. MDX-First Documentation

- Documentation lives alongside component code
- Type-safe props documentation
- Executable code examples
- Rich formatting with custom components
- Build-time compilation for performance

---

## 🔧 Configuration Files

### Key Configurations

1. **`next.config.ts`** - Next.js configuration
2. **`tailwind.config.ts`** - Tailwind CSS theming
3. **`tsconfig.json`** - TypeScript settings
4. **`eslint.config.mjs`** - Linting rules
5. **`src/lib/registry/registry.json`** - Component registry

### Custom CSS Utilities

Added to `globals.css`:

```css
.scrollbar-thin - Thin scrollbar width
.scrollbar-thumb-border/40 - Subtle thumb color
.scrollbar-track-transparent - Invisible track
```

---

## 📦 Dependencies

### Core
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety

### Animation
- **Framer Motion** - Physics-based animations
- **GSAP** - Advanced animation toolkit
- **Anime.js** - Lightweight animation engine

### Styling
- **Tailwind CSS v4** - Utility-first CSS
- **Radix UI** - Headless UI primitives

### Content
- **MDX** - Markdown with JSX
- **Prism** - Syntax highlighting

---

## 🚀 Next Steps & Recommendations

### Performance Optimization
1. Add image optimization for component previews
2. Implement code splitting for heavy animation libraries
3. Add loading skeletons for better perceived performance
4. Consider lazy loading for non-critical components

### UX Enhancements
1. Add search functionality to component drawer
2. Implement component filtering by category/tags
3. Add keyboard navigation shortcuts
4. Create component comparison view

### Developer Experience
1. Add component generator CLI tool
2. Create testing utilities for animated components
3. Add storybook-like variant system
4. Implement hot reload for MDX content

### Content
1. Add more component examples and variants
2. Create comprehensive usage guides
3. Add accessibility documentation
4. Create video walkthroughs for complex components

---

## 🐛 Known Issues & Limitations

1. **No SSR for scroll animations** - Some scroll-based components require client-side rendering
2. **Limited mobile support** - Scroll-based animations optimized for desktop
3. **No component versioning** - Registry doesn't track component versions
4. **Manual registry updates** - Adding components requires manual JSON editing

---

## 📝 Maintenance Guide

### Adding a New Component

1. **Create component files:**
   ```
   src/content/my-component/
   ├── index.mdx          # Documentation
   └── my-component.tsx   # Component implementation
   ```

2. **Create demo wrapper:**
   ```
   src/components/demos/my-component/
   └── MyComponentDemo.tsx
   ```

3. **Register in registry.json:**
   ```json
   {
     "id": "my-component",
     "title": "My Component",
     // ... other metadata
   }
   ```

4. **Test:**
   - Visit `/craft`
   - Click on new component card
   - Verify documentation and preview work

### Updating Existing Component

1. Modify component file in `src/content/[component-name]/`
2. Update demo if needed in `src/components/demos/[component-name]/`
3. Update registry metadata if props/dependencies changed
4. Update MDX documentation

---

## 📊 Project Statistics

- **Total Components:** 4 (adaptive-tooltip, filter-chips, magnetic-button, scroll-reveal-text)
- **Total Routes:** 6+ (home, craft, craft/[slug] x4+)
- **Lines of Code:** ~5,000+ (TypeScript/TSX)
- **Build Size:** TBD
- **Dependencies:** ~30 packages

---

*Last Updated: January 13, 2026*
*Version: 2.0.0 (Post-Craft Rebrand)*
