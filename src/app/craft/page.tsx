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
              className="flex items-center justify-center w-8 h-8 rounded-full border border-border/40 text-muted-foreground transition-all duration-300 outline-none"
            >
              <Icon icon="lucide:arrow-left" className="w-3.5 h-3.5" />
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
          <p className="text-base text-muted-foreground/50 leading-relaxed font-light tracking-tight w-full">
            A laboratory for refined components and motion experiments.
            Focused on the intersection of aesthetics and high-end interaction.
          </p>
        </div>
      </header>

      {/* Component List */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-border/25">
        {components.map((component, index) => (
          <Link
            key={component.id}
            href={`/craft/${component.id}`}
            className="group relative flex flex-col gap-4 p-5 border-b border-r border-border/25 outline-none"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col gap-1.5 relative z-10">
              <h3 className="text-[17px] font-medium text-foreground tracking-tight">
                {component.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
