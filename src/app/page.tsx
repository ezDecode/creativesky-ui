import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { getAllComponentsMetadata } from "@/lib/registry/resolver";

function pickRandom<T>(arr: T[], count: number) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
}

export default function Home() {
  const allComponents = getAllComponentsMetadata();
  const featuredComponents = pickRandom(allComponents, 3);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-5xl px-6 pt-24 pb-20">
        <div className="flex flex-col gap-16 sm:gap-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-backwards">

          {/* ================= HERO ================= */}
          <section className="flex flex-col gap-8 sm:gap-10 tracking-normal">
            {/* Identity row */}
            <div className="flex items-center gap-4">
              <div className="shrink-0 relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                <img
                  src="/SiteImages/roundImageHeader.svg"
                  alt="Akash"
                  className="relative rounded-full h-12 w-12 sm:h-16 sm:w-16 border-2 border-background shadow-lg"
                />
              </div>

              <div className="flex flex-col">
                <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground bg-gradient-to-br from-foreground to-muted-foreground/60 bg-clip-text text-transparent pb-1">
                  Akash
                </h1>
                <span className="text-base sm:text-lg text-muted-foreground font-light">
                  Design Engineer
                </span>
              </div>
            </div>

            <div className="space-y-6 max-w-3xl">
              <p className="text-2xl sm:text-3xl font-light text-foreground leading-snug">
                Designing with humans at the centre. <br className="hidden sm:block" />
                  Enter the <Link href="/craft" className="group font-normal text-foreground underline decoration-muted-foreground/30 underline-offset-4 transition-all hover:decoration-primary hover:text-primary relative inline-flex items-center gap-1">
                    craft
                    <svg className="h-5 w-5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link> to explore the components.
                </p>

                <p className="text-xl sm:text-2xl text-muted-foreground/80 font-light leading-relaxed">
                  I build systems that balance ambition with pragmatism. My work spans reusable foundations that scale, intelligent visual experiences that adapt, and cloud-native reliability that endures.
                </p>

                <div className="flex items-center gap-6 pt-4">
                  <Link href="mailto:ezdecode@gmail.com" className="group flex items-center gap-2 text-sm font-normal text-foreground/80 transition-colors hover:text-foreground">
                    <span className="border-b border-muted-foreground/30 pb-0.5 transition-colors group-hover:border-foreground">Get in touch</span>
                  </Link>
                </div>
              </div>
            </section>

            {/* ================= FEATURED CRAFT ================= */}
            {featuredComponents.length > 0 && (
              <section className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                <div className="flex items-center justify-between border-b border-border/10 pb-4">
                  <h2 className="text-sm font-normal text-muted-foreground uppercase tracking-widest">Featured Experiments</h2>
                  <Link href="/craft" className="text-sm text-foreground/60 hover:text-foreground transition-colors flex items-center gap-1 group">
                    View all
                    <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredComponents.map((component) => (
                    <Link
                      key={component.id}
                      href={`/craft/${component.id}`}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/40 bg-zinc-50/50 dark:bg-zinc-900/20 p-6 transition-all hover:bg-muted/40 hover:border-border/80 hover:shadow-lg hover:-translate-y-1"
                    >
                      <div className="flex flex-col gap-3">
                        <h3 className="text-lg font-medium text-foreground">
                          {component.title}
                        </h3>
                        {component.description && (
                          <p className="text-[15px] text-muted-foreground/80 line-clamp-2 leading-relaxed">
                            {component.description}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 flex items-center justify-end opacity-0 transition-all group-hover:opacity-100">
                        <span className="text-xs font-normal text-primary flex items-center gap-1">
                          Explore
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}


          <Footer />
        </div>
      </div>
    </main>
  );
}
