# Creating Demo Components

This guide explains how to create effective demo components that showcase your component's capabilities.

## Purpose of Demo Components

Demo components serve two purposes:

1. **Visual Preview**: Show the component in action on the documentation site
2. **Usage Example**: Demonstrate how to use the component with realistic props

---

## File Location & Naming

**Location:** `src/components/demos/{component-id}/{PascalCase}Demo.tsx`

**Naming Convention:**

| Component ID | Demo File Name |
|--------------|----------------|
| `magnetic-button` | `MagneticButtonDemo.tsx` |
| `adaptive-tooltip` | `AdaptiveTooltipDemo.tsx` |
| `motion-surface` | `MotionSurfaceDemo.tsx` |
| `vanish-form` | `VanishFormDemo.tsx` |

**Rule:** Convert kebab-case to PascalCase and append `Demo`

---

## Basic Template

```tsx
"use client";

import React from 'react';
import ComponentName from '../../../content/{component-id}/{component-id}';

const ComponentNameDemo: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <ComponentName
        // Add demo-specific props here
      >
        Demo Content
      </ComponentName>
    </div>
  );
};

export default ComponentNameDemo;
```

---

## Required Elements

### 1. Client Directive

```tsx
"use client";
```

- **Must** be the first line
- Required for any interactivity
- Even if your component doesn't use hooks directly

### 2. Import Path

```tsx
import ComponentName from '../../../content/{component-id}/{component-id}';
```

- Relative path from `src/components/demos/{id}/` to `src/content/{id}/`
- Three levels up: `../../../`
- Must match component file name exactly

### 3. Default Export

```tsx
export default ComponentNameDemo;
```

- **Must** be a default export
- Resolver depends on this
- Name should match file name

---

## Container Guidelines

### Minimum Height

Always provide a minimum height to prevent layout shift:

```tsx
<div className="min-h-[200px]">
  {/* component */}
</div>
```

### Centering

For single-element demos, center for visual appeal:

```tsx
<div className="flex items-center justify-center min-h-[200px]">
  <ComponentName />
</div>
```

### Spacing

Use appropriate padding/gap for multi-element demos:

```tsx
<div className="flex gap-4 p-6 min-h-[200px]">
  <ComponentName variant="light" />
  <ComponentName variant="dark" />
</div>
```

---

## Demo Patterns

### Pattern 1: Single Instance

**Best for:** Simple components with clear default behavior

```tsx
const MagneticButtonDemo: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-60">
      <MagneticButton
        customColor="#ff6b6b"
        className="px-10 py-4 rounded-full text-white shadow-lg"
      >
        Hover Me
      </MagneticButton>
    </div>
  );
};
```

### Pattern 2: Multiple Variants

**Best for:** Components with distinct variants/modes

```tsx
const AdaptiveTooltipDemo: React.FC = () => {
  const items = [
    { icon: <Icon1 />, label: "First Item", hasBadge: true },
    { icon: <Icon2 />, label: "Second Item", hasBadge: false },
    { icon: <Icon3 />, label: "Third Item", hasBadge: false },
  ];

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <AdaptiveTooltip items={items} enablePinning />
    </div>
  );
};
```

### Pattern 3: Interactive Demo

**Best for:** Stateful components that respond to user input

```tsx
const MotionSurfaceDemo: React.FC = () => {
  const [active, setActive] = React.useState(0);

  return (
    <div className="min-h-[300px] p-6">
      <MotionSurface activeIndex={active}>
        {items.map((item, i) => (
          <div key={i} onClick={() => setActive(i)}>
            {item.label}
          </div>
        ))}
      </MotionSurface>
    </div>
  );
};
```

### Pattern 4: Responsive Grid

**Best for:** Components that look best in grid layouts

```tsx
const CardDemo: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 min-h-[200px]">
      <Card variant="default" />
      <Card variant="outlined" />
      <Card variant="elevated" />
    </div>
  );
};
```

---

## Styling Best Practices

### Use Tailwind Classes

```tsx
// ✅ Good
<div className="flex items-center justify-center gap-4 p-6">

// ❌ Avoid inline styles unless necessary
<div style={{ display: 'flex', gap: '16px' }}>
```

### Provide Visual Context

Make the component stand out:

```tsx
<div className="bg-slate-900 rounded-lg p-8 min-h-[300px]">
  <ComponentName className="text-white" />
</div>
```

### Responsive Design

