"use client";

import * as React from "react";
import { resolveComponent, getAllComponentsMetadata } from "@/lib/registry/resolver";
import { PreviewDock } from "./PreviewDock";
import { CraftNavDrawer } from "./CraftNavDrawer";
import { useCodePanel } from "@/app/craft/[slug]/CraftPageWrapper";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

interface ComponentPreviewProps {
  name: string;
  className?: string;
}

/**
 * ComponentPreview - Universal Component Renderer
 */
export function ComponentPreview({
  name,
  className,
}: ComponentPreviewProps) {
  const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(null);
  const [metadata, setMetadata] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [retryCount, setRetryCount] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Use context for code panel state (the overlay appears on the docs section)
  const { showCode, toggleCode } = useCodePanel();

  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const allComponents = React.useMemo(() => getAllComponentsMetadata(), []);

  // Load component
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

    return () => { mounted = false; };
  }, [name, retryCount]);

  // Close fullscreen on escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const handleRetry = () => setRetryCount(c => c + 1);
  const toggleFullscreen = () => setIsFullscreen(prev => !prev);

  // Extract demo config
  const demo = metadata?.demo || {};
  const isScrollable = demo.scrollable === true;
  const minHeight = demo.minHeight;

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          "w-full h-full flex items-center justify-center rounded-xl border border-border/10 bg-zinc-800",
          className
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin border-4 border-zinc-800 border-t-primary rounded-full" />
          <p className="text-sm text-muted-foreground">Loading component...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !Component) {
    return (
      <div
        className={cn(
          "w-full h-full flex items-center justify-center rounded-xl border border-border/10 bg-zinc-800",
          className
        )}
      >
        <div className="flex flex-col items-center gap-4 text-center p-6">
          <div className="p-3 rounded-full bg-red-500/10 text-red-500">
            <Icon icon="solar:danger-triangle-bold" className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">Failed to load component</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="mt-2 px-4 py-2 text-xs font-normal bg-zinc-800 hover:bg-zinc-700 text-foreground rounded-lg transition-colors flex items-center gap-2"
          >
            <Icon icon="solar:restart-bold" className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render content based on scrollable prop
  const renderContent = () => {
    const componentProps = {
      ...(demo.defaultProps || {}),
      ...(isScrollable ? { scrollContainerRef } : {}),
    };

    if (isScrollable) {
      return (
        <div
          ref={scrollContainerRef}
          className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-hide"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <ErrorBoundary componentName={name}>
            <Component {...componentProps} />
          </ErrorBoundary>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center w-full h-full">
        <ErrorBoundary componentName={name}>
          <Component {...componentProps} />
        </ErrorBoundary>
      </div>
    );
  };

  return (
    <>
      {/* Fullscreen Backdrop */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-xl"
            onClick={() => setIsFullscreen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Preview Container */}
      <motion.div
        layout
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={cn(
          "relative overflow-hidden bg-zinc-800",
          isFullscreen
            ? "fixed inset-3 z-50 rounded-2xl shadow-2xl border border-border/20"
            : "w-full h-full rounded-xl border border-border/10",
          !isFullscreen && className
        )}
        style={!isFullscreen && minHeight ? { minHeight } : undefined}
      >
        {/* Component Content */}
        {renderContent()}

        {/* Dock & Navigation */}
        <motion.div
          layout="position"
          className={cn(
            "absolute z-10 right-4 lg:right-6",
            isFullscreen
              ? "bottom-4 lg:top-6 lg:bottom-auto"
              : "bottom-4 lg:top-6 lg:bottom-auto"
          )}
        >
          <CraftNavDrawer
            components={allComponents}
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            trigger={null}
          />

          <PreviewDock
            onFullscreen={toggleFullscreen}
            onShowCode={toggleCode}
            onOpenComponents={() => setIsDrawerOpen(true)}
            showCode={showCode}
            isFullscreen={isFullscreen}
          />
        </motion.div>
      </motion.div>
    </>
  );
}
