/**
 * MDX Components Provider
 * 
 * Defines custom components available in MDX files.
 * This is the "component mapping" that allows MDX to use:
 * - Custom UI components (ComponentPreview, CodeBlock, Callout, Steps)
 * - Enhanced HTML elements (custom headings, links, etc.)
 * - Registry-based component resolution
 * 
 * AVAILABLE COMPONENTS:
 * - ComponentPreview: Renders a component from the registry
 * - Callout: Info, warning, error, success callouts
 * - Steps/Step: Numbered step-by-step guides
 * - PropsTable: API documentation tables
 * - PropItem: Inline prop documentation
 * - DemoCode: Shows source code for demos
 * - ComponentCode: Shows component source code
 */

import type { ComponentType, ReactNode } from 'react';
import { CodeBlock } from '@/components/code/CodeBlock';
import { ComponentPreview } from '@/components/craft/ComponentPreview';
import { DemoCodeWrapper, ComponentCodeWrapper } from './SourceCodeWrapper';
import { Callout } from '@/components/mdx/Callout';
import { Steps, Step } from '@/components/mdx/Steps';
import { PropsTable, PropItem } from '@/components/mdx/PropsTable';
import { cn } from "@/lib/utils";

/**
 * Component map type for MDX
 * 
 * Keys are either:
 * - HTML elements: 'h1', 'h2', 'p', 'pre', 'code', etc.
 * - Custom components: 'ComponentPreview', 'Callout', 'Steps', etc.
 */
export type MDXComponents = Record<string, ComponentType<any>>;

/**
 * Custom heading components with proper anchors
 */
function H1({ children, ...props }: any) {
  const id = typeof children === 'string'
    ? children.toLowerCase().replace(/\s+/g, '-')
    : undefined;

  return (
    <h1
      id={id}
      className="scroll-mt-20 text-4xl font-semibold tracking-tight text-foreground mb-6"
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
    <div className="group flex items-center gap-2 mt-12 mb-6 scroll-mt-24">
      <h2
        id={id}
        className="text-2xl font-medium tracking-tight text-foreground w-full flex items-center gap-2"
        {...props}
      >
        {children}
        <a
          href={`#${id}`}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-primary/50 hover:text-primary"
          aria-label="Permalink"
        >
          #
        </a>
      </h2>
    </div>
  );
}

function H3({ children, ...props }: any) {
  const id = typeof children === 'string'
    ? children.toLowerCase().replace(/\s+/g, '-')
    : undefined;

  return (
    <h3
      id={id}
      className="group scroll-mt-24 text-xl font-medium tracking-tight mb-3 mt-8 text-foreground flex items-center gap-2"
      {...props}
    >
      {children}
      <a
        href={`#${id}`}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-primary/50 hover:text-primary text-sm"
        aria-label="Permalink"
      >
        #
      </a>
    </h3>
  );
}

/**
 * Custom paragraph with better typography
 */
function P({ children, ...props }: any) {
  return (
    <p className="text-base leading-7 text-muted-foreground mb-6 last:mb-0 max-w-[69ch]" {...props}>
      {children}
    </p>
  );
}

/**
 * Custom list components
 */
function Ul({ children, ...props }: any) {
  return (
    <ul className="my-6 ml-6 list-none space-y-2 max-w-[69ch]" {...props}>
      {children}
    </ul>
  );
}

function Li({ children, ...props }: any) {
  return (
    <li className="relative pl-2" {...props}>
      <span className="absolute left-[-1.5rem] top-2.5 h-1.5 w-1.5 rounded-full bg-primary/60 content-['']" />
      <span className="text-muted-foreground leading-7">{children}</span>
    </li>
  );
}

/**
 * Ordered list component
 */
function Ol({ children, ...props }: any) {
  return (
    <ol className="my-6 ml-6 list-decimal space-y-2 marker:text-muted-foreground/60 marker:font-medium max-w-[69ch]" {...props}>
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
      className="my-6 pl-6 py-3 border-l-2 border-primary/30 text-muted-foreground italic bg-muted/20 rounded-r-lg"
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
    <strong className="font-medium text-foreground" {...props}>
      {children}
    </strong>
  );
}

/**
 * Emphasis/italic text
 */
function Em({ children, ...props }: any) {
  return (
    <em className="italic text-foreground/80" {...props}>
      {children}
    </em>
  );
}

/**
 * Horizontal rule
 */
function Hr(props: any) {
  return <hr className="my-8 border-border/10" {...props} />;
}

/**
 * Anchor/link component
 */
function A({ children, href, ...props }: any) {
  const isExternal = href?.startsWith('http');
  return (
    <a
      href={href}
      className="font-medium text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all"
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
    </a>
  );
}

/**
 * Custom code block component
 */
function Pre({ children, ...props }: any) {
  const code = children?.props?.children;
  const language = children?.props?.className?.replace('language-', '') || 'text';

  if (typeof code === 'string') {
    return (
      <div className="my-6 overflow-hidden rounded-xl border border-border/10 bg-zinc-950 dark:bg-zinc-900 shadow-sm ring-1 ring-border/5">
        <CodeBlock code={code.trim()} language={language} />
      </div>
    );
  }

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
  if (className?.includes('language-')) {
    return <code className={className} {...props}>{children}</code>;
  }

  return (
    <code
      className="relative rounded bg-muted/40 px-[0.3rem] py-[0.1rem] font-mono text-sm font-normal text-foreground border border-border/10"
      {...props}
    >
      {children}
    </code>
  );
}

/**
 * Custom table components
 */
function Table({ children, ...props }: any) {
  return (
    <div className="my-6 w-full overflow-hidden rounded-xl border border-border/10 bg-background/50 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" {...props}>
          {children}
        </table>
      </div>
    </div>
  );
}

function Thead({ children, ...props }: any) {
  return (
    <thead className="bg-muted/20 border-b border-border/10" {...props}>
      {children}
    </thead>
  );
}

function Th({ children, ...props }: any) {
  return (
    <th className="px-4 py-3 text-left font-normal text-foreground/80 whitespace-nowrap" {...props}>
      {children}
    </th>
  );
}

function Tbody({ children, ...props }: any) {
  return (
    <tbody className="divide-y divide-border/10 bg-background/50" {...props}>
      {children}
    </tbody>
  );
}

function Tr({ children, ...props }: any) {
  return (
    <tr className="hover:bg-muted/10 transition-colors group" {...props}>
      {children}
    </tr>
  );
}

function Td({ children, ...props }: any) {
  return (
    <td className="px-4 py-3 text-muted-foreground align-top group-hover:text-foreground transition-colors" {...props}>
      {children}
    </td>
  );
}

/**
 * Image component
 */
function Img({ src, alt, ...props }: any) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="rounded-xl border border-border/10 my-8 w-full h-auto shadow-sm"
      {...props}
    />
  );
}

/**
 * Get MDX components map
 */
export function getMDXComponents(): MDXComponents {
  return {
    // Custom components
    ComponentPreview,
    DemoCode: DemoCodeWrapper,
    ComponentCode: ComponentCodeWrapper,
    Callout,
    Steps,
    Step,
    PropsTable,
    PropItem,
    // HTML elements
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
    img: Img,
  };
}

export function mergeMDXComponents(
  overrides: Partial<MDXComponents>
): MDXComponents {
  return {
    ...getMDXComponents(),
    ...overrides,
  } as MDXComponents;
}
