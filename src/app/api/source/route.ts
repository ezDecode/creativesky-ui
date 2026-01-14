import { NextRequest, NextResponse } from "next/server";
import { getDemoSourceCode, getComponentSourceCode } from "@/lib/source-reader";

/**
 * API Route: /api/source
 * 
 * Serves component source code for display in the UI.
 * 
 * Query params:
 *   type: "demo" | "component"
 *   name: component ID (e.g., "adaptive-tooltip")
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const name = searchParams.get("name");

  if (!type || !name) {
    return NextResponse.json(
      { error: "Missing required params: type, name" },
      { status: 400 }
    );
  }

  let result: { code: string; fileName: string } | null = null;

  if (type === "demo") {
    result = getDemoSourceCode(name);
  } else if (type === "component") {
    result = getComponentSourceCode(name);
  } else {
    return NextResponse.json(
      { error: "Invalid type. Must be 'demo' or 'component'" },
      { status: 400 }
    );
  }

  if (!result) {
    return NextResponse.json(
      { error: `Source not found for ${type}: ${name}` },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
}
