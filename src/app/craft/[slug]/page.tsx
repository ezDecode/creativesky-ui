import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllComponentsMetadata, resolveComponent } from "@/lib/registry/resolver";
import { loadComponentMDX } from "@/lib/mdx/loader";
import { getMDXComponents } from "@/lib/mdx/components";
import { ComponentPreview } from "@/components/craft/ComponentPreview";
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

  const resolved = await resolveComponent(slug).catch(() => null);

  if (!resolved) {
    notFound();
  }

  const mdxContent = await loadComponentMDX(slug);
  const displayTitle = mdxContent?.frontmatter.title || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="max-w-[1400px] mx-auto px-6 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-16 lg:items-start">
          {/* Left Column: Content */}
          <div className="flex-1 min-w-0">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <Icon icon="lucide:chevron-right" className="w-3.5 h-3.5" />
              <Link href="/craft" className="hover:text-foreground transition-colors">Craft</Link>
              <Icon icon="lucide:chevron-right" className="w-3.5 h-3.5" />
              <span className="text-foreground font-normal">
                {displayTitle}
              </span>
            </nav>

            {/* Documentation Section */}
            <section className="max-w-none">
              <article className="prose prose-zinc dark:prose-invert prose-headings:font-medium prose-headings:tracking-tight prose-p:leading-relaxed prose-pre:bg-zinc-900/50 prose-pre:border prose-pre:border-white/5 prose-hr:border-white/5">
                {mdxContent ? (
                  <mdxContent.Content components={{ ...getMDXComponents(), ComponentPreview: () => null, h1: () => null }} />
                ) : (
                  <p className="text-muted-foreground italic">No documentation available.</p>
                )}
              </article>
            </section>
          </div>

          {/* Right Column: Sticky Preview */}
          <div className="lg:w-1/2 lg:sticky lg:top-12 lg:max-h-[calc(100vh-6rem)]">
            <div 
              className="group relative rounded-3xl border border-white/5 bg-zinc-900/50 overflow-hidden h-[450px] lg:h-[700px] shadow-2xl ring-1 ring-white/5"
            >
              <ComponentPreview name={slug} className="bg-transparent" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
