import { notFound } from "next/navigation";
import { getAllComponentsMetadata, resolveComponent } from "@/lib/registry/resolver";
import { loadComponentMDX } from "@/lib/mdx/loader";
import { getMDXComponents } from "@/lib/mdx/components";

interface ComponentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const components = getAllComponentsMetadata();
  return components.map((component) => ({
    slug: component.id,
  }));
}

import { ComponentPreview } from "@/components/lab/ComponentPreview";

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { slug } = await params;

  // Resolve component with better error handling
  const resolved = await resolveComponent(slug).catch(() => null);

  if (!resolved) {
    notFound();
  }

  const { metadata } = resolved;

  // Load and compile MDX content if available
  const mdxContent = await loadComponentMDX(slug);

  return (
    <div className="grid grid-cols-12 lg:min-h-screen">
      {/* LEFT COLUMN: Documentation */}
      <div className="col-span-12 lg:col-span-6 order-2 lg:order-1 flex flex-col min-h-screen bg-background dark:bg-black animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-backwards border-r border-border/10">
        <div className="w-full h-full flex flex-col p-8 lg:p-12 xl:p-16">
          <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-lead:text-muted-foreground prose-img:rounded-xl">
            <header className="mb-8 not-prose">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-4 text-foreground bg-gradient-to-br from-foreground to-muted-foreground/60 bg-clip-text text-transparent pb-1">
                {metadata.title}
              </h1>
              <p className="text-xl text-muted-foreground/80 leading-relaxed font-light">
                {metadata.description}
              </p>
            </header>

            {mdxContent ? (
              <mdxContent.Content components={{ ...getMDXComponents(), ComponentPreview: () => null, h1: () => null }} />
            ) : (
              <p className="text-muted-foreground italic">No documentation content available.</p>
            )}
          </article>
        </div>
      </div>

      {/* RIGHT COLUMN: Component Preview (Fixed) */}
      <div className="col-span-12 lg:col-span-6 flex flex-col h-[60vh] lg:h-screen lg:sticky lg:top-0 self-start order-1 lg:order-2 z-10 bg-zinc-50/50 dark:bg-black backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 ease-out fill-mode-backwards">
        <div className="w-full h-full flex flex-col min-h-0 relative p-1 lg:p-2">
          <ComponentPreview name={slug} className="h-full w-full rounded-2xl border border-border/10 shadow-sm" />
        </div>
      </div>
    </div>
  );
}
