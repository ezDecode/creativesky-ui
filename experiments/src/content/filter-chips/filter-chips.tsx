"use client";

import React, { useCallback, useMemo } from "react";
import { motion, type Transition } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────── */

export interface FilterChip<T extends string = string> {
    value: T;
    label?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}

export interface FilterChipsProps<T extends string = string> {
    filters: readonly (T | FilterChip<T>)[];
    activeFilter: T;
    onFilterChange?: (filter: T) => void;
    baseHref?: string;
    queryParam?: string;
    allValue?: T;
    layoutId?: string;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "outline" | "ghost" | "pill";
    activeColor?: "default" | "primary" | "custom";
    customActiveColor?: string;
    customActiveTextColor?: string;
    gap?: "sm" | "md" | "lg";
    animation?: { stiffness?: number; damping?: number };
    className?: string;
    chipClassName?: string;
    asLinks?: boolean;
}

/* ─────────────────────────────────────────────────────────────────
   Styles
───────────────────────────────────────────────────────────────── */

const cn = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(" ");

const SIZE = { sm: "px-2.5 py-1 text-xs", md: "px-3 py-1.5 text-sm", lg: "px-4 py-2 text-base" };
const GAP = { sm: "gap-1", md: "gap-2", lg: "gap-3" };

const VARIANT = {
    default: { base: "rounded-lg", inactive: "bg-muted/40 hover:bg-muted/60", indicator: "rounded-lg" },
    outline: { base: "rounded-lg border", inactive: "border-border hover:border-foreground/30", indicator: "rounded-lg" },
    ghost: { base: "rounded-md", inactive: "hover:bg-muted/40", indicator: "rounded-md" },
    pill: { base: "rounded-full", inactive: "bg-muted/40 hover:bg-muted/60", indicator: "rounded-full" },
};

const COLOR = {
    default: { indicator: "bg-foreground", text: "text-background" },
    primary: { indicator: "bg-primary", text: "text-primary-foreground" },
    custom: { indicator: "", text: "" },
};

/* ─────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────── */

export function FilterChips<T extends string = string>({
    filters,
    activeFilter,
    onFilterChange,
    baseHref,
    queryParam = "type",
    allValue,
    layoutId = "activeFilterChip",
    size = "md",
    variant = "pill",
    activeColor = "default",
    customActiveColor,
    customActiveTextColor,
    gap = "md",
    animation = {},
    className,
    chipClassName,
    asLinks = false,
}: FilterChipsProps<T>) {
    const transition: Transition = useMemo(
        () => ({ type: "spring", stiffness: animation.stiffness ?? 500, damping: animation.damping ?? 35 }),
        [animation.stiffness, animation.damping]
    );

    const v = VARIANT[variant];
    const c = COLOR[activeColor];

    const getHref = useCallback(
        (val: T) => (!baseHref ? "#" : val === allValue ? baseHref : `${baseHref}?${queryParam}=${val}`),
        [baseHref, allValue, queryParam]
    );

    const handleClick = useCallback(
        (val: T, e: React.MouseEvent) => {
            if (!asLinks || !baseHref) e.preventDefault();
            onFilterChange?.(val);
        },
        [onFilterChange, asLinks, baseHref]
    );

    const renderChip = (filter: T | FilterChip<T>) => {
        const chip = typeof filter === "string" ? { value: filter, label: filter } : { ...filter, label: filter.label ?? filter.value };
        const isActive = chip.value === activeFilter;

        const props = {
            key: chip.value,
            className: cn(
                "relative inline-flex items-center gap-1.5 font-medium transition-colors",
                SIZE[size],
                v.base,
                isActive ? c.text : cn("text-muted-foreground hover:text-foreground", v.inactive),
                chip.disabled && "opacity-50 pointer-events-none",
                chipClassName
            ),
            onClick: (e: React.MouseEvent) => !chip.disabled && handleClick(chip.value as T, e),
            "aria-pressed": isActive,
        };

        const content = (
            <>
                {isActive && (
                    <motion.span
                        layoutId={layoutId}
                        className={cn("absolute inset-0", v.indicator, c.indicator)}
                        style={customActiveColor ? { background: customActiveColor } : undefined}
                        transition={transition}
                        initial={false}
                    />
                )}
                <span
                    className="relative z-10 inline-flex items-center gap-1.5"
                    style={isActive && customActiveTextColor ? { color: customActiveTextColor } : undefined}
                >
                    {chip.icon}
                    {chip.label}
                </span>
            </>
        );

        return asLinks && baseHref ? (
            <a href={getHref(chip.value as T)} {...props}>{content}</a>
        ) : (
            <button type="button" {...props}>{content}</button>
        );
    };

    return (
        <div className={cn("flex flex-wrap", GAP[gap], className)} role="group" aria-label="Filter options">
            {filters.map(renderChip)}
        </div>
    );
}

export default FilterChips;
