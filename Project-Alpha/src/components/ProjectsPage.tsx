import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Navbar from './Navbar';
import MagneticButton from './MagneticButton';

const techColors: Record<string, string> = {
  'Next.js': '#ac8181ff',
  'TypeScript': '#3178c6',
  'PostgreSQL': '#4169e1',
  'Prisma': '#496daaff',
  'React': '#61dafb',
  'React 19': '#61dafb',
  'Gemini 2.5': '#8e44ad',
  'IndexedDB': '#ff6b6b',
  'Node.js': '#68a063',
  'AWS SDK v3': '#ff9900',
  'CloudWatch': '#e74c3c'
};

const projects = [
  {
    name: "Component Library Platform",
    description:
      "My early focus was on building clean, reusable systems. I designed a full-stack component library with authentication, moderation workflows, and a normalized PostgreSQL schema to ensure data consistency under concurrent usage.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    image: "/assets/ProjectImages/dummy.jpg"
  },
  {
    name: "AnyLife — AI Visual Summarizer",
    description:
      "I moved into AI-driven interfaces by building a platform that transforms visual inputs into infographic summaries using Google Gemini models, while solving real browser constraints like storage limits and AI latency.",
    tech: ["React", "TypeScript", "Gemini 2.5", "IndexedDB"],
    image: "/assets/ProjectImages/dummy.jpg"
  },
  {
    name: "CloudCore — Serverless AWS S3 Manager",
    description:
      "My most systems-heavy work involved architecting a serverless file management system enabling secure, high-concurrency browser-to-cloud uploads with retry logic, monitoring, and strong consistency guarantees.",
    tech: ["React 19", "Node.js", "AWS SDK v3", "CloudWatch"],
    image: "/assets/ProjectImages/cloudcore.png"
  }
];

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();

  const fadeInUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen w-full">
      <Navbar isScrolled={true} />

      <div className="relative z-10 py-24">
        
        {/* PAGE HEADER — SAME VESSEL AS HERO */}
        <div className="w-full md:w-[80%] lg:w-[60%] mx-auto mb-20">
          <div className="px-[5%]">
            <motion.div initial="hidden" animate="visible" variants={fadeInUpVariants}>
              <h1
                className="text-white font-light mb-6"
                style={{
                  fontFamily: "var(--font-heading, 'Migra', sans-serif)",
                  fontWeight: 200,
                  lineHeight: '1.1',
                  letterSpacing: '-0.02em',
                  fontSize: 'clamp(2.5rem,6vw,5rem)'
                }}
              >
                Selected Work
              </h1>

              <p
                className="text-neutral-400"
                style={{
                  fontFamily: "var(--font-body, 'Saans', sans-serif)",
                  fontWeight: 300,
                  lineHeight: '1.7',
                  fontSize: 'clamp(1rem,1.2vw,1.3rem)'
                }}
              >
                A progression through foundations, intelligence, and systems — each project revealing deeper layers of engineering thinking.
              </p>
            </motion.div>
          </div>
        </div>

        {/* PROJECT LIST */}
        <div className="space-y-24">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUpVariants}
            >
              <div className="w-full md:w-[80%] lg:w-[60%] mx-auto">
                <div className="px-[5%]">

                  <div className="w-full mb-6 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-auto object-cover"
                      style={{ aspectRatio: '16/9' }}
                    />
                  </div>

                  <h2
                    className="text-white font-light mb-4"
                    style={{
                      fontFamily: "var(--font-heading, 'Migra', sans-serif)",
                      fontWeight: 200,
                      lineHeight: '1.2',
                      letterSpacing: '-0.01em',
                      fontSize: 'clamp(1.8rem,2.8vw,2.5rem)'
                    }}
                  >
                    {project.name}
                  </h2>

                  <p
                    className="text-neutral-300 mb-6"
                    style={{
                      fontFamily: "var(--font-body, 'Saans', sans-serif)",
                      fontWeight: 350,
                      lineHeight: '1.7',
                      fontSize: 'clamp(1rem,1.15vw,1.1rem)'
                    }}
                  >
                    {project.description}
                  </p>

                  <div className="flex flex-wrap">
                    {project.tech.map((tech, i) => (
                      <MagneticButton
                        key={i}
                        hoverVariant="dark"
                        customColor={techColors[tech] || '#6b7280'}
                        className="border border-white/30 rounded-none hover:rounded-full text-white/80"
                        style={{
                          fontSize: '1rem',
                          fontWeight: 450,
                          padding: '0.6rem 2rem',
                          fontFamily: "var(--font-body, 'Saans', sans-serif)",
                          transition: 'all 0.33s cubic-bezier(0.22, 1, 0.36, 1)'
                        }}
                      >
                        {tech}
                      </MagneticButton>
                    ))}
                  </div>

                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* BACK CTA — SAME VESSEL */}
        <div className="w-full md:w-[80%] lg:w-[60%] mx-auto mt-24">
          <div className="px-[5%]">
            <MagneticButton
              onClick={() => navigate('/')}
              hoverVariant="light"
              className="border border-white/30 rounded-none hover:rounded-full text-base text-white/80 px-8 py-4"
            >
              Back to Home
            </MagneticButton>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectsPage;
