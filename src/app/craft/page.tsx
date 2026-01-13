"use client";

import Link from "next/link";
import { getAllComponentsMetadata } from "@/lib/registry/resolver";
import { CraftNavDrawer } from "@/components/craft/CraftNavDrawer";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export default function CraftPage() {
  const components = getAllComponentsMetadata();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } },
  };

  return (
    <div className="relative min-h-screen">
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[5%] right-[-5%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 w-full flex flex-col gap-16 py-12 sm:py-20">
        
        {/* Header */}
        <header className="flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link 
                href="/" 
                className="group flex items-center justify-center w-10 h-10 rounded-full border border-border/40 bg-background/50 backdrop-blur-md hover:border-border transition-all duration-300"
              >
                <Icon icon="lucide:arrow-left" className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
              <CraftNavDrawer 
                components={components} 
                trigger={
                  <button className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/40 bg-background/50 backdrop-blur-md text-muted-foreground hover:text-foreground hover:border-border transition-all w-fit group shadow-sm">
                    <Icon icon="lucide:layout-grid" className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium tracking-tight">Explore Library</span>
                  </button>
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="text-5xl sm:text-6xl font-semibold tracking-tight bg-linear-to-br from-foreground via-foreground to-muted-foreground/40 bg-clip-text text-transparent"
            >
              Craft
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="text-lg sm:text-xl text-muted-foreground/90 leading-relaxed max-w-2xl font-light"
            >
              A minimalist laboratory for exploring refined UI components and experiments.
              Each piece is crafted with a focus on motion, aesthetics, and high-end
              interaction design principles.
            </motion.p>
          </div>
        </header>

        {/* Component Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {components.map((component) => (
            <motion.div key={component.id} variants={itemVariants}>
                <Link
                  href={`/craft/${component.id}`}
                  className="group relative flex flex-col h-full min-h-[320px] overflow-hidden rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xs p-8 transition-all duration-500 hover:bg-card/60 hover:border-border/80 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]"
                >
                {/* Subtle Glow Effect */}
                <div className="absolute -inset-px bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                <div className="flex flex-col gap-6 relative z-10 h-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] bg-muted/30 px-2.5 py-1 rounded-full border border-border/10">
                      Experimental
                    </span>
                    <div className="w-8 h-8 rounded-full border border-border/20 flex items-center justify-center bg-background/50 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <Icon icon="lucide:arrow-up-right" className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
                      {component.title}
                    </h3>

                    {component.description && (
                      <p className="text-muted-foreground/70 leading-relaxed font-light line-clamp-3 text-base">
                        {component.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto pt-8 flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-all duration-300">
                    <span>View Details</span>
                    <Icon icon="lucide:chevron-right" className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
