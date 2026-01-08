
import Link from "next/link";
import Image from "next/image";
import { resolveVaultLinks, VaultResolvedItem } from "@/lib/vault/resolve-links";
import { Shell } from "@/components/layout/Shell";
import { FilterChips } from "@/components/ui/filterchips";

export const revalidate = 86400;

const FILTERS = ["All", "Writings", "Portfolio", "Library", "Fonts"] as const;
type FilterType = (typeof FILTERS)[number];

const VAULT_LINKS: { url: string; type: VaultResolvedItem["type"] }[] = [
  { url: "https://motion.dev", type: "Library" },
  { url: "https://animejs.com", type: "Library" },
  { url: "https://gsap.com", type: "Library" },
  { url: "https://www.creativesky.me/", type: "Portfolio" },
  { url: "https://fonts.google.com/", type:"Fonts" },
];

interface VaultPageProps {
  searchParams?: Promise<{ type?: string }>;
}

export default async function VaultPage({ searchParams }: VaultPageProps) {
  const params = await searchParams ?? {};

  const activeFilter: FilterType = FILTERS.includes(params.type as FilterType)
    ? (params.type as FilterType)
    : "All";

  let items: VaultResolvedItem[] = [];
  
  try {
    const resolved = await resolveVaultLinks(VAULT_LINKS);
    items = resolved.filter(
      (item) => 
        item && 
        typeof item.url === "string" && 
        item.url.length > 0 && 
        typeof item.title === "string" && 
        item.title.length > 0
    );
  } catch (error) {
    console.error("Failed to resolve vault links:", error);
    // Return empty array on error - page will show empty state
    items = [];
  }

  const filteredItems =
    activeFilter === "All"
      ? items
      : items.filter((item) => item && item.type === activeFilter);

  return (
    <Shell>
      <header className="flex flex-col gap-6 mb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="rotate-180"
          >
            <path
              d="M6 3L11 8L6 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to home
        </Link>

        <h1 className="text-4xl font-normal tracking-normal">Vault</h1>

          <FilterChips
            filters={FILTERS}
            activeFilter={activeFilter}
            baseHref="/vault"
          />
      </header>

      {filteredItems && filteredItems.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {filteredItems.map((item, index) => (
            <VaultCard key={item.url || `vault-item-${index}`} item={item} />
          ))}
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center flex flex-col gap-3">
            <div className="text-4xl mb-4">🔭</div>
            <h3 className="text-lg font-medium text-foreground">
              Nothing here yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {activeFilter === "All"
                ? "No links have been added to the vault yet."
                : `No ${activeFilter.toLowerCase()} links found. Try a different filter.`}
            </p>
            {activeFilter !== "All" && (
              <Link
                href="/vault"
                className="inline-flex mt-4 px-4 py-2 rounded-full text-sm bg-muted/40 text-foreground hover:bg-muted transition-colors"
              >
                View all
              </Link>
            )}
          </div>
        </div>
      )}
    </Shell>
  );
}

function VaultCard({ item }: { item: VaultResolvedItem }) {
  if (!item || !item.url || !item.title) return null;
  
  const hasValidImage = 
    typeof item.image === "string" && 
    item.image.length > 0 && 
    (item.image.startsWith("http://") || item.image.startsWith("https://"));
  
  return (
    <Link
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-xl border border-border bg-background hover:shadow-lg transition"
    >
      {hasValidImage && item.image && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted/20">
          <Image
            src={item.image}
            alt={item.title || ""}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-base font-medium leading-snug line-clamp-2">
          {item.title}
        </h3>

        {item.description && typeof item.description === "string" && item.description.length > 0 && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          {(item.site && typeof item.site === "string" && item.site.length > 0) ? item.site : "Unknown"}
        </p>
      </div>
    </Link>
  );
}