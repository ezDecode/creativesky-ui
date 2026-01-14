"use client";

import * as React from "react";
import { resolveComponent } from "@/lib/registry/resolver";
import { DemoContainer } from "./DemoContainer";
import { PreviewDock } from "./PreviewDock";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  onOpenComponents?: () => void;
}

/**
 * ComponentPreview - Universal Component Renderer
 * 
 * Dynamically loads and renders any component from the registry.
 * Handles:
 * - Loading states with skeleton
 * - Error states with retry
 * - Scroll container references for scroll-based components
 * - Design tokens (surface, background, motion)
 */
export function ComponentPreview({
  name,
  className,
  onOpenComponents,
  ...props
}: ComponentPreviewProps) {
  const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(null);
  const [metadata, setMetadata] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [scrollContainer, setScrollContainer] = React.useState<HTMLDivElement | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);
  const [showCode, setShowCode] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

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

  const handleFullscreen = React.useCallback(() => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center bg-zinc-900 rounded-xl", className)} {...props}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin border-4 border-zinc-700 border-t-primary rounded-full" />
          <p className="text-sm text-zinc-500">Loading component...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !Component) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center bg-zinc-900 rounded-xl", className)} {...props}>
        <div className="flex flex-col items-center gap-4 text-center p-6">
          <div className="p-3 rounded-full bg-red-500/10 text-red-500">
            <Icon icon="solar:danger-triangle-bold" className="w-6 h-6" />
          </div>
            <div>
              <h3 className="text-sm font-medium text-white">Failed to load component</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs">{error}</p>
            </div>
            <button
              onClick={handleRetry}
              className="mt-2 px-4 py-2 text-xs font-normal bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >

            <Icon icon="solar:restart-bold" className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Extract demo config from metadata
  const demo = metadata?.demo || {};
  const isScrollable = demo.scrollable === true;
  const background = demo.background || "dark";
  const minHeight = demo.minHeight;

  return (
    <div ref={containerRef} className={cn("relative w-full h-full", className)} {...props}>
      <PreviewDock
        onFullscreen={handleFullscreen}
        onOpenComponents={onOpenComponents}
        onShowCode={() => setShowCode(!showCode)}
        showCode={showCode}
      />
      <DemoContainer
        design={metadata?.design}
        scrollable={isScrollable}
        background={background}
        minHeight={minHeight}
        onScrollContainerRef={handleScrollContainerRef}
        className="w-full h-full"
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
    </div>
  );
}
