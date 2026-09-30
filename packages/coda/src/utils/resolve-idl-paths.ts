import { resolve } from "node:path";
import { glob } from "glob";

/**
 * Options for {@link resolveIdlPaths}.
 */
export interface ResolveIdlPathsOptions {
  /**
   * Directory that relative paths and glob patterns are resolved against.
   * @default process.cwd()
   */
  baseDir?: string;
}

/**
 * Resolve IDL paths from configuration or command line option
 * Handles single paths, arrays, and glob patterns
 */
export async function resolveIdlPaths(
  idlPathInput: string | string[],
  options: ResolveIdlPathsOptions = {},
): Promise<string[]> {
  const baseDir = resolve(options.baseDir ?? process.cwd());
  const patterns = Array.isArray(idlPathInput) ? idlPathInput : [idlPathInput];
  const resolvedPaths: string[] = [];

  for (const path of patterns) {
    if (path.includes("*")) {
      // It's a glob pattern
      const matches = await glob(path, { cwd: baseDir });
      resolvedPaths.push(...matches.map((p) => resolve(baseDir, p)));
    } else {
      // Regular path
      resolvedPaths.push(resolve(baseDir, path));
    }
  }

  // Remove duplicates and sort for consistent ordering
  return [...new Set(resolvedPaths)].toSorted();
}
