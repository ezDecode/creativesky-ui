"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { Shell } from "@/components/layout/Shell";
import { MotionSurface } from "@/content/motion-surface/motion-surface";
import { getAllComponentsMetadata } from "@/lib/registry/resolver";

function pickRandom<T>(arr: T[], count: number) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
}

export default function Home() {
  const [components, setComponents] = React.useState<
    ReturnType<typeof getAllComponentsMetadata>
  >([]);

  React.useEffect(() => {
    setComponents(pickRandom(getAllComponentsMetadata(), 3));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Shell>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-16 sm:gap-20"
      >
        {/* ================= HERO ================= */}
        <motion.section variants={itemVariants} className="flex flex-col gap-6 sm:gap-8 tracking-normal">
          {/* Identity row */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Avatar */}
            <div className="shrink-0">
              <img
                src="/SiteImages/roundImageHeader.svg"
                alt="Zigato"
                className="rounded-md fill-white h-6 w-6 sm:h-6 sm:w-6 md:h-8 md:w-8"
              />
            </div>

            {/* Name + role */}
            <h1 className="flex flex-wrap items-baseline gap-2 sm:gap-3 text-page-heading font-normal leading-none tracking-normal">
              <span>Akash —</span>
              <span className="text-muted-foreground">
                Design Engineer 
              </span>
            </h1>
          </div>

          <p className="text-subheading font-medium text-foreground max-w-2xl">
            Designing with humans at the centre. Enter the <Link href="/lab" className="text-body-emphasis underline underline-offset-4">lab</Link> to explore the components.
          </p>

          <p className="max-w-2xl text-body leading-relaxed text-muted-foreground">
            I build systems that balance ambition with pragmatism. My work spans reusable foundations that scale, intelligent visual experiences that adapt, and cloud-native reliability that endures.{' '}
            <Link href="/vault" className="text-body-emphasis underline underline-offset-4">
              Explore projects
            </Link>
            , or{' '}
            <Link href="mailto:ezdecode@gmail.com" className="text-body-emphasis underline underline-offset-4">
              reach out
            </Link>.
          </p>
        </motion.section>

        {/* ================= LAB PREVIEW ================= */}
        <motion.section variants={itemVariants} className="flex flex-col gap-4 sm:gap-6">
          <h2 className="text-xs font-medium text-muted-foreground">Lab</h2>

          <MotionSurface>
            {components.map((component) => (
              <Link
                key={component.id}
                href={`/lab/${component.id}`}
                className="group block w-full rounded-md py-3 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm sm:text-base font-medium text-foreground">
                      {component.title}
                    </span>

                    {component.description && (
                      <span className="line-clamp-2 text-xs sm:text-sm text-muted-foreground">
                        {component.description}
                      </span>
                    )}
                  </div>

                  <Icon
                    icon="solar:arrow-right-linear"
                    className="h-4 w-4 shrink-0 text-muted-foreground/30"
                  />
                </div>
              </Link>
            ))}
          </MotionSurface>
        </motion.section>

        {/* ================= LAB CTA ================= */}
        <motion.section variants={itemVariants}>
          <Link
            href="/lab"
            className="inline-flex items-center gap-2 rounded-2xl bg-muted/40 px-3 py-1.5 text-xs sm:text-sm font-medium text-foreground/60 transition hover:bg-muted hover:text-foreground"
          >
            Visit Lab
            <Icon
              icon="solar:arrow-right-linear"
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.section>
      </motion.div>
    </Shell>
  );
}
