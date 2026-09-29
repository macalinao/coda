import type { RootNode } from "codama";
import type { Megagraph } from "./build-graph.ts";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

/** File holding the merged Codama root. */
export const CODAMA_JSON = "codama.json";

/** File holding the package summary (protocols, programs, umbrellas and dependencies). */
export const PACKAGES_JSON = "packages.json";

type PackagesFile = Omit<Megagraph, "root">;

/**
 * Writes the megagraph to `<graphDir>/codama.json` and
 * `<graphDir>/packages.json`. Both are pretty-printed and deterministic, so
 * they can be checked in and diffed.
 */
export async function writeMegagraph(
  graphDir: string,
  megagraph: Megagraph,
): Promise<void> {
  await mkdir(graphDir, { recursive: true });
  await writeFile(
    join(graphDir, CODAMA_JSON),
    `${JSON.stringify(megagraph.root, null, 2)}\n`,
  );
  const packagesFile: PackagesFile = {
    protocols: megagraph.protocols,
    packages: megagraph.packages,
    umbrellas: megagraph.umbrellas,
    externals: megagraph.externals,
  };
  await writeFile(
    join(graphDir, PACKAGES_JSON),
    `${JSON.stringify(packagesFile, null, 2)}\n`,
  );
}

/**
 * Reads a megagraph written by {@link writeMegagraph}.
 */
export async function readMegagraph(graphDir: string): Promise<Megagraph> {
  const root = JSON.parse(
    await readFile(join(graphDir, CODAMA_JSON), "utf-8"),
  ) as RootNode;
  const packagesFile = JSON.parse(
    await readFile(join(graphDir, PACKAGES_JSON), "utf-8"),
  ) as Partial<PackagesFile>;
  return {
    root,
    protocols: packagesFile.protocols ?? [],
    packages: packagesFile.packages ?? [],
    umbrellas: packagesFile.umbrellas ?? [],
    externals: packagesFile.externals ?? [],
  };
}
