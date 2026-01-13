"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface PropDefinition {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

interface PropsTableProps {
  props: PropDefinition[];
  className?: string;
}

/**
 * PropsTable - Component API Documentation
 * 
 * Renders a beautiful props table for component documentation.
 * 
 * Usage in MDX:
 * ```mdx
 * <PropsTable props={[
 *   { name: "phrase", type: "string", required: true, description: "The text to reveal" },
 *   { name: "color", type: "string", default: "#ff6b00", description: "Primary color" },
 * ]} />
 * ```
 */
export function PropsTable({ props, className }: PropsTableProps) {
  return (
    <div className={cn(
      "my-6 w-full overflow-hidden rounded-xl border border-border/10 bg-background/50 shadow-sm",
      className
    )}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
            <thead className="bg-muted/20 border-b border-border/10">
              <tr>
                <th className="px-4 py-3 text-left font-normal text-foreground/80">Prop</th>
                <th className="px-4 py-3 text-left font-normal text-foreground/80">Type</th>
                <th className="px-4 py-3 text-left font-normal text-foreground/80">Default</th>
                <th className="px-4 py-3 text-left font-normal text-foreground/80">Description</th>
              </tr>
            </thead>

          <tbody className="divide-y divide-border/10">
            {props.map((prop) => (
              <tr key={prop.name} className="hover:bg-muted/10 transition-colors">
                <td className="px-4 py-3 font-mono text-primary">
                  {prop.name}
                  {prop.required && <span className="text-red-500 ml-1">*</span>}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground bg-muted/20 rounded">
                  {prop.type}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {prop.default ?? <span className="text-muted-foreground/50">—</span>}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {prop.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * PropItem - Inline prop documentation
 * 
 * Usage: <PropItem name="color" type="string" default="#fff">Description here</PropItem>
 */
export function PropItem({ 
  name, 
  type, 
  default: defaultValue,
  required,
  children 
}: {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="my-4 p-4 rounded-lg bg-muted/10 border border-border/10">
      <div className="flex items-center gap-3 mb-2">
        <code className="text-primary font-medium">{name}</code>
        <code className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{type}</code>
        {required && <span className="text-xs text-red-500 font-normal">Required</span>}
        {defaultValue && (
          <span className="text-xs text-muted-foreground">
            Default: <code className="text-foreground/70">{defaultValue}</code>
          </span>
        )}
      </div>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}
