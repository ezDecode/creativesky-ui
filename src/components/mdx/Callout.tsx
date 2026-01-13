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
                "my-6 flex flex-col gap-2 rounded-xl border p-4 text-sm shadow-sm transition-all hover:shadow-md",
                {
                    "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50": type === "default",
                    "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/30 dark:bg-blue-950/20 dark:text-blue-200": type === "info",
                    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-200": type === "warning",
                    "border-red-200 bg-red-50 text-red-900 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-200": type === "error",
                    "border-green-200 bg-green-50 text-green-900 dark:border-green-900/30 dark:bg-green-950/20 dark:text-green-200": type === "success",
                },
                className
            )}
            {...props}
        >
            {title && (
                <div className="flex items-center gap-2 font-semibold">
                    {type === "info" && <InfoIcon className="h-4 w-4" />}
                    {type === "warning" && <AlertTriangleIcon className="h-4 w-4" />}
                    {type === "error" && <AlertCircleIcon className="h-4 w-4" />}
                    {type === "success" && <CheckCircleIcon className="h-4 w-4" />}
                    {type === "default" && <InfoIcon className="h-4 w-4" />}
                    <span>{title}</span>
                </div>
            )}
            <div className={cn("overflow-hidden", title && "text-muted-foreground/90")}>
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
