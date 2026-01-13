import Link from "next/link";
import { getAllComponentsMetadata } from "@/lib/registry/resolver";
import { CraftNavDrawer } from "@/components/craft/CraftNavDrawer";
import { Icon } from "@iconify/react";

export default function CraftPage() {
  const components = getAllComponentsMetadata();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-16 py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out fill-mode-backwards sm:p-0">

      {/* Header */}
      <header className="flex flex-col gap-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="flex items-center justify-center w-10 h-10 rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-300 group"
            >
              <Icon icon="lucide:arrow-left" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <CraftNavDrawer 
              components={components} 
              trigger={
                <button className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/10 bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-300 w-fit group">
                  <Icon icon="lucide:layout-grid" className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-[13px] font-medium tracking-tight">Browse Library</span>
                </button>
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-8 max-w-3xl">
          <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.1] text-foreground">
            Crafting the <span className="text-muted-foreground/40 italic font-serif">Future</span> of UI.
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground/70 leading-relaxed font-light tracking-tight">
            A specialized laboratory for exploring refined components and motion experiments.
            Focused on the intersection of aesthetics and high-end interaction design.
          </p>
        </div>
      </header>

      {/* Component Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {components.map((component, index) => (
          <Link
            key={component.id}
            href={`/craft/${component.id}`}
            className="group relative flex flex-col h-full overflow-hidden rounded-[2rem] border border-border/40 bg-zinc-50/30 dark:bg-zinc-900/10 p-8 sm:p-10 transition-all duration-500 hover:bg-white dark:hover:bg-zinc-900/40 hover:border-border/80 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-2 dark:hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)]"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Subtle Gradient Glow */}
            <div className="absolute -inset-px bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="flex flex-col gap-6 relative z-10 h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
                  <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">
                    v1.0.0
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full border border-border/10 flex items-center justify-center text-muted-foreground/30 group-hover:text-primary group-hover:border-primary/20 transition-all duration-500 transform group-hover:rotate-45">
                  <Icon icon="lucide:arrow-up-right" className="w-5 h-5" />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-3xl font-medium text-foreground tracking-tight group-hover:tracking-normal transition-all duration-500">
                  {component.title}
                </h3>
                {component.description && (
                  <p className="text-base sm:text-lg text-muted-foreground/60 leading-relaxed font-light line-clamp-2">
                    {component.description}
                  </p>
                )}
              </div>

              <div className="mt-auto pt-10 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                <span>View Experiment</span>
                <div className="h-px flex-1 bg-border/20 group-hover:bg-foreground/20 transition-all duration-500" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
