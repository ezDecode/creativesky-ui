import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllComponentsMetadata, resolveComponent, getComponentMetadata } from "@/lib/registry/resolver";
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

  const metadata = getComponentMetadata(slug);
  const mdxContent = await loadComponentMDX(slug);
  const displayTitle = mdxContent?.frontmatter.title || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const pricing = metadata?.pricing || "free";

    return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Right Column: Sticky Preview - First in JSX for mobile top placement */}
          <div className="relative lg:order-2 border-b lg:border-b-0 lg:border-l border-border/10">
            <div className="sticky top-0 h-[400px] lg:h-screen p-4">
              <ComponentPreview name={slug} />
            </div>
          </div>

          {/* Left Column: Content */}
          <div className="lg:order-1">
            {/* Header: Icon button + Title path */}
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 px-6 lg:px-16 border-b border-border/5 flex items-center gap-4">
              <CraftNavDrawer 
                components={components} 
                trigger={
                  <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border/10 bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all group shrink-0">
                    <Icon icon="lucide:layout-grid" className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                }
              />
              
              <div className="flex items-center gap-2 text-sm overflow-hidden">
                <Link href="/craft" className="text-muted-foreground hover:text-foreground transition-colors shrink-0 font-medium">Craft</Link>
                <span className="text-muted-foreground/40">·</span>
                <span className={`shrink-0 capitalize ${pricing === "paid" ? "text-amber-500" : "text-emerald-500"}`}>
                  {pricing}
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-foreground font-medium truncate">
                  {displayTitle}
                </span>
              </div>
            </header>

            <div className="px-6 py-10 lg:px-16">
              {/* Documentation Section */}
              <section className="max-w-2xl mx-auto lg:mx-0">
                <article className="prose prose-zinc dark:prose-invert prose-headings:font-medium prose-headings:tracking-tight prose-p:leading-relaxed prose-pre:bg-zinc-900/50 prose-h2:mt-24 prose-h2:mb-8 prose-h3:mt-16 prose-p:my-8 prose-pre:my-12">
                  {mdxContent ? (
                    <mdxContent.Content components={{ ...getMDXComponents(), ComponentPreview: () => null, h1: () => null }} />
                  ) : (
                    <p className="text-muted-foreground italic">No documentation available.</p>
                  )}
                </article>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
