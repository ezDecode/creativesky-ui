import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { getAllComponentsMetadata, resolveComponent, getComponentMetadata } from "@/lib/registry/resolver";
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

function getAdjacentComponents(slug: string, components: ReturnType<typeof getAllComponentsMetadata>) {
  const index = components.findIndex(c => c.id === slug);
  return {
    prev: index > 0 ? components[index - 1] : null,
    next: index < components.length - 1 ? components[index + 1] : null,
  };
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
  const dependencies = mdxContent?.frontmatter.dependencies || [];
  const description = mdxContent?.frontmatter.description || "";
  const { prev, next } = getAdjacentComponents(slug, components);

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Right Column: Sticky Preview */}
          <div className="relative lg:order-2 border-b lg:border-b-0 lg:border-l border-border/10">
            <div className="sticky top-0 h-[400px] lg:h-screen p-4">
              <ComponentPreview name={slug} />
            </div>
          </div>

          {/* Left Column: Docs Content */}
          <div className="lg:order-1 relative h-full lg:overflow-x-hidden lg:overflow-y-auto">
            {/* Top fade gradient */}
            <div 
              aria-hidden="true" 
              className="pointer-events-none absolute top-0 left-0 right-0 h-32 z-20"
              style={{
                background: "linear-gradient(to bottom, var(--background) 0%, var(--background) 25%, transparent 100%)"
              }}
            />
            
            {/* Bottom fade gradient */}
            <div 
              aria-hidden="true" 
              className="pointer-events-none sticky top-full w-full -translate-y-full z-20"
            >
              <div 
                className="h-24 w-full"
                style={{
                  background: "linear-gradient(to top, var(--background) 0%, var(--background) 25%, transparent 100%)"
                }}
              />
            </div>

            {/* Header breadcrumb */}
            <header className="sticky top-0 z-10">
              <div className="relative z-10 flex items-center gap-2 text-sm font-medium capitalize tracking-tight pt-16 lg:pt-10 px-6 lg:px-8">
                <Link href="/craft" className="text-foreground/50 hover:text-foreground transition-colors">
                  Components
                </Link>
                <span className="size-[3px] rounded-full bg-foreground/50" />
                <span className={`${pricing === "paid" ? "text-amber-500" : "text-foreground/50 hover:text-foreground"}`}>
                  {pricing === "paid" ? "Pro" : "Free"}
                </span>
                <span className="size-[3px] rounded-full bg-foreground/50" />
                <span className="text-foreground/50">{displayTitle}</span>
              </div>
            </header>

            {/* Main docs content */}
            <div className="my-[9vh] px-5 lg:px-8">
              {/* Title */}
              <h3 className="docs-h3">{displayTitle}</h3>
              
              {/* Description */}
              {description && (
                <p className="docs-p">{description}</p>
              )}

              {/* Dependencies */}
              {dependencies.length > 0 && (
                <>
                  <h3 className="docs-h3 flex items-center gap-2">Dependencies</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {dependencies.map((dep: string) => (
                      <a 
                        key={dep}
                        href={dep === "framer-motion" ? "https://motion.dev/" : `https://www.npmjs.com/package/${dep}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-muted hover:bg-muted-3 flex h-8 w-fit cursor-pointer items-center gap-2 rounded-xl px-3 text-xs transition-all duration-300"
                      >
                        {dep}
                        {dep === "framer-motion" && (
                          <Icon icon="simple-icons:framer" className="size-3" />
                        )}
                        {dep === "lucide-react" && (
                          <Icon icon="simple-icons:lucide" className="size-4" />
                        )}
                      </a>
                    ))}
                  </div>
                </>
              )}

              {/* Interaction hints */}
              <h3 className="docs-h3">Interaction</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-foreground/10 h-14 border-t tracking-tight last:border-b">
                    <td className="w-1/4">
                      <Icon icon="lucide:mouse-pointer-click" className="size-5" />
                    </td>
                    <td className="text-muted-foreground">Click on items to see transitions</td>
                  </tr>
                  <tr className="border-foreground/10 h-14 border-t tracking-tight last:border-b">
                    <td className="w-1/4">
                      <Icon icon="lucide:pointer" className="size-5" />
                    </td>
                    <td className="text-muted-foreground">Hover for additional effects</td>
                  </tr>
                </tbody>
              </table>

              {/* MDX Content */}
              <article className="docs-article">
                {mdxContent ? (
                  <mdxContent.Content components={{ ...getMDXComponents(), ComponentPreview: () => null, h1: () => null }} />
                ) : (
                  <p className="text-muted-foreground italic">No documentation available.</p>
                )}
              </article>

              {/* Source code hint */}
              <h3 className="docs-h3">Source code</h3>
              <p className="docs-p flex items-center gap-2 flex-wrap">
                Click on the top right 
                <span className="flex items-center justify-center bg-muted-3 size-8 rounded-2xl">
                  <Icon icon="lucide:code-2" className="size-4" />
                </span>
                to view the source code
              </p>

              {/* License */}
              <h3 className="docs-h3">License &amp; Usage</h3>
              <ul className="docs-ul">
                <li className="docs-li">Free to use and modify in both personal and commercial projects.</li>
                <li className="docs-li">Attribution to Skiper UI is appreciated but not required.</li>
              </ul>

              {/* Navigation */}
              <div className="relative z-10 mb-[5vh] mt-[15vh] flex flex-col">
                <hr className="border-foreground/10 mb-10" />
                <div className="flex justify-between">
                  {prev ? (
                    <Link href={`/craft/${prev.id}`} className="group">
                      <span className="text-foreground/50 hover:text-foreground/30 mb-2 flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-tight lg:text-[13px]">
                        <Icon icon="lucide:chevron-left" className="size-4 transition-all group-hover:-translate-x-px" />
                        Previous
                      </span>
                      <p className="hidden text-base tracking-tight xl:block">{prev.title}</p>
                    </Link>
                  ) : <div />}
                  {next ? (
                    <Link href={`/craft/${next.id}`} className="group text-right">
                      <span className="text-foreground/50 hover:text-foreground/30 mb-2 flex items-center justify-end gap-2 font-mono text-xs font-medium uppercase tracking-tight xl:text-[13px]">
                        Next
                        <Icon icon="lucide:chevron-right" className="size-4 transition-all group-hover:translate-x-px" />
                      </span>
                      <p className="hidden text-base tracking-tight xl:block">{next.title}</p>
                    </Link>
                  ) : <div />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
