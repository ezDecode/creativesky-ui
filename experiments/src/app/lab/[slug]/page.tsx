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

  // If there's no MDX content, show a minimal fallback
  if (!mdxContent) {
    return (
      <article className="max-w-6xl mx-auto">
        <header className="flex flex-col gap-4 mb-16">
          <h1 className="text-3xl font-semibold leading-none tracking-tight text-foreground">
            {metadata.title}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
            {metadata.description}
          </p>
        </header>
        <p className="text-muted-foreground">No documentation available.</p>
      </article>
    );
  }

  return (
    <article className="max-w-6xl mx-auto">
      {/* 
        PURE MDX RENDERING
        
        The entire page content is controlled by the MDX file.
        
        MDX should include:
        - Title and description
        - Demo with <ComponentPreview />
        - Props tables
        - Installation instructions
        - Dependencies
        - Any other documentation
        
        The page component is just a container - MDX controls everything.
      */}
      <mdxContent.Content components={getMDXComponents()} />
    </article>
  );
}
