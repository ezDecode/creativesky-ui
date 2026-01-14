import { z } from "zod";
import { ComponentCategory, ComponentPricing, ComponentStatus } from "../types";

export const InteractionSchema = z.object({
  type: z.enum(["click", "hover", "scroll", "drag", "input"]),
  description: z.string(),
});

export type Interaction = z.infer<typeof InteractionSchema>;

export const DocsPageConfigSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  status: z.string(),
  pricing: z.string(),
  dependencies: z.array(z.string()).default([]),
  interactions: z.array(InteractionSchema).optional(),
  license: z.array(z.string()).optional(),
  showSource: z.boolean().default(true),
  mdxContent: z.any(), // React Component
  prev: z.object({ id: z.string(), title: z.string() }).nullable(),
  next: z.object({ id: z.string(), title: z.string() }).nullable(),
});

export type DocsPageConfig = z.infer<typeof DocsPageConfigSchema>;
