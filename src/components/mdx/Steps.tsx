import { cn } from "@/lib/utils";
import React from "react";

export function Steps({ children, className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "mb-12 ml-4 border-l border-zinc-200 pl-8 [counter-reset:step] dark:border-zinc-800",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function Step({ title, children, className, ...props }: React.ComponentProps<"div"> & { title?: string }) {
    return (
        <div className={cn("relative pb-8 last:pb-0", className)} {...props}>
            <div className="absolute -left-[41px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-900 ring-4 ring-white dark:bg-zinc-800 dark:text-zinc-50 dark:ring-zinc-950/50">
                <span className="[counter-increment:step] content-[counter(step)]" />
            </div>
            {title && <h3 className="mb-2 text-lg font-semibold tracking-tight">{title}</h3>}
            <div className="text-muted-foreground">{children}</div>
        </div>
    );
}
