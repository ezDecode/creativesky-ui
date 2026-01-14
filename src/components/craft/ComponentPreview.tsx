"use client";

import * as React from "react";
import { resolveComponent, getAllComponentsMetadata } from "@/lib/registry/resolver";
import { DemoContainer } from "./DemoContainer";
import { PreviewDock } from "./PreviewDock";
import { CraftNavDrawer } from "./CraftNavDrawer";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

import { motion, AnimatePresence } from "framer-motion";

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
}

/**
 * ComponentPreview - Universal Component Renderer
 */
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
  const [showCode, setShowCode] = React.useState(false);
  const [isInternalFullscreen, setIsInternalFullscreen] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const allComponents = React.useMemo(() => getAllComponentsMetadata(), []);

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

  const toggleFullscreen = React.useCallback(() => {
    setIsInternalFullscreen(prev => !prev);
    setScrollContainer(null);
  }, []);

  // Close fullscreen on escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isInternalFullscreen) {
        setIsInternalFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isInternalFullscreen]);

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
    <div 
      ref={containerRef} 
      className={cn(
        "relative w-full h-full",
        !isInternalFullscreen && className
      )} 
      {...props}
    >
      <AnimatePresence>
        {isInternalFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-xl"
            onClick={() => setIsInternalFullscreen(false)}
          />
        )}
      </AnimatePresence>

        <div className={cn(
          isInternalFullscreen ? "fixed right-10 top-10 z-[110]" : "absolute right-6 top-6 z-[110]"
        )}>
        <CraftNavDrawer
          components={allComponents}
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          trigger={null}
        />
        
        <PreviewDock
          onFullscreen={toggleFullscreen}
          onShowCode={() => setShowCode(!showCode)}
          onOpenComponents={() => setIsDrawerOpen(true)}
          showCode={showCode}
          isFullscreen={isInternalFullscreen}
        />
      </div>

          <motion.div 
            layout
            transition={{ 
              type: "spring", 
              damping: 30, 
              stiffness: 300
            }}
            className={cn(
              "relative rounded-xl overflow-hidden",
              isInternalFullscreen 
                ? "fixed inset-4 z-[101] bg-muted shadow-2xl border border-border/50 flex items-center justify-center" 
                : "w-full h-full bg-muted/50"
            )}
          >
          {isInternalFullscreen ? (
            isScrollable ? (
              <div
                ref={handleScrollContainerRef}
                className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-hide"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
                >
                    {scrollContainer && (
                      <Component
                        key={isInternalFullscreen ? "fullscreen" : "normal"}
                        {...(demo.defaultProps || {})}
                        scrollContainerRef={scrollContainerRef}
                      />
                    )}
                </div>
            ) : (
              <Component {...(demo.defaultProps || {})} />
            )
          ) : (
            <DemoContainer
              design={metadata?.design}
              scrollable={isScrollable}
              background="transparent"
              minHeight={minHeight}
              onScrollContainerRef={handleScrollContainerRef}
              className="w-full h-full border-none shadow-none ring-0"
              isFullscreen={isInternalFullscreen}
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
          )}
        </motion.div>
    </div>
  );
}
