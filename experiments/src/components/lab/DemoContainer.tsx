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
}

export function DemoContainer({
  children,
  design,
  minHeight = "20rem",
  maxHeight = "none",
  padding = "md",
  showDeviceToggle = true,
  align = "center",
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
    <section className="w-full">
      <div className="relative">
        {showDeviceToggle && (
          <div className="absolute top-3 right-3 z-10 hidden md:flex items-center gap-0.5 border border-border/20 rounded-lg p-1 bg-background/95 backdrop-blur-sm shadow-sm">
            <ViewportButton
              active={viewport === "desktop"}
              onClick={() => setViewport("desktop")}
              icon="solar:monitor-linear"
              label="Desktop view"
            />
            <ViewportButton
              active={viewport === "tablet"}
              onClick={() => setViewport("tablet")}
              icon="solar:tablet-linear"
              label="Tablet view"
            />
            <ViewportButton
              active={viewport === "mobile"}
              onClick={() => setViewport("mobile")}
              icon="solar:smartphone-linear"
              label="Mobile view"
            />
          </div>
        )}

        <div className="flex items-center justify-center w-full">
          <div
            className={cn(
              "w-full transition-all duration-300",
              viewport === "desktop"
                ? "max-w-full"
                : viewport === "tablet"
                ? "max-w-2xl"
                : "max-w-sm"
            )}
          >
            <div
              className={cn(
                "relative isolate w-full rounded-xl overflow-hidden",
                surfaceStyles,
                motionStyles
              )}
              style={{
                minHeight,
                maxHeight: maxHeight === "none" ? "none" : maxHeight,
              }}
            >
              <div
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
    </section>
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
