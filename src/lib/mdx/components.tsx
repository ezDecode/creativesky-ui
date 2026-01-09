/**
 * MDX Components Provider
 * 
 * Defines custom components available in MDX files.
 * This is the "component mapping" that allows MDX to use:
 * - Custom UI components (ComponentPreview, CodeBlock)
 * - Enhanced HTML elements (custom headings, links, etc.)
 * - Registry-based component resolution
 * 
 * ARCHITECTURE:
 * - Server components by default
 * - Client components marked with 'use client' wrapper
 * - Maintains proper RSC boundaries
 */

import type { ComponentType, ReactNode } from 'react';
import { CodeBlock } from '@/components/code/CodeBlock';
import { ComponentPreviewWrapper } from './ComponentPreviewWrapper';
import { DemoCodeWrapper, ComponentCodeWrapper } from './SourceCodeWrapper';

/**
 * Component map type for MDX
 * 
 * Keys are either:
 * - HTML elements: 'h1', 'h2', 'p', 'pre', 'code', etc.
 * - Custom components: 'ComponentPreview', 'Demo', etc.
 */
export type MDXComponents = Record<string, ComponentType<any>>;

/**
 * Custom heading components with proper anchors
 * 
 * Enables deep-linking to sections in MDX content
 */
function H1({ children, ...props }: any) {
  const id = typeof children === 'string'
    ? children.toLowerCase().replace(/\s+/g, '-')
    : undefined;

  return (
    <h1
      id={id}
      className="scroll-mt-20 text-3xl font-semibold leading-none tracking-tight text-foreground mb-4"
      {...props}
    >
      {children}
    </h1>
  );
}

function H2({ children, ...props }: any) {
  const id = typeof children === 'string'
    ? children.toLowerCase().replace(/\s+/g, '-')
    : undefined;

  return (
    <h2
      id={id}
      className="scroll-mt-20 text-2xl font-semibold tracking-tight mb-4 mt-12 first:mt-0"
      {...props}
    >
      {children}
    </h2>
  );
}

function H3({ children, ...props }: any) {
  const id = typeof children === 'string'
    ? children.toLowerCase().replace(/\s+/g, '-')
    : undefined;

  return (
    <h3
      id={id}
      className="scroll-mt-20 text-xl font-semibold tracking-tight mb-3 mt-8"
      {...props}
    >
      {children}
    </h3>
  );
}

/**
 * Custom paragraph with better typography
 */
function P({ children, ...props }: any) {
  return (
    <p className="text-base leading-relaxed text-muted-foreground my-4" {...props}>
      {children}
    </p>
  );
}

/**
 * Custom list components
 */
function Ul({ children, ...props }: any) {
  return (
    <ul className="space-y-3 my-6" {...props}>
      {children}
    </ul>
  );
}

function Li({ children, ...props }: any) {
  return (
    <li className="flex items-start gap-3" {...props}>
      <span className="text-primary mt-1 text-lg">•</span>
      <span className="text-muted-foreground flex-1">{children}</span>
    </li>
  );
}

/**
 * Ordered list component
 */
function Ol({ children, ...props }: any) {
  return (
    <ol className="space-y-3 my-6 list-decimal list-inside" {...props}>
      {children}
    </ol>
  );
}

/**
 * Blockquote component
 */
function Blockquote({ children, ...props }: any) {
  return (
    <blockquote
      className="my-6 border-l-4 border-primary/50 pl-4 py-2 text-muted-foreground italic"
      {...props}
    >
      {children}
    </blockquote>
  );
}

/**
 * Strong/bold text
 */
function Strong({ children, ...props }: any) {
  return (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  );
}

/**
 * Emphasis/italic text
 */
function Em({ children, ...props }: any) {
  return (
    <em className="italic" {...props}>
      {children}
    </em>
  );
}

/**
 * Horizontal rule
 */
function Hr(props: any) {
  return <hr className="my-8 border-border" {...props} />;
}

/**
 * Anchor/link component
 */
function A({ children, href, ...props }: any) {
  const isExternal = href?.startsWith('http');
  return (
    <a
      href={href}
      className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
    </a>
  );
}

/**
 * Custom code block component
 * 
 * Integrates with our existing CodeBlock component
 */
function Pre({ children, ...props }: any) {
  // Extract code and language from children
  const code = children?.props?.children;
  const language = children?.props?.className?.replace('language-', '') || 'text';

  if (typeof code === 'string') {
    return (
      <div className="my-6">
        <CodeBlock code={code.trim()} language={language} />
      </div>
    );
  }

  // Fallback for complex children
  return (
    <pre className="my-4 p-4 rounded-lg bg-muted overflow-x-auto" {...props}>
      {children}
    </pre>
  );
}

/**
 * Inline code
 */
function Code({ children, className, ...props }: any) {
  // If it's inside a pre tag (from code blocks), don't style it
  if (className?.includes('language-')) {
    return <code className={className} {...props}>{children}</code>;
  }

  return (
    <code
      className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono border border-border"
      {...props}
    >
      {children}
    </code>
  );
}

/**
 * Custom table components with better styling
 */
function Table({ children, ...props }: any) {
  return (
    <div className="my-6 w-full overflow-x-auto">
      <table className="w-full text-sm border-collapse rounded-lg overflow-hidden border border-border" {...props}>
        {children}
      </table>
    </div>
  );
}

function Thead({ children, ...props }: any) {
  return (
    <thead className="bg-muted/50 border-b border-border" {...props}>
      {children}
    </thead>
  );
}

function Th({ children, ...props }: any) {
  return (
    <th className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap" {...props}>
      {children}
    </th>
  );
}

function Tbody({ children, ...props }: any) {
  return (
    <tbody className="divide-y divide-border" {...props}>
      {children}
    </tbody>
  );
}

function Tr({ children, ...props }: any) {
  return (
    <tr className="hover:bg-muted/30 transition-colors" {...props}>
      {children}
    </tr>
  );
}

function Td({ children, ...props }: any) {
  return (
    <td className="px-4 py-3 text-muted-foreground align-top" {...props}>
      {children}
    </td>
  );
}

/**
 * Get MDX components map
 * 
 * This is the single source of truth for what components
 * are available in MDX files.
 * 
 * Usage in MDX rendering:
 * ```tsx
 * <MDXComponent components={getMDXComponents()} />
 * ```
 */
export function getMDXComponents(): MDXComponents {
  return {
    // Custom components
    ComponentPreview: ComponentPreviewWrapper,
    DemoCode: DemoCodeWrapper,
    ComponentCode: ComponentCodeWrapper,

    // Enhanced HTML elements
    h1: H1,
    h2: H2,
    h3: H3,
    p: P,
    ul: Ul,
    ol: Ol,
    li: Li,
    pre: Pre,
    code: Code,
    table: Table,
    thead: Thead,
    th: Th,
    tbody: Tbody,
    tr: Tr,
    td: Td,
    blockquote: Blockquote,
    strong: Strong,
    em: Em,
    hr: Hr,
    a: A,
  };
}

/**
 * Type-safe component override helper
 * 
 * Allows pages to override specific components while
 * maintaining type safety.
 * 
 * @param overrides - Partial component map
 * @returns Complete component map with overrides
 */
export function mergeMDXComponents(
  overrides: Partial<MDXComponents>
): MDXComponents {
  return {
    ...getMDXComponents(),
    ...overrides,
  } as MDXComponents;
}
