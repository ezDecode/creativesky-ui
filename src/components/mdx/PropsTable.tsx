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
    <div className={cn("my-6 w-full overflow-x-auto", className)}>
      <table className="w-full text-left border-collapse">
        <tbody className="divide-y-0">
          {props.map((prop) => (
            <tr key={prop.name} className="border-foreground/10 border-t last:border-b group">
              <td className="py-5 pr-4 align-top w-1/4 sm:w-1/3">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-foreground tracking-tight flex items-center gap-1">
                    {prop.name}
                    {prop.required && <span className="text-red-500/80 text-[10px] font-bold select-none">*</span>}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
                    {prop.type}
                  </span>
                </div>
              </td>
              <td className="py-5 align-top">
                <div className="flex flex-col gap-2">
                  <p className="text-[15px] text-muted-foreground leading-relaxed">
                    {prop.description}
                  </p>
                  {prop.default && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground/50">
                      <span className="uppercase tracking-widest text-[9px]">Default:</span>
                      <code className="text-foreground/40">{prop.default}</code>
                    </div>
                  )}
                </div>
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
    <div className="my-8 border-foreground/10 border-t last:border-b py-6 group">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground tracking-tight flex items-center gap-1">
            {name}
            {required && <span className="text-red-500/80 text-[10px] font-bold select-none">*</span>}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
            {type}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-[15px] text-muted-foreground leading-relaxed">
            {children}
          </div>
          {defaultValue && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground/50">
              <span className="uppercase tracking-widest text-[9px]">Default:</span>
              <code className="text-foreground/40">{defaultValue}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
