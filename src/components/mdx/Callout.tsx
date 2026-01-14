import { cn } from "@/lib/utils";
import React from "react";

interface CalloutProps {
    icon?: string;
    title?: string;
    children?: React.ReactNode;
    type?: "default" | "info" | "warning" | "error" | "success";
    className?: string;
}

export function Callout({
    children,
    title,
    type = "default",
    className,
    ...props
}: CalloutProps) {
    return (
        <div
            className={cn(
                "my-6 flex flex-col gap-2 rounded-2xl border p-5 text-[14px] leading-relaxed transition-all shadow-glass backdrop-blur-[6px]",
                {
                    "border-foreground/10": type === "default",
                    "border-blue-500/20 bg-blue-500/5 text-blue-900 dark:text-blue-200": type === "info",
                    "border-amber-500/20 bg-amber-500/5 text-amber-900 dark:text-amber-200": type === "warning",
                    "border-red-500/20 bg-red-500/5 text-red-900 dark:text-red-200": type === "error",
                    "border-green-500/20 bg-green-500/5 text-green-900 dark:text-green-200": type === "success",
                },
                className
            )}
            {...props}
        >
            {title && (
                <div className="flex items-center gap-2.5 font-semibold tracking-tight text-foreground/90">
                    <div className={cn("rounded-lg p-1", {
                        "bg-foreground/5": type === "default",
                        "bg-blue-500/10": type === "info",
                        "bg-amber-500/10": type === "warning",
                        "bg-red-500/10": type === "error",
                        "bg-green-500/10": type === "success",
                    })}>
                        {type === "info" && <InfoIcon className="h-3.5 w-3.5" />}
                        {type === "warning" && <AlertTriangleIcon className="h-3.5 w-3.5" />}
                        {type === "error" && <AlertCircleIcon className="h-3.5 w-3.5" />}
                        {type === "success" && <CheckCircleIcon className="h-3.5 w-3.5" />}
                        {type === "default" && <InfoIcon className="h-3.5 w-3.5" />}
                    </div>
                    <span>{title}</span>
                </div>
            )}
            <div className={cn("overflow-hidden", title ? "text-foreground/70" : "text-foreground/80")}>
                {children}
            </div>
        </div>
    );
}

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    )
}

function AlertTriangleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </svg>
    )
}

function AlertCircleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
    )
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
