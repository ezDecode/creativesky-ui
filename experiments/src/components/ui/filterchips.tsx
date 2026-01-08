"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FilterChipsProps<T extends string> {
  filters: readonly T[];
  activeFilter: T;
  baseHref: string;
}

export function FilterChips<T extends string>({
  filters,
  activeFilter,
  baseHref,
}: FilterChipsProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = filter === activeFilter;
        const href = filter === "All" ? baseHref : `${baseHref}?type=${filter}`;

        return (
          <Link
            key={filter}
            href={href}
            className={cn(
              "relative rounded-full px-3 py-1 text-xs transition-colors",
              isActive
                ? "text-background"
                : "bg-muted/40 text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="activeFilterChip"
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                }}
              />
            )}
            <span className="relative z-10">{filter}</span>
          </Link>
        );
      })}
    </div>
  );
}
