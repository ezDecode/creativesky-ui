"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface PropDefinition {
  name: string;
  description: string;
}

interface PropsTableProps {
  props: PropDefinition[];
  className?: string;
}

/**
 * PropsTable - Component API Documentation
 * 
 * Renders a clean props table for component documentation.
 * 
 * Usage in MDX:
 * ```mdx
 * <PropsTable props={[
 *   { name: "phrase", description: "The text to reveal" },
 *   { name: "color", description: "Primary color" },
 * ]} />
 * ```
 */
export function PropsTable({ props, className }: PropsTableProps) {
  return (
    <div className={cn("my-8 w-full overflow-x-auto", className)}>
      <table className="w-full text-left border-collapse">
        <tbody className="divide-y-0">
          {props.map((prop) => (
            <tr key={prop.name} className="border-foreground/10 border-t last:border-b group">
              <td className="py-4 pr-4 align-top w-1/4 sm:w-1/3">
                <span className="inline-flex items-center gap-1.5 font-mono text-sm font-medium text-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/10">
                  {prop.name}
                </span>
              </td>
              <td className="py-4 align-top">
                <p className="text-base text-muted-foreground leading-relaxed">
                  {prop.description}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * PropItem - Inline prop documentation
 * 
 * Usage: <PropItem name="color">Description here</PropItem>
 */
export function PropItem({
  name,
  children
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-8 border-foreground/10 border-t last:border-b py-6 group">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4">
        <div className="flex flex-col gap-1">
          <span className="inline-flex items-center gap-1.5 font-mono text-sm font-medium text-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/10 w-fit">
            {name}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-base text-muted-foreground leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
