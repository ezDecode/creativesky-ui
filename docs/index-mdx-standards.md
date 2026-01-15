# Index.mdx Standards

This document outlines the required structure and conventions for component documentation files (`index.mdx`).

## File Location

```
src/content/{component-id}/index.mdx
```

Where `{component-id}` is the kebab-case identifier (e.g., `magnetic-button`, `motion-surface`).

---

## Required Structure

### 1. Frontmatter

All `index.mdx` files **MUST** include YAML frontmatter with the following fields:

```yaml
---
name: "component-id"          # kebab-case identifier
title: "Display Title"        # Human-readable title (Title Case)
description: "Brief 20-25 word description of the component."
category: "UI"                # Must be "UI" (uppercase)
version: "1.0.0"              # Semantic version
dependencies: ["library-name"] # Array of npm packages required
source: "src/content/component-id/index.mdx"
---
```

#### Field Requirements

| Field | Example | Notes |
|-------|---------|-------|
| `name` | `"magnetic-button"` | Must match folder name and registry ID |
| `title` | `"Magnetic Button"` | Title Case, human-readable |
| `description` | `"A magnetic, cursor-following..."` | 20-25 words, ends with period |
| `category` | `"UI"` | **Must be uppercase "UI"** |
| `version` | `"1.0.0"` | Semantic versioning |
| `dependencies` | `["gsap", "framer-motion"]` | NPM package names |
| `source` | `"src/content/magnetic-button/index.mdx"` | Relative path to this file |

---

### 2. Content Sections

The MDX body **MUST** follow this exact section order:

#### **a) Installation Section**

```markdown
## Installation

<Steps>
  <Step>
    Install the required dependencies:
    ```bash
    npm install package-name
    ```
  </Step>
  <Step>
    Copy the component code into your project.
  </Step>
</Steps>
```

#### **b) Usage Section**

```markdown
## Usage

```tsx
import { ComponentName } from "@/components/ComponentName";

export default function Demo() {
  return <ComponentName />;
}
```
```

#### **c) Props Section**

```markdown
## Props

<PropsTable props={[
  { name: "propName", description: "What this prop does." },
  { name: "onClick", description: "Click handler function." },
  { name: "variant", description: "Style variant." }
]} />
```

- Keep descriptions concise and clear
- **Do NOT include type, required, or default information** - these should be documented in TypeScript definitions or description if critical.

---

## Complete Example

```mdx
---
name: "magnetic-button"
title: "Magnetic Button"
description: "Cursor-following button with magnetic attraction, GSAP-powered flair animation, and smooth physics."
category: "UI"
version: "1.0.0"
dependencies: ["gsap"]
source: "src/content/magnetic-button/index.mdx"
---

## Installation

<Steps>
  <Step>
    Install the required dependencies:
    ```bash
    npm install gsap
    ```
  </Step>
  <Step>
    Copy the component code into your project.
  </Step>
</Steps>

## Usage

```tsx
import { MagneticButton } from "@/components/craft/magnetic-button";

export default function Demo() {
  return (
    <MagneticButton onClick={() => console.log("clicked")}>
      Get Started
    </MagneticButton>
  );
}
```

## Props

<PropsTable props={[
  { name: "children", description: "Content to display inside the button." },
  { name: "className", description: "Additional CSS classes for styling." },
  { name: "onClick", description: "Click handler function." },
  { name: "hoverVariant", description: "Predefined color variant for the flair." }
]} />
```

---

## Common Mistakes to Avoid

❌ **WRONG:**
- `category: "ui"` (lowercase)
- Missing frontmatter closing `---`
- Extra `---` delimiters
- Inconsistent section order
- Including `type` in props (removed for cleaner docs)
- Descriptions over 25 words

✅ **CORRECT:**
- `category: "UI"` (uppercase)
- Clean frontmatter with opening and closing `---`
- Sections in documented order
- Concise 20-25 word descriptions
- Props with name, description, and optional required/default

---

## Validation Checklist

Before committing an `index.mdx` file, verify:

- [ ] Frontmatter has all 7 required fields
- [ ] Category is `"UI"` (uppercase)
- [ ] Description is 20-25 words
- [ ] Component name matches folder name
- [ ] All sections present in correct order
- [ ] Props table is complete (name, description, required/default)
- [ ] Dependencies match frontmatter array

---

## See Also

- [Adding a Component](./adding-components.md)
- [Creating Demos](./creating-demos.md)
- [Registry & Resolver](./registry-resolver.md)
