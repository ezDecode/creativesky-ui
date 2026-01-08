"use client";

import * as React from "react";
import { resolveComponent } from "@/lib/registry/resolver";
import { DemoContainer } from "./DemoContainer";
import { cn } from "@/lib/utils";

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  align?: "center" | "start" | "end";
  hideCode?: boolean;
  showDeviceToggle?: boolean;
}

/**
 * ComponentPreview
 * 
 * A universal component for rendering any demo from the registry.
 * Inspired by MagicUI's ComponentPreview pattern.
 * 
 * Usage in MDX or React:
 * ```tsx
 * <ComponentPreview name="adaptive-tooltip" />
 * <ComponentPreview name="motion-surface" align="start" />
 * ```
 */
export function ComponentPreview({
  name,
  className,
  align = "center",
  hideCode = false,
  showDeviceToggle = true,
  ...props
}: ComponentPreviewProps) {
  const [Component, setComponent] = React.useState<React.ComponentType | null>(null);
  const [metadata, setMetadata] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    resolveComponent(name)
      .then((resolved) => {
        if (mounted) {
          setComponent(() => resolved.Component);
          setMetadata(resolved.metadata);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || "Failed to load component");
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [name]);

  if (isLoading) {
    return (
      <div className={cn("w-full", className)} {...props}>
        <DemoContainer padding="lg" showDeviceToggle={false}>
          <div className="w-full min-h-80 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <span className="text-sm">Loading {name}...</span>
            </div>
          </div>
        </DemoContainer>
      </div>
    );
  }

  if (error || !Component) {
    return (
      <div className={cn("w-full", className)} {...props}>
        <DemoContainer padding="lg" showDeviceToggle={false}>
          <div className="w-full min-h-80 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">
              Component{" "}
              <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
                {name}
              </code>{" "}
              {error || "not found in registry."}
            </p>
          </div>
        </DemoContainer>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      <DemoContainer
        design={metadata?.design}
        padding="lg"
        align={align}
        showDeviceToggle={showDeviceToggle}
      >
        <Component {...(metadata?.demo?.defaultProps || {})} />
      </DemoContainer>
    </div>
  );
}
