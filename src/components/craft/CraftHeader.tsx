"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { CopyCodeButton } from "./CopyCodeButton";
import { useCraftPage } from "./CraftPageContext";
import { cn } from "@/lib/utils";

interface CraftHeaderProps {
  title: string;
  slug: string;
  pricing: string;
}

export function CraftHeader({ title, slug, pricing }: CraftHeaderProps) {
  const { showCode, setShowCode, isFullscreen, setIsFullscreen, setIsDrawerOpen } = useCraftPage();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur-xl border-b border-border/5 select-none">
      <div className="flex items-center justify-between h-16 px-6 lg:px-8">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-medium capitalize tracking-tight">
          <Link href="/craft" className="text-foreground/50 hover:text-foreground transition-colors">
            Components
          </Link>
          <span className="size-[3px] rounded-full bg-foreground/50" />
          <span className={cn(
            "transition-colors",
            pricing === "paid" ? "text-amber-500" : "text-foreground/50 hover:text-foreground"
          )}>
            {pricing === "paid" ? "Pro" : "Free"}
          </span>
          <span className="size-[3px] rounded-full bg-foreground/50" />
          <span className="text-foreground/50">{title}</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <CopyCodeButton name={slug} />
          
          <div className="h-4 w-px bg-foreground/10" />

          {/* Dock Actions */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.08]">
            {/* Fullscreen */}
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center justify-center size-8 cursor-pointer transition-all ease-in-out active:scale-95 hover:bg-foreground/5 rounded-xl"
              title={isFullscreen ? "Minimize" : "Maximize"}
            >
              <Icon icon={isFullscreen ? "lucide:minimize" : "lucide:maximize"} className="size-4 text-foreground/60" />
            </button>

            {/* Components */}
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center justify-center size-8 cursor-pointer transition-all ease-in-out active:scale-95 hover:bg-foreground/5 rounded-xl"
              title="Browse Components"
            >
              <Icon icon="lucide:component" className="size-4 text-foreground/60" />
            </button>

            {/* Code Toggle */}
            <button 
              onClick={() => setShowCode(!showCode)}
              className={cn(
                "relative flex items-center justify-center size-8 cursor-pointer transition-all ease-in-out active:scale-95 hover:bg-foreground/5 rounded-xl",
                showCode && "bg-foreground/10"
              )}
              title="Toggle Source Code"
            >
              <Icon icon="lucide:code-2" className="size-4 text-foreground/60" />
              <div className="absolute -right-0.5 -top-0.5 size-3.5 rounded-full bg-sky-500/10 p-[2px] text-sky-500">
                <Icon icon="lucide:lock" className="size-full" />
              </div>
            </button>

            {/* Command Palette */}
            <button 
              className="flex items-center justify-center size-8 cursor-pointer transition-all ease-in-out active:scale-95 hover:bg-foreground/5 rounded-xl"
              title="Command Palette"
            >
              <Icon icon="lucide:command" className="size-4 text-foreground/60" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
