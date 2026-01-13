import Link from "next/link";
import { getAllComponentsMetadata } from "@/lib/registry/resolver";
import { CraftNavDrawer } from "@/components/craft/CraftNavDrawer";
import { Icon } from "@iconify/react";

export default function CraftPage() {
  const components = getAllComponentsMetadata();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-12 sm:py-24">
        {/* Navigation & Header */}
        <header className="flex flex-col gap-16 mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-backwards">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all"
            >
              <Icon icon="lucide:arrow-left" className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="text-xs font-medium uppercase tracking-widest">Back to Studio</span>
            </Link>

            <CraftNavDrawer 
              components={components} 
              trigger={
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/40 bg-card/50 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-border transition-all group">
                  <Icon icon="lucide:layout-grid" className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold uppercase tracking-widest">Archive</span>
                </button>
              }
            />
          </div>

          <div className="space-y-8 max-w-3xl">
            <div className="space-y-4">
              <span className="text-xs font-medium text-primary uppercase tracking-[0.3em]">Design Laboratory</span>
              <h1 className="text-5xl sm:text-7xl font-semibold tracking-tighter text-foreground leading-[1.1]">
                The Craft <span className="text-muted-foreground/30 italic font-light">Index</span>
              </h1>
            </div>
            <p className="text-xl sm:text-2xl text-muted-foreground/80 leading-relaxed font-light">
              An evolving collection of digital artifacts, interface experiments, and functional prototypes focused on the intersection of motion and utility.
            </p>
          </div>
        </header>

        {/* Component Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {components.map((component, index) => (
            <Link
              key={component.id}
              href={`/craft/${component.id}`}
              className="group relative flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out fill-mode-backwards"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Preview Box / Visual Placeholder */}
              <div className="aspect-[16/10] w-full rounded-2xl border border-border/40 bg-muted/20 overflow-hidden relative transition-all duration-500 group-hover:border-border/80 group-hover:shadow-[0_0_40px_-15px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_0_40px_-15px_rgba(255,255,255,0.05)]">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Minimalist Decoration */}
                <div className="absolute top-6 left-6 flex gap-1.5 opacity-20">
                  <div className="w-1 h-1 rounded-full bg-foreground" />
                  <div className="w-1 h-1 rounded-full bg-foreground" />
                  <div className="w-1 h-1 rounded-full bg-foreground" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                   <div className="px-6 py-2.5 rounded-full border border-foreground/10 bg-background/90 backdrop-blur-md shadow-2xl">
                     <span className="text-xs font-semibold uppercase tracking-widest">Explore Artifact</span>
                   </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-4 px-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
                    Release v0.{index + 1}
                  </span>
                  <div className="h-[1px] flex-grow mx-4 bg-border/20" />
                  <Icon icon="lucide:arrow-up-right" className="w-4 h-4 text-muted-foreground/40 transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl font-medium tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                    {component.title}
                  </h3>
                  {component.description && (
                    <p className="text-lg text-muted-foreground/70 font-light leading-relaxed max-w-lg line-clamp-2">
                      {component.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-sm border border-border/40 text-muted-foreground/60 uppercase tracking-widest">React</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-sm border border-border/40 text-muted-foreground/60 uppercase tracking-widest">Framer Motion</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
