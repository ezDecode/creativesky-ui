import Link from "next/link";
import { getAllComponentsMetadata } from "@/lib/registry/resolver";

export default function LabPage() {
  const components = getAllComponentsMetadata();

  return (
    <div className="flex flex-col gap-12 py-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-backwards p-4 sm:p-0">

      {/* Header */}
      <header className="flex flex-col gap-6 border-b border-border/10 pb-12">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground bg-gradient-to-br from-foreground to-muted-foreground/60 bg-clip-text text-transparent pb-1">
          Lab
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground/80 leading-relaxed max-w-2xl font-light">
          A minimalist laboratory for exploring refined UI components and experiments.
          Each piece is crafted with a focus on motion, aesthetics, and high-end
          interaction design principles.
        </p>
      </header>

      {/* Component Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {components.map((component, index) => (
          <Link
            key={component.id}
            href={`/lab/${component.id}`}
            className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-border/40 bg-zinc-50/50 dark:bg-zinc-900/20 p-6 sm:p-8 transition-all duration-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 hover:border-border/80 hover:shadow-xl hover:-translate-y-1"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Background Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/10 opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="flex flex-col gap-4 relative z-10 h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground/60 uppercase tracking-widest border border-border/20 px-2 py-1 rounded-md">
                  Experimental
                </span>
                <svg className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors transform group-hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>

              <h3 className="text-2xl font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
                {component.title}
              </h3>

              {component.description && (
                <p className="text-muted-foreground/80 leading-relaxed font-light line-clamp-3">
                  {component.description}
                </p>
              )}

              <div className="mt-auto pt-6 flex items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                View Details
                <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
