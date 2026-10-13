import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

/** A package of a generated workspace. */
export interface WorkspacePackage {
  /** Absolute directory. */
  dir: string;
  /** Directory relative to the workspace root, e.g. `packages/quarry/mine`. */
  path: string;
  name: string;
  version: string;
  private: boolean;
  dependencies: string[];
}

/**
 * Lists the packages of a generated workspace: umbrellas at
 * `packages/<protocol>/` and programs at `packages/<protocol>/<program>/`.
 */
export async function findWorkspacePackages(
  workspaceDir: string,
): Promise<WorkspacePackage[]> {
  const found: WorkspacePackage[] = [];
  const walk = async (path: string, depth: number): Promise<void> => {
    let entries;
    try {
      entries = await readdir(join(workspaceDir, path), {
        withFileTypes: true,
      });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (
        !entry.isDirectory() ||
        entry.name === "node_modules" ||
        entry.name === "dist"
      ) {
        continue;
      }
      const child = join(path, entry.name);
      try {
        const manifest = JSON.parse(
          await readFile(join(workspaceDir, child, "package.json"), "utf-8"),
        ) as {
          name: string;
          version: string;
          private?: boolean;
          dependencies?: Record<string, string>;
        };
        found.push({
          dir: join(workspaceDir, child),
          path: child,
          name: manifest.name,
          version: manifest.version,
          private: manifest.private === true,
          dependencies: Object.keys(manifest.dependencies ?? {}),
        });
      } catch {
        // Protocol directories without an umbrella have no manifest.
      }
      if (depth > 1) {
        await walk(child, depth - 1);
      }
    }
  };
  await walk("packages", 2);
  return found.toSorted((a, b) => a.name.localeCompare(b.name));
}

/** Orders packages so that each comes after its dependencies. */
export function topologicalOrder(
  packages: WorkspacePackage[],
): WorkspacePackage[] {
  const byName = new Map(packages.map((entry) => [entry.name, entry]));
  const ordered: WorkspacePackage[] = [];
  const seen = new Set<string>();
  const visit = (entry: WorkspacePackage) => {
    if (seen.has(entry.name)) {
      return;
    }
    seen.add(entry.name);
    for (const dependency of entry.dependencies) {
      const target = byName.get(dependency);
      if (target !== undefined) {
        visit(target);
      }
    }
    ordered.push(entry);
  };
  for (const entry of packages) {
    visit(entry);
  }
  return ordered;
}
