import { NextRequest, NextResponse } from "next/server";
import { getDemoSourceCodeAsync, getComponentSourceCodeAsync } from "@/lib/source-reader";
import { getComponentMetadata } from "@/lib/registry/resolver";
import { SecurityError } from "@/lib/errors";

/**
 * API Route: /api/source
 * 
 * Serves component source code for display in the UI.
 * 
 * Query params:
 *   type: "demo" | "component"
 *   name: component ID (e.g., "adaptive-tooltip")
 * 
 * Security features:
 *   - Rate limiting: 10 requests per IP per 10 seconds
 *   - Paid component gating: returns 403 for paid components
 *   - Input validation via source-reader (throws SecurityError)
 */

/* ──────────────────────────────────────────────────────────────────────────────
 * RATE LIMITER
 * 
 * In-memory sliding window rate limiter.
 * NOTE: This is for development only. For production, use Redis/Upstash.
 * ────────────────────────────────────────────────────────────────────────────── */

const RATE_LIMIT_WINDOW_MS = 10_000; // 10 seconds
const RATE_LIMIT_MAX_REQUESTS = 10;

// Map of IP -> array of request timestamps
const rateLimitMap = new Map<string, number[]>();

// Periodic cleanup to prevent memory leaks (run every minute)
const CLEANUP_INTERVAL_MS = 60_000;
let cleanupInterval: NodeJS.Timeout | null = null;

function startCleanupInterval() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of rateLimitMap.entries()) {
      const valid = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
      if (valid.length === 0) {
        rateLimitMap.delete(ip);
      } else {
        rateLimitMap.set(ip, valid);
      }
    }
  }, CLEANUP_INTERVAL_MS);
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(ip) || [];

  // Filter to only requests within the window
  const recentRequests = requests.filter(t => now - t < RATE_LIMIT_WINDOW_MS);

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  // Record this request
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);

  // Start cleanup if not already running
  startCleanupInterval();

  return false;
}

/* ──────────────────────────────────────────────────────────────────────────────
 * ROUTE HANDLER
 * ────────────────────────────────────────────────────────────────────────────── */

export async function GET(request: NextRequest) {
  // Extract client IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0].trim() || "unknown";

  // Rate limit check
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again in a few seconds." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const name = searchParams.get("name");

  // Validate required params
  if (!type || !name) {
    return NextResponse.json(
      { error: "Missing required params: type, name" },
      { status: 400 }
    );
  }

  // Validate type param
  if (type !== "demo" && type !== "component") {
    return NextResponse.json(
      { error: "Invalid type. Must be 'demo' or 'component'" },
      { status: 400 }
    );
  }

  // Check if component is paid (gate access)
  const metadata = getComponentMetadata(name);
  if (metadata?.pricing === "paid") {
    return NextResponse.json(
      { error: "This is a paid component. Access denied." },
      { status: 403 }
    );
  }

  // Attempt to read source code (non-blocking async)
  try {
    let code: string | null = null;

    if (type === "demo") {
      code = await getDemoSourceCodeAsync(name);
    } else {
      code = await getComponentSourceCodeAsync(name);
    }

    if (!code) {
      return NextResponse.json(
        { error: `Source not found for ${type}: ${name}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ code });
  } catch (err) {
    // Handle security errors specifically
    if (err instanceof SecurityError) {
      console.warn(`[/api/source] Security violation: ${err.message} (code: ${err.code})`);
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    // Generic error handling
    console.error("[/api/source] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
