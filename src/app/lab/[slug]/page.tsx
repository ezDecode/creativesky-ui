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
    <>
      {/* LEFT COLUMN: Documentation */}
      <div className="col-span-12 lg:col-span-6 order-2 lg:order-1 flex flex-col">
        <div className="w-full ml-auto px-4 lg:px-8 py-10 lg:py-24">
          <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-lead:text-muted-foreground prose-img:rounded-xl">
            <header className="mb-8 not-prose">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-foreground bg-gradient-to-br from-foreground to-muted-foreground/60 bg-clip-text text-transparent">
                {metadata.title}
              </h1>
              <p className="text-xl text-muted-foreground/80 leading-relaxed max-w-2xl">
                {metadata.description}
              </p>
            </header>

            {mdxContent ? (
              <mdxContent.Content components={{ ...getMDXComponents(), ComponentPreview: () => null }} />
            ) : (
              <p className="text-muted-foreground italic">No documentation content available.</p>
            )}
          </article>
        </div>
      </div>

      {/* RIGHT COLUMN: Component Preview (Floating Box) */}
      <div className="col-span-12 lg:col-span-6 flex flex-col h-[50vh] lg:h-screen lg:sticky lg:top-0 order-1 lg:order-2 z-10">
        <div className="w-full h-full py-3 px-0 flex flex-col min-h-0">
          <ComponentPreview name={slug} className="h-full" />
        </div>
      </div>
    </>
  );
}
