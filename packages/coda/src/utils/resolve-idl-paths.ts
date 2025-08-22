import { resolve } from "node:path";
import { glob } from "glob";

/**
 * Resolve IDL paths from configuration or command line option
 * Handles single paths, arrays, and glob patterns
 */
export async function resolveIdlPaths(
  idlPathInput: string | string[],
): Promise<string[]> {
  let resolvedPaths: string[] = [];

  if (Array.isArray(idlPathInput)) {
    // Handle array of paths (each could be a glob)
    for (const path of idlPathInput) {
      if (path.includes("*")) {
        // It's a glob pattern
        const matches = await glob(path);
        resolvedPaths.push(...matches.map((p) => resolve(p)));
      } else {
        // Regular path
        resolvedPaths.push(resolve(path));
      }
    }
  } else if (idlPathInput.includes("*")) {
    // Single path with glob pattern
    const matches = await glob(idlPathInput);
    resolvedPaths = matches.map((p) => resolve(p));
  } else {
    // Regular single path
    resolvedPaths = [resolve(idlPathInput)];
  }

  // Remove duplicates and sort for consistent ordering
  return [...new Set(resolvedPaths)].sort();
}
