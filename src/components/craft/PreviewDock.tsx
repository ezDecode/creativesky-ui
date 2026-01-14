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
        "absolute top-4 right-4 z-[60] flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-950/40 backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-300 hover:bg-zinc-950/60",
        className
      )}
    >
      <button
        onClick={onFullscreen}
        className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 group"
        title="Fullscreen"
      >
        <Icon icon="lucide:maximize-2" className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={onOpenComponents}
        className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 group"
        title="Components"
      >
        <Icon icon="lucide:component" className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={onShowCode}
        className={cn(
          "inline-flex items-center justify-center w-9 h-9 rounded-xl transition-all active:scale-95 group",
          showCode
            ? "text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
            : "text-zinc-400 hover:text-white hover:bg-white/10"
        )}
        title="Show Code"
      >
        <Icon icon="lucide:code-2" className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
      </button>

      <div className="w-px h-4 bg-white/10 mx-1" />

      <button
        className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 group"
        title="Command"
      >
        <Icon icon="lucide:terminal" className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
