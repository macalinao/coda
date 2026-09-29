import type { ProgramConfig } from "./define-program.ts";
import { basename, dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { glob } from "glob";

/** Root of the monorepo. */
export const REPO_ROOT: string = resolve(import.meta.dirname, "../../..");

/** Directory holding one sub-directory per program. */
export const PROGRAMS_DIR: string = join(REPO_ROOT, "programs");

/** Directory the megagraph and its package summary are written to. */
export const GRAPH_DIR: string = join(REPO_ROOT, "graph");

/** Directory every client package is generated into. */
export const CLIENTS_DIR: string = join(REPO_ROOT, "clients");

/** File name of a program's IDL inside its directory. */
export const IDL_FILE = "idl.json";

/**
 * A program directory under `programs/` along with its loaded config.
 */
export interface ProgramSource {
  /** Directory name, reused as the package directory under `clients/`. */
  slug: string;
  /** Absolute path of the program directory. */
  dir: string;
  config: ProgramConfig;
}

/**
 * Loads every `programs/<slug>/program.config.ts`, sorted by slug.
 */
export async function loadPrograms(
  programsDir: string = PROGRAMS_DIR,
): Promise<ProgramSource[]> {
  const configPaths = (
    await glob("*/program.config.ts", { cwd: programsDir, absolute: true })
  ).toSorted();

  const programs: ProgramSource[] = [];
  for (const configPath of configPaths) {
    const dir = dirname(configPath);
    const configModule = (await import(pathToFileURL(configPath).href)) as {
      default: ProgramConfig;
    };
    programs.push({ slug: basename(dir), dir, config: configModule.default });
  }
  return programs;
}
