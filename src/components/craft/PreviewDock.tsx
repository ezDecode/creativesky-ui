"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface PreviewDockProps {
  onFullscreen?: () => void;
  onOpenComponents?: () => void;
  onShowCode?: () => void;
  showCode?: boolean;
  isFullscreen?: boolean;
  className?: string;
}

export function PreviewDock({
  onFullscreen,
  onOpenComponents,
  onShowCode,
  showCode = false,
  isFullscreen = false,
  className,
}: PreviewDockProps) {
  return (
    <section
      className={cn(
        "flex items-center border-foreground/5 bg-muted-2 shadow-glass select-none gap-1 rounded-2xl border p-1.5 transition-all duration-300",
        className
      )}
    >
      {/* Maximize / Fullscreen */}
      <div className="bg-muted-3 flex size-10 lg:size-8 items-center justify-center rounded-[12px] lg:rounded-[16px]">
        <button
          type="button"
          onClick={onFullscreen}
          className="flex items-center justify-center size-full cursor-pointer transition-all ease-in-out active:scale-95 hover:bg-foreground/5 rounded-[12px] lg:rounded-[16px]"
        >
          <Icon icon={isFullscreen ? "lucide:minimize" : "lucide:maximize"} className="size-5 lg:size-4" />
          <span className="sr-only">{isFullscreen ? "Minimize View" : "Maximize View"}</span>
        </button>
      </div>

      {/* Components Button */}
      <div className="bg-muted-3 flex size-10 lg:size-8 items-center justify-center rounded-[12px] lg:rounded-[16px]">
        <button
          type="button"
          onClick={onOpenComponents}
          className="flex items-center justify-center size-full cursor-pointer transition-all ease-in-out active:scale-95 hover:bg-foreground/5 rounded-[12px] lg:rounded-[16px]"
        >
          <Icon icon="lucide:component" className="size-5 lg:size-4" />
          <span className="sr-only">Components</span>
        </button>
      </div>

      {/* Code Button (with Lock for "Pro" feel as requested) */}
      <div className="bg-muted-3 relative flex size-10 lg:size-8 items-center justify-center rounded-[12px] lg:rounded-[16px]">
        <button
          type="button"
          onClick={onShowCode}
          className={cn(
            "flex items-center justify-center size-full cursor-pointer transition-all ease-in-out active:scale-95 hover:bg-foreground/5 rounded-[12px] lg:rounded-[16px]",
            showCode && "bg-foreground/10"
          )}
        >
          <Icon icon="lucide:code-2" className="size-5 lg:size-4" />
          <p className="absolute -right-1 -top-2 size-5 rounded-full bg-sky-500/10 p-[4px] text-xs text-sky-500">
            <Icon icon="lucide:lock" className="size-full" />
          </p>
          <span className="sr-only">Show Code</span>
        </button>
      </div>

      {/* Command Palette / Terminal */}
      <div className="bg-muted-3 flex size-10 lg:size-8 items-center justify-center rounded-[12px] lg:rounded-[16px]">
        <button
          type="button"
          className="flex items-center justify-center size-full cursor-pointer transition-all ease-in-out active:scale-95 hover:bg-foreground/5 rounded-[12px] lg:rounded-[16px]"
        >
          <Icon icon="lucide:command" className="size-5 lg:size-4" />
          <span className="sr-only">Command Palette</span>
        </button>
      </div>

    </section>
  );
}

