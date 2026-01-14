import { getAllComponentsMetadata, getComponentMetadata } from "../registry/resolver";
import { loadComponentMDX } from "../mdx/loader";
import { DocsPageConfig, DocsPageConfigSchema } from "./schema";

export async function buildDocsPage(slug: string): Promise<DocsPageConfig> {
  const metadata = getComponentMetadata(slug);
  if (!metadata) {
    throw new Error(`Component ${slug} not found in registry`);
  }

  const mdx = await loadComponentMDX(slug);
  const components = getAllComponentsMetadata();
  const index = components.findIndex(c => c.id === slug);
  
  const prev = index > 0 ? { id: components[index - 1].id, title: components[index - 1].title } : null;
  const next = index < components.length - 1 ? { id: components[index + 1].id, title: components[index + 1].title } : null;

  // Interactions mapping based on registry or design metadata if interactions missing
  // This is where we bridge the "hard-coded" gap
  const interactions = metadata.demo.scrollable 
    ? [{ type: "scroll", description: "Scroll down to see the reveal animation" }]
    : [
        { type: "click", description: "Click on items to see transitions" },
        { type: "hover", description: "Hover for additional effects" }
      ];

  const config = {
    id: metadata.id,
    title: metadata.title,
    description: metadata.description,
    category: metadata.category,
    status: metadata.status,
    pricing: metadata.pricing,
    dependencies: metadata.dependencies || [],
    interactions: (metadata as any).interactions || interactions,
    license: (metadata as any).license || [
      "Free to use and modify in both personal and commercial projects.",
      "Attribution to Skiper UI is appreciated but not required."
    ],
    showSource: metadata.source.type === "mdx",
    mdxContent: mdx?.source,
    prev,
    next,
  };

  return DocsPageConfigSchema.parse(config);
}
