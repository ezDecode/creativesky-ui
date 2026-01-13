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
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col items-center">
      <div className="w-full max-w-3xl px-6 py-24 flex flex-col gap-16">
        
        {/* Header */}
        <header className="flex flex-col gap-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link 
                  href="/craft" 
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-300 group outline-none"
                >
                <Icon icon="lucide:arrow-left" className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              </Link>
                    <CraftNavDrawer 
                      components={components} 
                        trigger={
                          <button className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/10 bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300 w-fit group outline-none">
                            <Icon icon="lucide:layout-grid" className="w-3 h-3 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-medium tracking-tight">Library</span>
                          </button>
                        }
                      />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground/30 font-bold mb-1">
                <Link href="/craft" className="hover:text-foreground transition-colors">Craft</Link>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/10" />
                <span className="text-muted-foreground/50">{displayTitle}</span>
              </nav>
              <h1 className="text-4xl font-medium tracking-tight leading-tight text-foreground">
                {displayTitle}
              </h1>
              {mdxContent?.frontmatter.description && (
                <p className="text-sm text-muted-foreground/50 leading-relaxed font-light tracking-tight max-w-md">
                  {mdxContent.frontmatter.description}
                </p>
              )}
            </div>
          </header>

          {/* Preview Area */}
          <div className="relative w-full aspect-video rounded-3xl border border-border/10 bg-zinc-50/50 dark:bg-zinc-900/10 overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center">
              <ComponentPreview name={slug} />
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm border border-border/10 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Live Preview
              </div>
            </div>
          </div>

          {/* Documentation Section */}
          <section className="w-full">
            <article className="prose prose-zinc dark:prose-invert 
              prose-headings:font-medium prose-headings:tracking-tight 
              prose-h2:text-lg prose-h2:mt-12 prose-h2:mb-4 
              prose-h3:text-md prose-h3:mt-8 prose-h3:mb-2
                prose-p:text-sm prose-p:leading-relaxed prose-p:text-muted-foreground/70 prose-p:font-light
              prose-a:text-foreground prose-a:underline-offset-4 hover:prose-a:text-primary transition-colors
              prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-border/10 prose-pre:rounded-xl prose-pre:p-4
              prose-code:text-foreground prose-code:font-mono prose-code:text-xs prose-code:bg-muted/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
              max-w-none">
              {mdxContent ? (
                <mdxContent.Content components={{ ...getMDXComponents(), ComponentPreview: () => null, h1: () => null }} />
              ) : (
                <p className="text-muted-foreground text-sm">No documentation available.</p>
              )}
            </article>
          </section>

          {/* Footer Navigation */}
          <footer className="mt-12 pt-8 border-t border-border/10 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground/20 uppercase tracking-[0.2em] text-[10px] font-bold">Notes</span>
              <p className="text-xs text-muted-foreground/40 font-light">Part of the creative sky experimental lab.</p>
            </div>
              <button className="flex items-center gap-2 text-muted-foreground/40 hover:text-foreground transition-colors group outline-none">
              <span className="text-xs font-medium">Share</span>
              <Icon icon="lucide:share-2" className="w-3 h-3 group-hover:scale-110 transition-transform" />
            </button>
          </footer>
      </div>
    </main>
  );
}
