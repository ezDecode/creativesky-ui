// src/lib/vault/resolve-links.ts
// Fixed version with better error handling and fallbacks

export type VaultType = "Writings" | "Portfolio" | "Library" | "Fonts";

export interface VaultResolvedItem {
  url: string;
  title: string;
  description: string;
  image: string | null;
  site: string;
  type: VaultType;
}

// Cache to store resolved metadata
const metadataCache = new Map<string, VaultResolvedItem>();

async function fetchHTML(url: string, timeoutMs = 5000): Promise<string> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; VaultBot/1.0)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Cache-Control": "max-age=3600",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    return await res.text();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Timeout fetching ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
}

// Parse HTML using browser-compatible DOMParser (works in both Node and browser)
function parseHTML(html: string) {
  // Check if we're in a Node.js environment
  if (typeof window === 'undefined') {
    // Server-side: Use a simple regex-based parser as fallback
    return {
      querySelector: (selector: string) => {
        const patterns: Record<string, RegExp> = {
          'title': /<title[^>]*>([^<]+)<\/title>/i,
          'meta[property="og:title"]': /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i,
          'meta[name="og:title"]': /<meta[^>]*name=["']og:title["'][^>]*content=["']([^"']+)["']/i,
          'meta[property="og:description"]': /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i,
          'meta[name="description"]': /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i,
          'meta[property="og:image"]': /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
          'meta[property="twitter:image"]': /<meta[^>]*property=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
          'meta[property="og:site_name"]': /<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i,
        };

        const pattern = patterns[selector];
        if (!pattern) return null;

        const match = html.match(pattern);
        if (!match) return null;

        return {
          getAttribute: (attr: string) => attr === 'content' ? match[1] : null,
          textContent: match[1]
        };
      }
    };
  }

  // Client-side: This shouldn't be called, but provide a fallback
  return null;
}

function getMeta(doc: any, property: string): string | null {
  if (!doc) return null;

  try {
    // Try property attribute
    const byProperty = doc.querySelector(`meta[property="${property}"]`);
    if (byProperty) {
      const content = byProperty.getAttribute?.('content');
      if (content) return content;
    }

    // Try name attribute
    const byName = doc.querySelector(`meta[name="${property}"]`);
    if (byName) {
      const content = byName.getAttribute?.('content');
      if (content) return content;
    }

    return null;
  } catch {
    return null;
  }
}

function resolveImageUrl(imageUrl: string | null, baseUrl: string): string | null {
  if (!imageUrl) return null;
  
  try {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith('//')) {
      const protocol = new URL(baseUrl).protocol;
      return `${protocol}${imageUrl}`;
    }
    
    const base = new URL(baseUrl);
    
    if (imageUrl.startsWith('/')) {
      return `${base.protocol}//${base.host}${imageUrl}`;
    }
    
    return new URL(imageUrl, baseUrl).href;
  } catch (error) {
    console.warn(`Failed to resolve image URL: ${imageUrl}`, error);
    return null;
  }
}

function getFallbackTitle(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    return hostname.charAt(0).toUpperCase() + hostname.slice(1);
  } catch {
    return "Unknown Link";
  }
}

function getFallbackSite(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "Unknown";
  }
}

async function resolveVaultLink(
  link: { url: string; type: VaultType }
): Promise<VaultResolvedItem> {
  // Check cache first
  const cached = metadataCache.get(link.url);
  if (cached && cached.type === link.type) {
    return cached;
  }

  try {
    const html = await fetchHTML(link.url);
    const doc = parseHTML(html);

    const title =
      getMeta(doc, "og:title") ||
      getMeta(doc, "twitter:title") ||
      doc?.querySelector?.("title")?.textContent ||
      getFallbackTitle(link.url);

    const description =
      getMeta(doc, "og:description") ||
      getMeta(doc, "twitter:description") ||
      getMeta(doc, "description") ||
      "";

    const image = 
      getMeta(doc, "og:image") ||
      getMeta(doc, "twitter:image");

    const resolvedImage = resolveImageUrl(image, link.url);

    const site =
      getMeta(doc, "og:site_name") ||
      getFallbackSite(link.url);

    const result: VaultResolvedItem = {
      url: link.url,
      title: (title || getFallbackTitle(link.url)).trim(),
      description: (description || "").trim().slice(0, 200),
      image: resolvedImage,
      site: site || getFallbackSite(link.url),
      type: link.type,
    };

    metadataCache.set(link.url, result);
    
    return result;
  } catch (error) {
    console.warn(`Failed to resolve ${link.url}:`, error);
    
    const fallback: VaultResolvedItem = {
      url: link.url,
      title: getFallbackTitle(link.url),
      description: "",
      image: null,
      site: getFallbackSite(link.url),
      type: link.type,
    };
    
    metadataCache.set(link.url, fallback);
    
    return fallback;
  }
}

export async function resolveVaultLinks(
  links: { url: string; type: VaultType }[]
): Promise<VaultResolvedItem[]> {
  if (!links || links.length === 0) {
    return [];
  }

  // Remove duplicates and filter out invalid entries
  const uniqueLinks = Array.from(
    new Map(
      links
        .filter(l => l && typeof l.url === 'string' && l.url.length > 0)
        .map((l) => [l.url, l])
    ).values()
  );

  if (uniqueLinks.length === 0) {
    return [];
  }

  try {
    const results = await Promise.allSettled(
      uniqueLinks.map(link => resolveVaultLink(link))
    );

    return results
      .filter((result): result is PromiseFulfilledResult<VaultResolvedItem> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);
  } catch (error) {
    console.error('Error resolving vault links:', error);
    // Return fallback data for all links
    return uniqueLinks.map(link => ({
      url: link.url,
      title: getFallbackTitle(link.url),
      description: "",
      image: null,
      site: getFallbackSite(link.url),
      type: link.type,
    }));
  }
}

export function clearVaultCache() {
  metadataCache.clear();
}