import fs from "fs";
import { promises as fsPromises } from "fs";
import path from "path";
import { getComponentMetadata } from "./registry/resolver";
import { SecurityError } from "./errors";

/**
 * Valid component ID pattern.
 * Only lowercase letters, numbers, and hyphens allowed.
 * This prevents path traversal attacks like "../../../etc/passwd"
 */
const VALID_COMPONENT_ID = /^[a-z0-9-]+$/;

/**
 * Validates a component ID for security.
 * 
 * @throws SecurityError if the ID format is invalid or component doesn't exist
 */
function validateComponentId(componentId: string): void {
  // Check format first (prevents path traversal)
  if (!VALID_COMPONENT_ID.test(componentId)) {
    throw new SecurityError(
      `Invalid component ID format: "${componentId}"`,
      'INVALID_ID_FORMAT'
    );
  }

  // Verify component exists in registry (whitelist approach)
  const metadata = getComponentMetadata(componentId);
  if (!metadata) {
    throw new SecurityError(
      `Unknown component: "${componentId}"`,
      'UNKNOWN_COMPONENT'
    );
  }
}

/**
 * Convert kebab-case to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

/* ──────────────────────────────────────────────────────────────────────────────
 * ASYNC VERSIONS (Preferred for API routes)
 * ────────────────────────────────────────────────────────────────────────────── */

/**
 * Get Demo Source Code (Async)
 * 
 * Non-blocking version for use in API routes.
 * 
 * @param componentId - The component ID (e.g., "adaptive-tooltip")
 * @returns The source code string or null if not found
 * @throws SecurityError if componentId is invalid or unknown
 */
export async function getDemoSourceCodeAsync(componentId: string): Promise<string | null> {
  validateComponentId(componentId);

  try {
    const pascalName = toPascalCase(componentId);
    const demoPath = path.join(
      process.cwd(),
      `src/components/demos/${componentId}/${pascalName}Demo.tsx`
    );

    try {
      await fsPromises.access(demoPath);
    } catch {
      console.warn(`[getDemoSourceCodeAsync] Demo file not found: ${demoPath}`);
      return null;
    }

    return await fsPromises.readFile(demoPath, "utf8");
  } catch (error) {
    console.error(`[getDemoSourceCodeAsync] Error reading demo for ${componentId}:`, error);
    return null;
  }
}

/**
 * Get Component Source Code (Async)
 * 
 * Non-blocking version for use in API routes.
 * 
 * @param componentId - The component ID (e.g., "adaptive-tooltip")
 * @returns The source code string or null if not found
 * @throws SecurityError if componentId is invalid or unknown
 */
export async function getComponentSourceCodeAsync(componentId: string): Promise<string | null> {
  validateComponentId(componentId);

  try {
    const pascalName = toPascalCase(componentId);
    const extensions = [".tsx", ".framer.tsx", ".ts"];
    let componentPath = "";

    for (const ext of extensions) {
      // Check for PascalCase first
      const pascalPath = path.join(
        process.cwd(),
        `src/content/${componentId}/${pascalName}${ext}`
      );
      try {
        await fsPromises.access(pascalPath);
        componentPath = pascalPath;
        break;
      } catch {
        // Try next
      }

      // Fallback to kebab-case
      const kebabPath = path.join(
        process.cwd(),
        `src/content/${componentId}/${componentId}${ext}`
      );
      try {
        await fsPromises.access(kebabPath);
        componentPath = kebabPath;
        break;
      } catch {
        // Try next
      }
    }

    if (!componentPath) {
      console.warn(`[getComponentSourceCodeAsync] Component file not found for: ${componentId}`);
      return null;
    }

    return await fsPromises.readFile(componentPath, "utf8");
  } catch (error) {
    console.error(`[getComponentSourceCodeAsync] Error reading component ${componentId}:`, error);
    return null;
  }
}

/* ──────────────────────────────────────────────────────────────────────────────
 * SYNC VERSIONS (For backward compatibility)
 * ────────────────────────────────────────────────────────────────────────────── */

/**
 * Get Demo Source Code (Sync)
 * 
 * @deprecated Use getDemoSourceCodeAsync for API routes
 */
export function getDemoSourceCode(componentId: string): string | null {
  validateComponentId(componentId);

  try {
    const pascalName = toPascalCase(componentId);
    const demoPath = path.join(
      process.cwd(),
      `src/components/demos/${componentId}/${pascalName}Demo.tsx`
    );

    if (!fs.existsSync(demoPath)) {
      console.warn(`[getDemoSourceCode] Demo file not found: ${demoPath}`);
      return null;
    }

    return fs.readFileSync(demoPath, "utf8");
  } catch (error) {
    console.error(`[getDemoSourceCode] Error reading demo for ${componentId}:`, error);
    return null;
  }
}

/**
 * Get Component Source Code (Sync)
 * 
 * @deprecated Use getComponentSourceCodeAsync for API routes
 */
export function getComponentSourceCode(componentId: string): string | null {
  validateComponentId(componentId);

  try {
    const pascalName = toPascalCase(componentId);
    const extensions = [".tsx", ".framer.tsx", ".ts"];
    let componentPath = "";

    for (const ext of extensions) {
      const pascalPath = path.join(
        process.cwd(),
        `src/content/${componentId}/${pascalName}${ext}`
      );
      if (fs.existsSync(pascalPath)) {
        componentPath = pascalPath;
        break;
      }

      const kebabPath = path.join(
        process.cwd(),
        `src/content/${componentId}/${componentId}${ext}`
      );
      if (fs.existsSync(kebabPath)) {
        componentPath = kebabPath;
        break;
      }
    }

    if (!componentPath) {
      console.warn(`[getComponentSourceCode] Component file not found for: ${componentId}`);
      return null;
    }

    return fs.readFileSync(componentPath, "utf8");
  } catch (error) {
    console.error(`[getComponentSourceCode] Error reading component ${componentId}:`, error);
    return null;
  }
}

