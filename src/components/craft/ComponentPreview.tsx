"use client";

import * as React from "react";
import { resolveComponent } from "@/lib/registry/resolver";
import { DemoContainer } from "./DemoContainer";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
}

export function ComponentPreview({
  name,
  className,
  ...props
}: ComponentPreviewProps) {
  const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(null);
  const [metadata, setMetadata] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [scrollContainer, setScrollContainer] = React.useState<HTMLDivElement | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);
  
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  const handleScrollContainerRef = React.useCallback((ref: HTMLDivElement | null) => {
    scrollContainerRef.current = ref;
    setScrollContainer(ref);
  }, []);

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

  const handleRetry = () => setRetryCount(c => c + 1);

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center bg-zinc-950 rounded-2xl", className)} {...props}>
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-12 w-12 border-2 border-primary/20 rounded-full" />
            <div className="absolute top-0 left-0 h-12 w-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-light tracking-widest text-zinc-500 uppercase">Initializing Specimen</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !Component) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center bg-zinc-950 rounded-2xl", className)} {...props}>
        <div className="flex flex-col items-center gap-6 text-center p-8">
          <div className="p-4 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
            <Icon icon="solar:danger-triangle-bold" className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white tracking-tight">Component Encountered an Error</h3>
            <p className="text-sm text-zinc-500 font-light max-w-xs">{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="group mt-4 px-6 py-2.5 text-sm font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <Icon icon="solar:restart-bold" className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Restart Process
          </button>
        </div>
      </div>
    );
  }

  const demo = metadata?.demo || {};
  const isScrollable = demo.scrollable === true;
  const background = demo.background || "dark";
  const minHeight = demo.minHeight;

  return (
    <DemoContainer
      design={metadata?.design}
      scrollable={isScrollable}
      background={background}
      minHeight={minHeight}
      onScrollContainerRef={handleScrollContainerRef}
      className={className}
      {...props}
    >
      {isScrollable ? (
        scrollContainer && (
          <Component
            {...(demo.defaultProps || {})}
            scrollContainerRef={scrollContainerRef}
          />
        )
      ) : (
        <Component {...(demo.defaultProps || {})} />
      )}
    </DemoContainer>
  );
}
