"use client";

import * as React from "react";
import { resolveComponent } from "@/lib/registry/resolver";
import { DemoContainer } from "./DemoContainer";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

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
 * 
 * Improvements:
 * - Better skeleton loading state
 * - Clearer error states with retry option
 * - Fill-height behavior for split layouts
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
  const [retryCount, setRetryCount] = React.useState(0);

  React.useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);

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
  }, [name, retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className={cn("w-full h-full flex flex-col", className)} {...props}>
        <DemoContainer padding="none" showDeviceToggle={false}>
          <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center gap-4 bg-muted/5 animate-pulse">
            <div className="h-10 w-10 text-muted-foreground/20 animate-spin border-4 border-current border-t-transparent rounded-full" />
            <p className="text-sm font-medium text-muted-foreground/50">Loading visualization...</p>
          </div>
        </DemoContainer>
      </div>
    );
  }

  if (error || !Component) {
    return (
      <div className={cn("w-full h-full flex flex-col", className)} {...props}>
        <DemoContainer padding="lg" showDeviceToggle={false}>
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center p-6">
            <div className="p-3 rounded-full bg-red-500/10 text-red-500">
              <Icon icon="solar:danger-triangle-bold" className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">Failed to load component</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                {error || `The component "${name}" could not be found in the registry.`}
              </p>
            </div>
            <button
              onClick={handleRetry}
              className="mt-2 px-4 py-2 text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center gap-2"
            >
              <Icon icon="solar:restart-bold" className="w-3.5 h-3.5" />
              Try again
            </button>
          </div>
        </DemoContainer>
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full flex flex-col", className)} {...props}>
      <DemoContainer
        design={metadata?.design}
        padding="none"
        align={align}
        showDeviceToggle={showDeviceToggle}
      >
        <Component {...(metadata?.demo?.defaultProps || {})} />
      </DemoContainer>
    </div>
  );
}
