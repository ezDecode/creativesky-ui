"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { DocsPageConfig, Interaction } from "./schema";
import { getMDXComponents } from "@/lib/mdx/components";
import { ComponentCodeWrapper, DemoCodeWrapper } from "@/lib/mdx/SourceCodeWrapper";
import { Steps, Step } from "@/components/mdx/Steps";
import { PropsTable, PropItem } from "@/components/mdx/PropsTable";
import { Callout } from "@/components/mdx/Callout";
import { MDXContent } from "@/lib/mdx/MDXContent";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function SectionRenderer({ config }: { config: DocsPageConfig }) {
  const { description, dependencies, interactions, license, showSource, mdxContent } = config;

  const mdxComponents = {
    ...getMDXComponents(),
    ComponentCode: () => null,
    DemoCode: () => null,
    Steps: ({ children }: { children: React.ReactNode }) => <div className="space-y-4">{children}</div>,
    Step: ({ children }: { children: React.ReactNode }) => <div className="docs-step-plain">{children}</div>,
    PropsTable,
    PropItem,
    Callout,
    ComponentPreview: () => null,
    h1: () => null,
  };

  return (
    <>
      {/* Description Section */}
      {description && (
        <section className="mb-14">
          <p className="text-lg text-foreground/90 leading-relaxed tracking-tight">
            {description}
          </p>
        </section>
      )}

      {/* Dependencies Section */}
      {dependencies && dependencies.length > 0 && (
        <section className="mb-12">
          <h3 className="docs-h3 flex items-center gap-2 text-foreground font-medium mb-4">Dependencies</h3>
          <div className="flex flex-wrap items-center gap-2">
            {dependencies.map((dep) => (
              <a
                key={dep}
                href={dep === "framer-motion" ? "https://motion.dev/" : `https://www.npmjs.com/package/${dep}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted hover:bg-muted/80 flex h-9 w-fit cursor-pointer items-center gap-2 rounded-xl px-3 text-xs font-mono transition-all duration-300 border border-border/5"
              >
                {dep}
                {dep === "framer-motion" && <Icon icon="simple-icons:framer" className="size-3" />}
                {dep === "lucide-react" && <Icon icon="simple-icons:lucide" className="size-4" />}
                {dep === "gsap" && <Icon icon="simple-icons:greensock" className="size-4" />}
                {dep === "animejs" && <Icon icon="simple-icons:javascript" className="size-4" />}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Interactions Section */}
      {interactions && interactions.length > 0 && (
        <section className="mb-12">
          <h3 className="docs-h3 text-foreground font-medium mb-4">Interaction</h3>
          <table className="w-full">
            <tbody>
              {interactions.map((interaction: Interaction, i: number) => (
                <tr key={i} className="border-foreground/10 h-12 border-t tracking-tight last:border-b">
                  <td className="w-1/4">
                    <InteractionIcon type={interaction.type} />
                  </td>
                  <td className="text-base text-muted-foreground">{interaction.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* MDX Content (Installation, Usage, Props) */}
      <article className="docs-article prose prose-zinc dark:prose-invert max-w-none mb-12">
        {mdxContent ? (
          <ErrorBoundary componentName="Documentation">
            <MDXContent
              source={mdxContent}
              components={mdxComponents}
            />
          </ErrorBoundary>
        ) : (
          <p className="text-muted-foreground italic">No documentation available.</p>
        )}
      </article>

      {/* Source Code Section info */}
      {showSource && (
        <section className="mb-12">
          <h3 className="docs-h3 text-foreground font-medium mb-4">Source code</h3>
          <p className="docs-p flex items-center gap-2 flex-wrap text-muted-foreground text-base">
            Click on the top right
            <span className="flex items-center justify-center bg-muted size-8 rounded-xl border border-border/10">
              <Icon icon="lucide:code-2" className="size-4" />
            </span>
            to view the source code implementation.
          </p>
        </section>
      )}

      {/* License Section */}
      {license && license.length > 0 && (
        <section>
          <h3 className="docs-h3 text-foreground font-medium mb-4">License & Usage</h3>
          <ul className="space-y-2 list-none p-0">
            {license.map((item, i) => (
              <li key={i} className="text-base text-muted-foreground flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function InteractionIcon({ type }: { type: Interaction["type"] }) {
  switch (type) {
    case "click": return <Icon icon="lucide:mouse-pointer-click" className="size-5" />;
    case "hover": return <Icon icon="lucide:pointer" className="size-5" />;
    case "scroll": return <Icon icon="lucide:mouse" className="size-5" />;
    case "drag": return <Icon icon="lucide:move" className="size-5" />;
    case "input": return <Icon icon="lucide:keyboard" className="size-5" />;
    default: return <Icon icon="lucide:info" className="size-5" />;
  }
}
