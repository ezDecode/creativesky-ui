import fs from "fs";
import path from "path";

/**
 * Get Demo Source Code
 * 
 * Reads the actual demo file source code to display in the UI.
 * This eliminates code duplication - the demo code exists in ONE place only.
 * 
 * @param componentId - The component ID (e.g., "adaptive-tooltip")
 * @returns The source code string or null if not found
 */
export function getDemoSourceCode(componentId: string): string | null {
  try {
    const pascalName = componentId
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("");
    
    const demoPath = path.join(
      process.cwd(),
      `src/components/demos/${componentId}/${pascalName}Demo.tsx`
    );
    
    if (!fs.existsSync(demoPath)) {
      console.warn(`[getDemoSourceCode] Demo file not found: ${demoPath}`);
      return null;
    }
    
    const sourceCode = fs.readFileSync(demoPath, "utf8");
    
    // Return the full source code
    return sourceCode;
  } catch (error) {
    console.error(`[getDemoSourceCode] Error reading demo for ${componentId}:`, error);
    return null;
  }
}

/**
 * Get Component Source Code
 * 
 * Reads the actual component implementation source code.
 * 
 * @param componentId - The component ID (e.g., "adaptive-tooltip")
 * @returns The source code string or null if not found
 */
export function getComponentSourceCode(componentId: string): string | null {
  try {
    const extensions = [".tsx", ".framer.tsx", ".ts"];
    let componentPath = "";
    
    for (const ext of extensions) {
      const fullPath = path.join(
        process.cwd(),
        `src/content/${componentId}/${componentId}${ext}`
      );
      if (fs.existsSync(fullPath)) {
        componentPath = fullPath;
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
