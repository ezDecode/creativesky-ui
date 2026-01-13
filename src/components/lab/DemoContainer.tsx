"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { ComponentDesign } from "@/lib/types";

interface DemoContainerProps {
  children: React.ReactNode;
  design?: ComponentDesign;
  minHeight?: string;
  maxHeight?: string;
  padding?: "sm" | "md" | "lg" | "none";
  showDeviceToggle?: boolean;
  align?: "center" | "start" | "end";
  onContainerRef?: (ref: HTMLDivElement | null) => void;
}

export function DemoContainer({
  children,
  design,
  minHeight = "20rem",
  maxHeight = "none",
  padding = "md",
  showDeviceToggle = true,
  align = "center",
  onContainerRef,
}: DemoContainerProps) {
  const [viewport, setViewport] =
    React.useState<"desktop" | "tablet" | "mobile">("desktop");

  const surfaceStyles = getSurfaceStyles(design?.surface ?? "flat");
  const motionStyles = getMotionStyles(design?.motion ?? "smooth");

  const paddingMap = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const alignMap = {
    center: "items-center justify-center",
    start: "items-start justify-start",
    end: "items-end justify-end",
  };

  return (
    <div className="relative w-full h-full flex flex-col">


      <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300 ease-in-out origin-top",
            viewport === "desktop"
              ? "w-full"
              : viewport === "tablet"
                ? "w-full max-w-[48rem]" // ~768px
                : "w-full max-w-[24rem]" // ~384px
          )}
        >
          <div
            className={cn(
              "relative w-full h-full rounded-xl overflow-hidden border border-border/20",
              surfaceStyles,
              motionStyles
            )}
            style={{
              minHeight,
              maxHeight: maxHeight === "none" ? "none" : maxHeight,
            }}
          >
            <div
              ref={onContainerRef}
              className={cn(
                "w-full h-full overflow-auto scrollbar-hide",
                paddingMap[padding],
                align !== "center" ? "flex" : "",
                alignMap[align]
              )}
            >
              <div className={cn(
                "w-full",
                align === "center" ? "flex items-center justify-center min-h-full" : ""
              )}>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewportButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-md transition-all duration-200",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
      title={label}
      aria-label={label}
    >
      <Icon icon={icon} width={16} height={16} />
    </button>
  );
}

function getSurfaceStyles(surface: ComponentDesign["surface"]): string {
  switch (surface) {
    case "elevated":
      return "bg-muted/40 shadow-lg";
    case "inset":
      return "bg-muted/50 shadow-inner";
    case "flat":
    default:
      return "bg-muted/20";
  }
}

function getMotionStyles(motion: ComponentDesign["motion"]): string {
  switch (motion) {
    case "spring":
      return "will-change-transform";
    case "linear":
      return "transition-none";
    case "none":
      return "";
    case "smooth":
    default:
      return "";
  }
}
