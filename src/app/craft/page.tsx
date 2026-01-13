import Link from "next/link";
import { getAllComponentsMetadata } from "@/lib/registry/resolver";
import { CraftNavDrawer } from "@/components/craft/CraftNavDrawer";
import { Icon } from "@iconify/react";

export default function CraftPage() {
  const components = getAllComponentsMetadata();

  return (
    <div className="mx-auto max-w-2xl px-6 w-full flex flex-col gap-20 py-24 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out fill-mode-backwards">

      {/* Header */}
      <header className="flex flex-col gap-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="flex items-center justify-center w-8 h-8 rounded-full border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-300 group outline-none"
            >
              <Icon icon="lucide:arrow-left" className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <CraftNavDrawer 
              components={components} 
              trigger={
                <button className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/10 bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all duration-300 w-fit group outline-none">
                  <Icon icon="lucide:layout-grid" className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium tracking-tight">Library</span>
                </button>
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-medium tracking-tight leading-tight text-foreground">
            Crafting the <span className="text-muted-foreground/30 font-serif">Future</span>.
          </h1>
          <p className="text-base text-muted-foreground/50 leading-relaxed font-light tracking-tight max-w-md">
            A laboratory for refined components and motion experiments.
            Focused on the intersection of aesthetics and high-end interaction.
          </p>
        </div>
      </header>

      {/* Component List */}
      <div className="flex flex-col border-t border-border/10">
        {components.map((component, index) => (
          <Link
            key={component.id}
            href={`/craft/${component.id}`}
            className="group relative flex items-center justify-between py-8 px-6 border border-transparent border-b-border/10 hover:border-border/40 hover:bg-muted/5 hover:rounded-2xl transition-all duration-300 -mx-6 outline-none"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col gap-1.5 relative z-10">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-muted-foreground/30 tabular-nums">
                  0{index + 1}
                </span>
                <h3 className="text-[17px] font-medium text-foreground tracking-tight transition-all duration-300 group-hover:translate-x-1">
                  {component.title}
                </h3>
              </div>
              {component.description && (
                <p className="text-[15px] text-muted-foreground/40 leading-relaxed font-light ml-7 max-w-md line-clamp-1 group-hover:text-muted-foreground/70 transition-colors">
                  {component.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[11px] font-bold text-muted-foreground/20 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                Explore
              </span>
              <div className="w-7 h-7 rounded-full border border-border/10 flex items-center justify-center text-muted-foreground/20 group-hover:text-foreground group-hover:border-border/40 transition-all duration-500">
                <Icon icon="lucide:chevron-right" className="w-3 h-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
