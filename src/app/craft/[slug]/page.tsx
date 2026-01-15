import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { getAllComponentsMetadata } from "@/lib/registry/resolver";
import { ComponentPreview } from "@/components/craft/ComponentPreview";
import { buildDocsPage } from "@/lib/docs/engine";
import { SectionRenderer } from "@/lib/docs/SectionRenderer";
// import { CopyCodeButton } from "@/components/craft/CopyCodeButton";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export const dynamic = 'force-dynamic';

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
        <div className="flex flex-col lg:grid lg:grid-cols-2">
          {/* Right Column: Sticky Preview */}
          <div className="relative border-b lg:border-b-0 lg:border-l border-border/10 z-40 lg:order-2">
            <div className="sticky top-0 h-dvh lg:h-screen p-2 md:p-3">
              <ComponentPreview 
                name={slug} 
              />
            </div>
          </div>

          {/* Left Column: Docs Content */}
          <div className="relative lg:order-1">
            <ProgressiveBlur position="top" height="120px" className="lg:w-1/2" />
            <ProgressiveBlur position="bottom" height="100px" className="lg:w-1/2" />
            
            {/* Header breadcrumb */}
            <header className="sticky top-0 z-80 px-5 lg:px-8 py-3">
              <div className="flex h-[46px] items-center gap-3">
                <Link href="/craft" className="hidden md:block text-foreground/50 hover:text-foreground transition-colors text-base font-medium">
                  Components
                </Link>
                <div className="hidden md:block size-1.5 rounded-full bg-primary/40" />
                <span className={`${pricing === "paid" ? "text-amber-500" : "text-foreground/50"} text-base font-medium`}>
                  {pricing === "paid" ? "Pro" : "Free"}
                </span>
                <div className="size-1.5 rounded-full bg-primary/40" />
                <span className="text-foreground/50 text-base font-medium truncate">{title}</span>
              </div>
            </header>

            {/* Main docs content */}
            <div className="mt-8 lg:mt-32 mb-[9vh] px-5 lg:px-8">
              <SectionRenderer config={config} />

              {/* Navigation */}
              <div className="relative z-10 mb-[10vh] mt-20 lg:mt-[20vh]">
                <div className="h-px w-full bg-linear-to-r from-transparent via-foreground/10 to-transparent mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prev ? (
                    <Link 
                      href={`/craft/${prev.id}`} 
                      className="group relative flex flex-col gap-2 rounded-2xl border border-border/5 bg-muted/30 p-6 transition-all hover:bg-muted/50 hover:border-border/10"
                    >
                      <span className="text-foreground/40 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider">
                        <Icon icon="lucide:arrow-left" className="size-3 transition-transform group-hover:-translate-x-1" />
                        Previous
                      </span>
                      <p className="text-sm font-medium tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">
                        {prev.title}
                      </p>
                    </Link>
                  ) : <div />}
                  
                  {next ? (
                    <Link 
                      href={`/craft/${next.id}`} 
                      className="group relative flex flex-col gap-2 rounded-2xl border border-border/5 bg-muted/30 p-6 text-right transition-all hover:bg-muted/50 hover:border-border/10"
                    >
                      <span className="text-foreground/40 flex items-center justify-end gap-1 font-mono text-[10px] uppercase tracking-wider">
                        Next
                        <Icon icon="lucide:arrow-right" className="size-3 transition-transform group-hover:translate-x-1" />
                      </span>
                      <p className="text-sm font-medium tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">
                        {next.title}
                      </p>
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
