import { notFound } from "next/navigation";
import { getAllComponentsMetadata, resolveComponent } from "@/lib/registry/resolver";
import { loadComponentMDX } from "@/lib/mdx/loader";
import { getMDXComponents } from "@/lib/mdx/components";
import { ComponentPreview } from "@/components/craft/ComponentPreview";

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
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* LEFT COLUMN: Documentation - scrolls with page */}
      <div className="order-2 lg:order-1 bg-background bg-zinc-950">
        <div className="p-8 lg:p-12 xl:p-16">
          <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight">
            <header className="mb-8 not-prose">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 bg-linear-to-br from-foreground to-muted-foreground/60 bg-clip-text text-transparent">
                {metadata.title}
              </h1>
            </header>

            {mdxContent ? (
              <mdxContent.Content components={{ ...getMDXComponents(), ComponentPreview: () => null, h1: () => null }} />
            ) : (
              <p className="text-muted-foreground italic">No documentation available.</p>
            )}
          </article>
        </div>
      </div>

      {/* RIGHT COLUMN: Component Preview - fixed height with internal scroll */}
      <div className="order-1 lg:order-2 h-[70vh] lg:h-screen lg:sticky lg:top-0 bg-zinc-950 p-1 lg:p-2">
        <div className="w-full h-full rounded-2xl bg-zinc-800/50 overflow-hidden">
          <ComponentPreview name={slug} className="bg-transparent" />
        </div>
      </div>
    </div>
  );
}
