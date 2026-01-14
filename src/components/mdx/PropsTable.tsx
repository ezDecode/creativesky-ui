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
 * Renders a clean props list for component documentation.
 */
export function PropsTable({ props, className }: PropsTableProps) {
  return (
    <div className={cn("my-10 space-y-8", className)}>
      {props.map((prop) => (
        <div key={prop.name} className="flex flex-col gap-2.5 group">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[15px] text-primary font-medium tracking-tight">
              {prop.name}
              {prop.required && <span className="text-red-500 ml-1">*</span>}
            </span>
            <span className="h-px flex-1 bg-border/5" />
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground/60 px-2 py-0.5 rounded-md border border-border/5 bg-muted/30">
                {prop.type}
              </span>
              {prop.default && (
                <span className="font-mono text-[11px] text-muted-foreground/40 italic">
                  {prop.default}
                </span>
              )}
            </div>
          </div>
          <p className="text-[14px] text-muted-foreground leading-relaxed pl-0.5">
            {prop.description}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * PropItem - Inline prop documentation
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
    <div className="my-10 flex flex-col gap-2.5 group">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[15px] text-primary font-medium tracking-tight">
          {name}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
        <span className="h-px flex-1 bg-border/5" />
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted-foreground/60 px-2 py-0.5 rounded-md border border-border/5 bg-muted/30">
            {type}
          </span>
          {defaultValue && (
            <span className="font-mono text-[11px] text-muted-foreground/40 italic">
              {defaultValue}
            </span>
          )}
        </div>
      </div>
      <div className="text-[14px] text-muted-foreground leading-relaxed pl-0.5">
        {children}
      </div>
    </div>
  );
}
