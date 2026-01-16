"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <motion.section
      layout
      className={cn(
        "flex items-center gap-1 p-1.5 rounded-2xl",
        "bg-zinc-900/80 backdrop-blur-md",
        "border border-white/5",
        "shadow-2xl shadow-black/40",
        className
      )}
    >
      <DockItem
        onClick={onFullscreen}
        icon={isFullscreen ? "lucide:minimize" : "lucide:maximize"}
        label={isFullscreen ? "Minimize" : "Maximize"}
        isActive={isFullscreen}
      />

      <div className="w-px h-4 bg-white/5 mx-0.5" />

      <DockItem
        onClick={onOpenComponents}
        icon="lucide:circle-arrow-out-up-right"
        label="Components"
      />

      <DockItem
        onClick={onShowCode}
        icon="lucide:code-xml"
        label="Code"
        isActive={showCode}
      />

      <DockItem
        onClick={onCommand}
        icon="lucide:command"
        label="Cmd+K"
        className="hidden sm:flex"
      />
    </motion.section>
  );
}

interface DockItemProps {
  icon: string;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}

function DockItem({ icon, label, onClick, isActive, className }: DockItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-center size-9 rounded-xl transition-all duration-200",
        "text-zinc-400 hover:text-zinc-100",
        "hover:bg-zinc-800/50",
        isActive && "bg-zinc-800 text-zinc-50 shadow-inner",
        className
      )}
    >
      <Icon
        icon={icon}
        className="size-[18px] transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
      />
      <span className="sr-only">{label}</span>

      {/* Subtle active indicator */}
      {isActive && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-zinc-400 rounded-full" />
      )}
    </button>
  );
}
