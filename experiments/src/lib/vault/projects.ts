// src/lib/vault/projects.ts
// Static project data for the vault

export interface Project {
    id: string;
    title: string;
    description: string;
    image: string | null;
    tech: string[];
    url?: string;
}

export const projects: Project[] = [
    {
        id: "component-library",
        title: "Component Library Platform",
        description:
            "A full-stack component library with authentication, moderation workflows, and a normalized PostgreSQL schema for data consistency under concurrent usage.",
        image: null,
        tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    },
    {
        id: "anylife",
        title: "AnyLife — AI Visual Summarizer",
        description:
            "A platform that transforms visual inputs into infographic summaries using Google Gemini models, solving browser constraints like storage limits and AI latency.",
        image: null,
        tech: ["React", "TypeScript", "Gemini 2.5", "IndexedDB"],
    },
    {
        id: "cloudcore",
        title: "CloudCore — Serverless AWS S3 Manager",
        description:
            "A serverless file management system enabling secure, high-concurrency browser-to-cloud uploads with retry logic, monitoring, and strong consistency guarantees.",
        image: "/SiteImages/cloudcore.png",
        tech: ["React 19", "Node.js", "AWS SDK v3", "CloudWatch"],
    },
];

export function getAllProjects(): Project[] {
    return projects;
}

export function getProjectById(id: string): Project | undefined {
    return projects.find((p) => p.id === id);
}
