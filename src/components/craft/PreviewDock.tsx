"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface PreviewDockProps {
  onFullscreen?: () => void;
  onOpenComponents?: () => void;
  onShowCode?: () => void;
  showCode?: boolean;
  className?: string;
}

export function PreviewDock({
  onFullscreen,
  onOpenComponents,
  onShowCode,
  showCode = false,
  className,
}: PreviewDockProps) {
  return (
    <div
      className={cn(
        "absolute top-3 right-3 z-10 flex items-center gap-1 p-1 rounded-lg bg-zinc-900/80 backdrop-blur-sm border border-white/5",
        className
      )}
    >
      <button
        onClick={onFullscreen}
        className="inline-flex items-center justify-center w-7 h-7 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        title="Fullscreen"
      >
        <Icon icon="lucide:maximize-2" className="w-4 h-4" />
      </button>

      <button
        onClick={onOpenComponents}
        className="inline-flex items-center justify-center w-7 h-7 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        title="Components"
      >
        <Icon icon="lucide:component" className="w-4 h-4" />
      </button>

      <button
        onClick={onShowCode}
        className={cn(
          "inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors",
          showCode
            ? "text-white bg-white/10"
            : "text-zinc-400 hover:text-white hover:bg-white/10"
        )}
        title="Show Code"
      >
        <Icon icon="lucide:code-2" className="w-4 h-4" />
      </button>

      <button
        className="inline-flex items-center justify-center w-7 h-7 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        title="Command"
      >
        <Icon icon="lucide:terminal" className="w-4 h-4" />
      </button>
    </div>
  );
}
