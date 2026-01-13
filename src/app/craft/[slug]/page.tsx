import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllComponentsMetadata, resolveComponent } from "@/lib/registry/resolver";
import { loadComponentMDX } from "@/lib/mdx/loader";
import { getMDXComponents } from "@/lib/mdx/components";
import { ComponentPreview } from "@/components/craft/ComponentPreview";
import { CraftNavDrawer } from "@/components/craft/CraftNavDrawer";
import { Icon } from "@iconify/react";

interface ComponentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const components = getAllComponentsMetadata();
  return components.map((component) => ({
    slug: component.id,
  }));
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { slug } = await params;
  const components = getAllComponentsMetadata();
  const resolved = await resolveComponent(slug).catch(() => null);

  if (!resolved) {
    notFound();
  }

  const mdxContent = await loadComponentMDX(slug);
  const displayTitle = mdxContent?.frontmatter.title || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative">
      {/* Decorative Background Element */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-(--breakpoint-2xl) mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Right Column: Sticky Preview - First in JSX for mobile top placement */}
          <div className="relative lg:order-2 border-l border-border/10">
            <div className="sticky top-0 h-[500px] lg:h-screen p-4 lg:p-8">
              <div className="w-full h-full rounded-3xl overflow-hidden border border-border/40 shadow-2xl bg-card/40 backdrop-blur-sm relative group">
                <ComponentPreview name={slug} className="w-full h-full" />
                
                {/* Overlay details */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border/40 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground shadow-sm">
                    Interactive Specimen
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column: Content */}
          <div className="px-6 py-8 lg:py-16 lg:px-20 lg:order-1 flex flex-col">
            {/* Header Group: Sidebar Trigger + Breadcrumbs */}
            <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/10 -mx-6 px-6 lg:-mx-20 lg:px-20 py-4 mb-12 flex items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                  <CraftNavDrawer 
                    components={components} 
                    trigger={
                      <button className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/40 bg-background/50 backdrop-blur-md text-muted-foreground hover:text-foreground hover:border-border transition-all w-fit group shadow-sm">
                        <Icon icon="lucide:layout-grid" className="w-4 h-4 transition-transform" />
                        <span className="text-sm font-medium tracking-tight">Explore Library</span>
                      </button>
                    }
                  />
                  
                    <nav className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
                      <Link href="/craft" className="hover:text-foreground transition-colors">Craft</Link>
                      <Icon icon="lucide:chevron-right" className="w-3.5 h-3.5 opacity-40" />
                      <span className="text-foreground font-semibold truncate max-w-[200px]">
                        {displayTitle}
                      </span>
                    </nav>
                </div>

                <Link 
                  href="/craft" 
                  className="group flex items-center justify-center w-9 h-9 rounded-full border border-border/40 bg-background/50 backdrop-blur-md hover:border-border transition-all duration-300"
                >
                  <Icon icon="lucide:x" className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              </header>

              {/* Documentation Section */}
              <div className="flex-1 max-w-2xl">
                  <div className="mb-12 space-y-4">
                    <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                      {displayTitle}
                    </h1>
                    <p className="text-base text-muted-foreground/80 font-normal leading-relaxed">
                      Exploring the principles of {displayTitle.toLowerCase()} through high-end interaction and motion design.
                    </p>
                  </div>

              <article className="prose prose-zinc dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-pre:bg-zinc-900/80 prose-pre:backdrop-blur-md prose-pre:border prose-pre:border-border/10 prose-h2:text-3xl prose-h2:mt-20 prose-h2:mb-8 prose-h3:text-xl prose-h3:mt-12 prose-p:my-6 prose-pre:my-10 prose-li:text-muted-foreground/90">
                {mdxContent ? (
                  <mdxContent.Content components={{ ...getMDXComponents(), ComponentPreview: () => null, h1: () => null }} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/10 rounded-3xl">
                      <Icon icon="lucide:file-text" className="w-10 h-10 text-muted-foreground/20 mb-4" />
                      <p className="text-muted-foreground/60 font-normal">Laboratory notes for this specimen are still being compiled.</p>
                    </div>
                )}
              </article>
            </div>

            {/* Footer */}
            <footer className="mt-20 pt-10 border-t border-border/10 text-sm text-muted-foreground/50 font-normal">
              <p>© 2026 Creative Sky • Refined UI Laboratory</p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
