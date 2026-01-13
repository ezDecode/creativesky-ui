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

  const { metadata } = resolved;
  const mdxContent = await loadComponentMDX(slug);

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Icon icon="lucide:chevron-right" className="w-3.5 h-3.5" />
          <Link href="/craft" className="hover:text-foreground transition-colors">Craft</Link>
          <Icon icon="lucide:chevron-right" className="w-3.5 h-3.5" />
          <span className="text-foreground font-normal">{metadata.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-3">
            {metadata.title}
          </h1>
          {metadata.description && (
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {metadata.description}
            </p>
          )}
        </header>

        {/* Preview Section */}
        <section className="mb-16">
          <div className="group relative rounded-2xl border border-white/5 bg-zinc-800/50 overflow-hidden aspect-video lg:aspect-[16/9] xl:aspect-[21/9]">
            <ComponentPreview name={slug} className="bg-transparent" />
          </div>
        </section>

        {/* Documentation Section */}
        <section className="max-w-none">
          <article className="prose prose-zinc dark:prose-invert prose-headings:font-medium prose-headings:tracking-tight prose-p:leading-relaxed prose-pre:bg-zinc-900/50 prose-pre:border prose-pre:border-white/5">
            {mdxContent ? (
              <mdxContent.Content components={{ ...getMDXComponents(), ComponentPreview: () => null, h1: () => null }} />
            ) : (
              <p className="text-muted-foreground italic">No documentation available.</p>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}
