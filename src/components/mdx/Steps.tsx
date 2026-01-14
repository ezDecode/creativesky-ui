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
            <div className="absolute -left-[41px] top-1 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-[13px] font-semibold text-zinc-900 ring-8 ring-background dark:bg-zinc-800 dark:text-zinc-50">
                <span className="before:content-[counter(step)] [counter-increment:step] flex items-center justify-center" />
            </div>
            {title && <h3 className="mb-2 text-lg font-medium tracking-tight text-foreground">{title}</h3>}
            <div className="text-muted-foreground text-[15px] leading-relaxed prose-code:bg-muted/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-foreground">
                {children}
            </div>
        </div>
    );
}
