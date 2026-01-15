"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DemoContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  scrollable?: boolean;
  background?: "light" | "dark" | "transparent";
  minHeight?: string;
  onScrollContainerRef?: (ref: HTMLDivElement | null) => void;
  isFullscreen?: boolean;
}

export function DemoContainer({
  children,
  scrollable = false,
  background = "dark",
  minHeight,
  onScrollContainerRef,
  className,
  isFullscreen = false,
  ...props
}: DemoContainerProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (onScrollContainerRef) {
      onScrollContainerRef(scrollRef.current);
    }
    return () => {
      if (onScrollContainerRef) {
        onScrollContainerRef(null);
      }
    };
  }, [onScrollContainerRef]);

  const bgClass = {
    light: "bg-zinc-100",
    dark: "bg-zinc-950",
    transparent: "bg-transparent",
  }[background];

  const baseStyles = cn(
    "relative w-full h-full overflow-hidden",
    bgClass,
    !isFullscreen && "rounded-xl border border-border/10 shadow-2xl ring-1 ring-border/10",
    className
  );

  if (scrollable) {
    return (
      <div className={baseStyles} style={{ minHeight }} {...props}>
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

  return (
    <div 
      className={cn(baseStyles, "flex items-center justify-center")}
      style={{ minHeight }}
      {...props}
    >
      {children}
    </div>
  );
}
