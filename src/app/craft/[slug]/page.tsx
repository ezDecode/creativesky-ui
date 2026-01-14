import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { getAllComponentsMetadata } from "@/lib/registry/resolver";
import { ComponentPreview } from "@/components/craft/ComponentPreview";
import { buildDocsPage } from "@/lib/docs/engine";
import { SectionRenderer } from "@/lib/docs/SectionRenderer";

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
  
  let config;
  try {
    config = await buildDocsPage(slug);
  } catch (e) {
    notFound();
  }

  const { title, pricing, prev, next } = config;

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
                <span className="text-foreground/50">{title}</span>
              </div>
            </header>

            {/* Main docs content */}
            <div className="my-[9vh] px-5 lg:px-8">
              <SectionRenderer config={config} />

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
