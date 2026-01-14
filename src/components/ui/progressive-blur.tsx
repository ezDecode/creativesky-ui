import React from "react";
import { cn } from "@/lib/utils";

type ProgressiveBlurProps = {
  className?: string;
  position?: "top" | "bottom";
  height?: string;
  blurAmount?: string;
};

export const ProgressiveBlur = ({
  className,
  position = "top",
  height = "80px",
  blurAmount = "8px",
}: ProgressiveBlurProps) => {
  const isTop = position === "top";

  return (
    <div
      className={cn(
        "pointer-events-none fixed left-0 z-40 w-full select-none",
        isTop ? "top-0" : "bottom-0",
        className
      )}
      style={{
        height,
        background: `linear-gradient(${isTop ? "to bottom" : "to top"}, hsl(var(--background)), transparent)`,
        backdropFilter: `blur(${blurAmount})`,
        maskImage: `linear-gradient(${isTop ? "to bottom" : "to top"}, black, transparent)`,
        WebkitBackdropFilter: `blur(${blurAmount})`,
        WebkitMaskImage: `linear-gradient(${isTop ? "to bottom" : "to top"}, black, transparent)`,
      }}
    />
  );
};
