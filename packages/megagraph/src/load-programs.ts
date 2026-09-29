import type { BundleConfig, ProgramConfig } from "./define-program.ts";
import { access } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { glob } from "glob";

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
  programsDir: string,
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

/** File under the programs directory that declares the umbrella packages. */
export const BUNDLES_FILE = "bundles.ts";

/**
 * Loads the umbrella packages declared in `<programsDir>/bundles.ts`, or an
 * empty list when the file does not exist.
 */
export async function loadBundles(
  programsDir: string,
): Promise<BundleConfig[]> {
  const bundlesPath = join(programsDir, BUNDLES_FILE);
  try {
    await access(bundlesPath);
  } catch {
    return [];
  }
  const bundlesModule = (await import(pathToFileURL(bundlesPath).href)) as {
    default: BundleConfig[];
  };
  return bundlesModule.default;
}
