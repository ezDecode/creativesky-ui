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
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          
          {/* Right Column: Sticky Preview */}
          <div className="relative lg:order-2 bg-zinc-50/50 dark:bg-zinc-900/10 border-l border-border/10">
            <div className="sticky top-0 h-[500px] lg:h-screen p-4 sm:p-8 lg:p-12">
              <div className="w-full h-full rounded-[2.5rem] border border-border/20 bg-background/50 shadow-2xl overflow-hidden backdrop-blur-sm">
                <ComponentPreview name={slug} />
              </div>
            </div>
          </div>

          {/* Left Column: Content */}
          <div className="px-6 py-12 lg:py-20 lg:px-24 lg:order-1 flex flex-col">
            {/* Header Group */}
            <header className="flex flex-col gap-10 mb-20">
              <div className="flex items-center gap-6">
                <Link 
                  href="/craft" 
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-300 group"
                >
                  <Icon icon="lucide:arrow-left" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                </Link>
                <CraftNavDrawer 
                  components={components} 
                  trigger={
                    <button className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/10 bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300 w-fit group">
                      <Icon icon="lucide:layout-grid" className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-[13px] font-medium tracking-tight">Library</span>
                    </button>
                  }
                />
              </div>

              <div className="flex flex-col gap-4">
                <nav className="flex items-center gap-2 text-[13px] uppercase tracking-[0.2em] text-muted-foreground/50 font-bold mb-2">
                  <Link href="/craft" className="hover:text-foreground transition-colors">Craft</Link>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span className="text-muted-foreground/80">{displayTitle}</span>
                </nav>
                <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.1] text-foreground">
                  {displayTitle}
                </h1>
                {mdxContent?.frontmatter.description && (
                  <p className="text-xl text-muted-foreground/60 leading-relaxed font-light tracking-tight max-w-xl">
                    {mdxContent.frontmatter.description}
                  </p>
                )}
              </div>
            </header>

            {/* Documentation Section */}
            <section className="flex-1">
              <article className="prose prose-zinc dark:prose-invert 
                prose-headings:font-medium prose-headings:tracking-tight 
                prose-h2:text-3xl prose-h2:mt-20 prose-h2:mb-8 
                prose-h3:text-xl prose-h3:mt-12 prose-h3:mb-4
                prose-p:text-[17px] prose-p:leading-relaxed prose-p:text-muted-foreground/80 prose-p:font-light
                prose-a:text-foreground prose-a:underline-offset-4 hover:prose-a:text-primary transition-colors
                prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-border/10 prose-pre:rounded-2xl prose-pre:p-6
                prose-code:text-foreground prose-code:font-mono prose-code:text-sm prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                max-w-none">
                {mdxContent ? (
                  <mdxContent.Content components={{ ...getMDXComponents(), ComponentPreview: () => null, h1: () => null }} />
                ) : (
                  <p className="text-muted-foreground italic">No documentation available.</p>
                )}
              </article>
            </section>

            {/* Footer Navigation */}
            <footer className="mt-32 pt-12 border-t border-border/10 flex items-center justify-between text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground/40 uppercase tracking-widest text-[10px] font-bold">Designer Notes</span>
                <p className="text-muted-foreground/60 font-light">Crafted with precision and motion.</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                  <span className="font-medium">Share Component</span>
                  <Icon icon="lucide:share-2" className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