Consider mobile viewports:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* components */}
</div>
```

---

## Props Selection

### Show Key Features

Choose props that demonstrate the component's main capabilities:

```tsx
// ✅ Good - Shows customization and interaction
<MagneticButton
  customColor="#ff6b6b"
  hoverVariant="dark"
  onClick={() => console.log('clicked')}
>
  Perfect Button
</MagneticButton>

// ❌ Too minimal - Doesn't show what's special
<MagneticButton>
  Click Me
</MagneticButton>
```

### Use Realistic Values

```tsx
// ✅ Good - Realistic use case
<VanishForm
  placeholders={["Search docs...", "Find components...", "Type to search..."]}
  onSubmit={(value) => console.log('Search:', value)}
/>

// ❌ Bad - Test values
<VanishForm placeholders={["test", "foo", "bar"]} />
```

---

## State Management

### Local State for Simple Demos

```tsx
const [value, setValue] = React.useState('');

return (
  <Input value={value} onChange={(e) => setValue(e.target.value)} />
);
```

### Hardcoded Data for Complex Demos

```tsx
const demoItems = [
  { id: 1, title: "Item One", description: "..." },
  { id: 2, title: "Item Two", description: "..." },
];

return <List items={demoItems} />;
```

---

## Common Patterns

### Loading States

```tsx
const [isLoading, setIsLoading] = React.useState(false);

const handleAction = async () => {
  setIsLoading(true);
  await simulateDelay(2000);
  setIsLoading(false);
};

return <Button onClick={handleAction} loading={isLoading}>Submit</Button>;
```

### Form Handling

```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log('Form submitted');
};

return (
  <form onSubmit={handleSubmit}>
    <FormComponent />
  </form>
);
```

### Animations on Mount

```tsx
const [show, setShow] = React.useState(false);

React.useEffect(() => {
  setShow(true);
}, []);

return <AnimatedComponent show={show} />;
```

---

## Accessibility in Demos

### Labels and ARIA

```tsx
<ComponentName
  aria-label="Demo component"
  role="button"
>
  Click Me
</ComponentName>
```

### Keyboard Support

If the component supports keyboard interactions, mention it:

```tsx
// Show keyboard shortcuts in demo
<Tooltip content="Press Space to activate">
  <Component />
</Tooltip>
```

---

## Performance Considerations

### Avoid Heavy Computation

```tsx
// ✅ Good - Static data
const items = React.useMemo(() => generateItems(10), []);

// ❌ Bad - Regenerates on every render
const items = generateItems(10);
```

### Lazy Loading for Heavy Assets

```tsx
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

return (
  <React.Suspense fallback={<div>Loading...</div>}>
    <HeavyComponent />
  </React.Suspense>
);
```

---

## Debugging Tips

### Console Logs

Use console logs to show interaction (remove before commit):

```tsx
<Button onClick={() => console.log('Button clicked')}>
  Click Me
</Button>
```

### Error Boundaries

For complex demos, wrap in error boundary:

```tsx
<ErrorBoundary fallback={<div>Demo failed to load</div>}>
  <ComplexComponent />
</ErrorBoundary>
```

---

## Complete Example

```tsx
"use client";

import React from 'react';
import MagneticButton from '../../../content/magnetic-button/magnetic-button';

const MagneticButtonDemo: React.FC = () => {
  const handleClick = () => {
    console.log('Magnetic button clicked');
  };

  return (
    <div className="flex w-full h-56 items-center justify-center bg-linear-to-br from-slate-900 to-slate-800 rounded-lg">
      <MagneticButton
        onClick={handleClick}
        hoverVariant="dark"
        customColor="#ff6b6b"
        className="px-10 py-4 rounded-full text-white shadow-lg"
        style={{
          fontSize: '1rem',
          fontWeight: 600,
          transition: 'all 0.33s cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      >
        Perfect Button
      </MagneticButton>
    </div>
  );
};

export default MagneticButtonDemo;
```

---

## Checklist

Before committing a demo component:

- [ ] File in correct location: `src/components/demos/{id}/{PascalCase}Demo.tsx`
- [ ] Has `"use client"` directive
- [ ] Correct import path (three levels up)
- [ ] Default export
- [ ] Minimum height on container
- [ ] Shows component's key features
- [ ] Visually appealing
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Props are realistic and meaningful

---

## See Also

- [Adding a Component](./adding-components.md)
- [Index.mdx Standards](./index-mdx-standards.md)
- [Registry & Resolver](./registry-resolver.md)
