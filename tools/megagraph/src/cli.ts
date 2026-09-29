#!/usr/bin/env bun
import type { RootNode } from "codama";
import type { ProgramPackage } from "./build-graph.ts";
import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { buildMegagraph } from "./build-graph.ts";
import { generatePackages } from "./generate-packages.ts";
import {
  CLIENTS_DIR,
  GRAPH_DIR,
  loadPrograms,
  REPO_ROOT,
} from "./load-programs.ts";

const CODAMA_JSON = join(GRAPH_DIR, "codama.json");
const PACKAGES_JSON = join(GRAPH_DIR, "packages.json");

interface PackagesFile {
  packages: ProgramPackage[];
}

/** Builds the megagraph from programs/ and writes it to graph/. */
async function graph(): Promise<void> {
  const sources = await loadPrograms();
  console.log(
    `Building the megagraph from ${sources.length.toString()} programs...`,
  );
  const { root, packages } = await buildMegagraph(sources);

  await mkdir(GRAPH_DIR, { recursive: true });
  await writeFile(CODAMA_JSON, `${JSON.stringify(root, null, 2)}\n`);
  const packagesFile: PackagesFile = { packages };
  await writeFile(PACKAGES_JSON, `${JSON.stringify(packagesFile, null, 2)}\n`);

  for (const entry of packages) {
    const edges =
      entry.dependencies.length > 0
        ? ` -> ${entry.dependencies.join(", ")}`
        : "";
    console.log(`  ${entry.program}${edges}`);
  }
  console.log(
    `Wrote ${relative(REPO_ROOT, CODAMA_JSON)} and ${relative(REPO_ROOT, PACKAGES_JSON)}`,
  );
}

/** Generates every package under clients/ from graph/. */
async function generate(): Promise<void> {
  const root = JSON.parse(await readFile(CODAMA_JSON, "utf-8")) as RootNode;
  const { packages } = JSON.parse(
    await readFile(PACKAGES_JSON, "utf-8"),
  ) as PackagesFile;
  const sources = await loadPrograms();

  const packageDirs = await generatePackages({
    root,
    packages,
    sources,
    clientsDir: CLIENTS_DIR,
  });

  // The renderer does not format its output; match the repo's oxfmt style.
  const result = spawnSync(
    join(REPO_ROOT, "node_modules", ".bin", "oxfmt"),
    packageDirs.map((dir) => join(dir, "src")),
    { cwd: REPO_ROOT, stdio: "inherit" },
  );
  if (result.status !== 0) {
    throw new Error("oxfmt failed on the generated packages");
  }
}

const commands: Record<string, () => Promise<void>> = { graph, generate };
const command = process.argv[2] ?? "";
const run = commands[command];
if (run === undefined) {
  console.error("Usage: megagraph <graph|generate>");
  process.exit(1);
}
try {
  await run();
} catch (error) {
  console.error(
    error instanceof Error && !process.env.DEBUG ? error.message : error,
  );
  process.exit(1);
}
