"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Icon } from "@iconify/react";

interface ErrorBoundaryProps {
    children: ReactNode;
    /** Optional fallback UI to render on error */
    fallback?: ReactNode;
    /** Optional callback when error is caught */
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    /** Component name for better error identification */
    componentName?: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary
 * 
 * Catches JavaScript errors anywhere in child component tree,
 * logs those errors, and displays a fallback UI.
 * 
 * Features:
 * - Graceful error handling without crashing the entire page
 * - Retry button to attempt recovery
 * - Optional Sentry integration (if NEXT_PUBLIC_SENTRY_DSN is set)
 * - Customizable fallback UI
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ errorInfo });

        // Log to console
        console.error(
            `[ErrorBoundary] Error in ${this.props.componentName || 'component'}:`,
            error,
            errorInfo
        );

        // Call optional error handler
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Send to Sentry if configured
        if (typeof window !== 'undefined' && (window as any).Sentry) {
            (window as any).Sentry.captureException(error, {
                extra: {
                    componentStack: errorInfo.componentStack,
                    componentName: this.props.componentName,
                },
            });
        }
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-muted/30 rounded-xl border border-border/10">
                    <div className="flex flex-col items-center gap-4 text-center max-w-md">
                        {/* Error Icon */}
                        <div className="p-3 rounded-full bg-red-500/10 text-red-500">
                            <Icon icon="solar:danger-triangle-bold" className="w-6 h-6" />
                        </div>

                        {/* Error Message */}
                        <div className="space-y-1">
                            <h3 className="text-sm font-medium text-foreground">
                                Something went wrong
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                {this.props.componentName
                                    ? `Failed to render ${this.props.componentName}`
                                    : "This component encountered an error"}
                            </p>
                        </div>

                        {/* Error Details (dev only) */}
                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <details className="w-full text-left">
                                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                                    Show error details
                                </summary>
                                <pre className="mt-2 p-3 bg-zinc-950 text-red-400 text-xs rounded-lg overflow-auto max-h-32">
                                    {this.state.error.message}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        {/* Retry Button */}
                        <button
                            onClick={this.handleRetry}
                            className="mt-2 px-4 py-2 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Icon icon="solar:restart-bold" className="w-3.5 h-3.5" />
                            Try again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * withErrorBoundary HOC
 * 
 * Wraps a component with an ErrorBoundary for easier usage.
 */
export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    componentName?: string
): React.FC<P> {
    const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';

    const WithErrorBoundary: React.FC<P> = (props) => (
        <ErrorBoundary componentName={displayName}>
            <WrappedComponent {...props} />
        </ErrorBoundary>
    );

    WithErrorBoundary.displayName = `WithErrorBoundary(${displayName})`;
    return WithErrorBoundary;
}
