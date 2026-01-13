"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ComponentDesign } from "@/lib/types";

interface DemoContainerProps {
  children: React.ReactNode;
  design?: ComponentDesign;
  scrollable?: boolean;
  background?: "light" | "dark" | "transparent";
  minHeight?: string;
  onScrollContainerRef?: (ref: HTMLDivElement | null) => void;
}

/**
 * DemoContainer - Universal Preview Container
 * 
 * Handles all component preview scenarios:
 * - Scrollable: For scroll-based animations (creates independent scroll context)
 * - Non-scrollable: For standard components (centered)
 * - Background variants: light, dark, transparent
 * - Surface styles based on design tokens
 */
export function DemoContainer({
  children,
  design,
  scrollable = false,
  background = "dark",
  minHeight,
  onScrollContainerRef,
}: DemoContainerProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (onScrollContainerRef) {
      onScrollContainerRef(scrollRef.current);
    }
  }, [onScrollContainerRef]);

  const surfaceStyles = getSurfaceStyles(design?.surface ?? "flat", background);
  const baseStyles = cn(
    "relative w-full h-full rounded-xl overflow-hidden",
    surfaceStyles
  );

  // Scrollable: independent scroll context for scroll-based animations
  if (scrollable) {
    return (
      <div 
        className={baseStyles}
        style={{ minHeight }}
      >
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-hide"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  // Non-scrollable: centered container
  return (
    <div 
      className={cn(baseStyles, "flex items-center justify-center")}
      style={{ minHeight }}
    >
      {children}
    </div>
  );
}

function getSurfaceStyles(
  surface: ComponentDesign["surface"], 
  background: "light" | "dark" | "transparent"
): string {
  // Background base
  const bgBase = {
    light: "bg-zinc-100",
    dark: "bg-zinc-800/50",
    transparent: "bg-transparent",
  }[background];

  // Surface modifiers
  const surfaceModifier = {
    flat: "",
    elevated: "shadow-lg",
    inset: "shadow-inner",
    glassmorphic: "backdrop-blur-sm",
  }[surface];

  return cn(bgBase, surfaceModifier);
}
