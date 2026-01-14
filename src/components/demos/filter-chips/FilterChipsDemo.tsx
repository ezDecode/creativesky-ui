"use client";

import React, { useState } from "react";
import { FilterChips } from "@/content/filter-chips/FilterChips";

const FILTERS = ["All", "Design", "Development", "Marketing"] as const;

const FilterChipsDemo: React.FC = () => {
    const [active, setActive] = useState<string>("All");

    return (
        <div className="flex flex-col gap-8 w-full max-w-xl mx-auto p-6">
            {/* Default */}
            <section className="flex flex-col gap-3">
                <FilterChips
                    filters={FILTERS}
                    activeFilter={active}
                    onFilterChange={setActive}
                />
            </section>
        </div>
    );
};

export default FilterChipsDemo;
