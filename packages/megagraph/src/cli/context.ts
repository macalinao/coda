import type { MegagraphConfig } from "../define-program.ts";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import {
  loadMegagraphConfig,
  MEGAGRAPH_CONFIG_FILE,
} from "../load-programs.ts";

/** Directories and settings of the repository the CLI runs in. */
export interface CliContext {
  /** Repository root: the directory holding `programs/`. */
  root: string;
  programsDir: string;
  /** `graph/`: the merged graph (generated). */
  graphDir: string;
  /** `clients/`: the generated workspace. */
  clientsDir: string;
  config: MegagraphConfig;
  /** The root package.json. */
  rootManifest: RootManifest;
}

export interface RootManifest {
  packageManager: string;
  engines: Record<string, string>;
  workspaces: { catalog: Record<string, string> };
  devDependencies: Record<string, string>;
}

/**
 * Finds the repository root: the closest directory, from `start` upwards,
 * with a `programs/megagraph.config.ts`.
 */
export function findRoot(start: string): string {
  let dir = resolve(start);
  for (;;) {
    if (existsSync(join(dir, "programs", MEGAGRAPH_CONFIG_FILE))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) {
      throw new Error(
        `No programs/${MEGAGRAPH_CONFIG_FILE} found from ${start} upwards; pass --root`,
      );
    }
    dir = parent;
  }
}

export async function loadContext(root: string): Promise<CliContext> {
  const programsDir = join(root, "programs");
  return {
    root,
    programsDir,
    graphDir: join(root, "graph"),
    clientsDir: join(root, "clients"),
    config: await loadMegagraphConfig(programsDir),
    rootManifest: JSON.parse(
      await readFile(join(root, "package.json"), "utf-8"),
    ) as RootManifest,
  };
}

/** A version from the root package.json's devDependencies or catalog. */
export function rootVersion(context: CliContext, name: string): string {
  const version =
    context.rootManifest.devDependencies[name] ??
    context.rootManifest.workspaces.catalog[name];
  if (version === undefined) {
    throw new Error(
      `No version for ${name} in the root package.json devDependencies or catalog`,
    );
  }
  return version;
}
