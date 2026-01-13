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
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-4rem)]">
          {/* Left Column: Content */}
          <div className="px-6 py-6 lg:py-10 lg:px-16">
            {/* Breadcrumbs */}
            <nav className="sticky top-0 z-20 flex items-center gap-2 text-sm text-muted-foreground mb-12 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <Icon icon="lucide:chevron-right" className="w-3.5 h-3.5" />
              <Link href="/craft" className="hover:text-foreground transition-colors">Craft</Link>
              <Icon icon="lucide:chevron-right" className="w-3.5 h-3.5" />
              <span className="text-foreground font-normal">
                {displayTitle}
              </span>
            </nav>

            {/* Documentation Section */}
            <section className="max-w-2xl mx-auto lg:mx-0">
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
          <div className="relative bg-zinc-900/20">
            <div className="sticky top-0 h-[500px] lg:h-screen p-2">
              <ComponentPreview name={slug} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
