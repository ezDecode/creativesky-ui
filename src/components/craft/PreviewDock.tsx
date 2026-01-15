"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface PreviewDockProps {
  onFullscreen?: () => void;
  onShowCode?: () => void;
  onOpenComponents?: () => void;
  onCommand?: () => void;
  showCode?: boolean;
  isFullscreen?: boolean;
  className?: string;
}

export function PreviewDock({
  onFullscreen,
  onShowCode,
  onOpenComponents,
  onCommand,
  showCode = false,
  isFullscreen = false,
  className,
}: PreviewDockProps) {
  return (
    <section
      className={cn(
        "flex items-center border-foreground/5 bg-muted-2 shadow-glass select-none gap-1 rounded-2xl border p-1.5 flex-shrink-0",
        className
      )}
    >
      {/* Maximize / Fullscreen - Mobile */}
      <div className="bg-muted-3 flex size-8 items-center justify-center rounded-[16px] lg:hidden">
        <button
          type="button"
          onClick={onFullscreen}
          className="flex items-center justify-center size-full cursor-pointer transition-all ease-in-out active:scale-95"
        >
          <Icon
            icon={isFullscreen ? "lucide:minimize" : "lucide:maximize"}
            className="size-4"
          />
          <span className="sr-only">{isFullscreen ? "Minimize View" : "Maximize View"}</span>
        </button>
      </div>

      {/* Maximize / Fullscreen - Desktop */}
      <div className="bg-muted-3 hidden size-8 items-center justify-center rounded-[16px] lg:flex">
        <button
          type="button"
          onClick={onFullscreen}
          className="flex items-center justify-center size-full rounded-2xl cursor-pointer transition-all ease-in-out active:scale-95"
        >
          <Icon
            icon={isFullscreen ? "lucide:minimize" : "lucide:maximize"}
            className="size-4"
          />
          <span className="sr-only">{isFullscreen ? "Minimize View" : "Maximize View"}</span>
        </button>
      </div>

      {/* Components Button */}
      <div className="bg-muted-3 flex size-8 items-center justify-center rounded-[16px]">
        <button
          type="button"
          onClick={onOpenComponents}
          className="flex items-center justify-center size-full rounded-2xl cursor-pointer transition-all ease-in-out active:scale-95"
        >
          <Icon icon="lucide:circle-arrow-out-up-right" className="size-4" />
          <span className="sr-only">Components</span>
        </button>
      </div>

      {/* Code Button */}
      <div
        className={cn(
          "bg-muted-3 relative flex size-8 items-center justify-center rounded-[16px] cursor-pointer active:scale-95",
          showCode && "bg-foreground/10"
        )}
      >
        <button
          type="button"
          onClick={onShowCode}
          className="flex items-center justify-center size-full rounded-2xl cursor-pointer"
        >
          <Icon icon="lucide:code-xml" className="size-4" />
          <span className="sr-only">Source Code</span>
        </button>
      </div>

      {/* Command Button */}
      <div className="bg-muted-3 flex size-8 items-center justify-center rounded-[16px]">
        <button
          type="button"
          onClick={onCommand}
          className="flex items-center justify-center size-full rounded-2xl cursor-pointer transition-all ease-in-out active:scale-95"
        >
          <Icon icon="lucide:command" className="size-4" />
          <span className="sr-only">Command + K</span>
        </button>
      </div>
    </section>
  );
}
