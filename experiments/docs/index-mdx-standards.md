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
description: "Brief one-line description of the component."
category: "UI"                # Must be "UI" (uppercase)
version: "1.0.0"              # Semantic version
dependencies: ["library-name"] # Array of npm packages required
source: "src/content/component-id/index.mdx"
---
```

#### Field Requirements

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `name` | string | `"magnetic-button"` | Must match folder name and registry ID |
| `title` | string | `"Magnetic Button"` | Title Case, human-readable |
| `description` | string | `"A magnetic, cursor-following..."` | One sentence, ends with period |
| `category` | string | `"UI"` | **Must be uppercase "UI"** |
| `version` | string | `"1.0.0"` | Semantic versioning |
| `dependencies` | array | `["gsap", "framer-motion"]` | NPM package names |
| `source` | string | `"src/content/magnetic-button/index.mdx"` | Relative path to this file |

---

### 2. Content Sections

The MDX body **MUST** follow this exact section order:

#### **a) Main Heading**

```markdown
# Component Title

Brief introduction paragraph explaining what the component does and its key features.
```

#### **b) Demo Section**

```markdown
## Demo

<ComponentPreview name="component-id" />
```

- Use the exact component ID from frontmatter
- This renders the live demo component

#### **c) Usage Section**

```markdown
## Usage

<DemoCode name="component-id" title="Demo Implementation" />
```

- Shows the demo component source code
- Title can be customized but typically "Demo Implementation"

#### **d) Source Code Section**

```markdown
## Source Code

<ComponentCode name="component-id" title="Full Component" />
```

- Displays the actual component implementation
- Title typically "Full Component"

#### **e) Props Section**

```markdown
## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `propName` | `string` | `'default'` | What this prop does |
| `onClick` | `() => void` | `undefined` | Click handler function |
```

- Use proper TypeScript type syntax in backticks
- Wrap prop names in backticks
- Use `undefined` for optional props without defaults
- Use `-` for required props

#### **f) Dependencies Section**

```markdown
## Dependencies

`package-name`
`another-package`
```

- List each dependency on a new line wrapped in backticks
- Should match the `dependencies` array in frontmatter

---

## Complete Example

```mdx
---
name: "magnetic-button"
title: "Magnetic Button"
description: "A magnetic, cursor-following call-to-action with a GSAP-powered flair animation."
category: "UI"
version: "1.0.0"
dependencies: ["gsap"]
source: "src/content/magnetic-button/index.mdx"
---

# Magnetic Button

A magnetic, cursor-following call-to-action with a GSAP-powered flair animation. The button features a dynamic hover effect that tracks cursor movement, creating an engaging visual experience.

## Demo

<ComponentPreview name="magnetic-button" />

## Usage

<DemoCode name="magnetic-button" title="Demo Implementation" />

## Source Code

<ComponentCode name="magnetic-button" title="Full Component" />

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to display inside the button |
| `className` | `string` | `''` | Additional CSS classes for styling |
| `onClick` | `() => void` | `undefined` | Click handler function |
| `hoverVariant` | `'light' \| 'dark'` | `'light'` | Predefined color variant for the flair |

## Dependencies

`gsap`
```

---

## Common Mistakes to Avoid

❌ **WRONG:**
- `category: "ui"` (lowercase)
- Missing frontmatter closing `---`
- Extra `---` delimiters
- Inconsistent section order
- Missing `#` heading
- Wrong component name in `<ComponentPreview>`

✅ **CORRECT:**
- `category: "UI"` (uppercase)
- Clean frontmatter with opening and closing `---`
- Sections in documented order
- Heading matches title
- Component ID matches everywhere

---

## Validation Checklist

Before committing an `index.mdx` file, verify:

- [ ] Frontmatter has all 7 required fields
- [ ] Category is `"UI"` (uppercase)
- [ ] Component name matches folder name
- [ ] All sections present in correct order
- [ ] ComponentPreview, DemoCode, ComponentCode all use same ID
- [ ] Props table is complete and properly formatted
- [ ] Dependencies match frontmatter array

---

## See Also

- [Adding a Component](./adding-components.md)
- [Creating Demos](./creating-demos.md)
- [Registry & Resolver](./registry-resolver.md)
