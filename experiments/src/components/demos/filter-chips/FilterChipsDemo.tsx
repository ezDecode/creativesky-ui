"use client";

import React, { useState } from "react";
import { FilterChips } from "@/content/filter-chips/filter-chips";

const FILTERS = ["All", "Design", "Development", "Marketing"] as const;

const FilterChipsDemo: React.FC = () => {
    const [active, setActive] = useState<string>("All");

    return (
        <div className="flex flex-col gap-8 w-full max-w-xl mx-auto p-6">
            {/* Default */}
            <section className="flex flex-col gap-3">
                <span className="text-xs text-muted-foreground">Default</span>
                <FilterChips
                    filters={FILTERS}
                    activeFilter={active}
                    onFilterChange={setActive}
                />
            </section>

            {/* Custom Gradient */}
            <section className="flex flex-col gap-3">
                <span className="text-xs text-muted-foreground">Custom Gradient</span>
                <FilterChips
                    filters={FILTERS}
                    activeFilter={active}
                    onFilterChange={setActive}
                    activeColor="custom"
                    customActiveColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    customActiveTextColor="#fff"
                    layoutId="gradient-chips"
                />
            </section>

            {/* Variants */}
            <section className="flex flex-col gap-3">
                <span className="text-xs text-muted-foreground">Outline Variant</span>
                <FilterChips
                    filters={FILTERS}
                    activeFilter={active}
                    onFilterChange={setActive}
                    variant="outline"
                    layoutId="outline-chips"
                />
            </section>
        </div>
    );
};

export default FilterChipsDemo;
