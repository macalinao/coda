#!/usr/bin/env node
/**
 * Driver for the program megagraph of this repository.
 *
 *   node scripts/megagraph.ts graph     programs/ -> graph/
 *   node scripts/megagraph.ts generate  graph/ + programs/ -> clients/
 *
 * The program data lives in programs/, graph/ and clients/; everything else
 * is in the @macalinao/megagraph package (build it first: `bun run graph`
 * and `bun run codegen` do).
 */
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import {
  buildMegagraph,
  generatePackages,
  loadBundles,
  loadPrograms,
  readMegagraph,
  writeMegagraph,
} from "@macalinao/megagraph";

const REPO_ROOT = resolve(import.meta.dirname, "..");
const PROGRAMS_DIR = join(REPO_ROOT, "programs");
const GRAPH_DIR = join(REPO_ROOT, "graph");
const CLIENTS_DIR = join(REPO_ROOT, "clients");

/** Builds the megagraph from programs/ and writes it to graph/. */
async function graph(): Promise<void> {
  const sources = await loadPrograms(PROGRAMS_DIR);
  const bundles = await loadBundles(PROGRAMS_DIR);
  console.log(
    `Building the megagraph from ${sources.length.toString()} programs...`,
  );
  const megagraph = await buildMegagraph(sources, bundles);
  await writeMegagraph(GRAPH_DIR, megagraph);

  for (const entry of megagraph.packages) {
    const edges =
      entry.dependencies.length > 0
        ? ` -> ${entry.dependencies.join(", ")}`
        : "";
    console.log(`  ${entry.program}${edges}`);
  }
  for (const bundle of megagraph.bundles) {
    console.log(`  [${bundle.slug}] = ${bundle.programs.join(" + ")}`);
  }
  console.log("Wrote graph/codama.json and graph/packages.json");
}

/** Generates every package under clients/ from graph/. */
async function generate(): Promise<void> {
  const { root, packages, bundles } = await readMegagraph(GRAPH_DIR);
  const packageDirs = await generatePackages({
    root,
    packages,
    bundles,
    sources: await loadPrograms(PROGRAMS_DIR),
    bundleConfigs: await loadBundles(PROGRAMS_DIR),
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

const commands = new Map([
  ["graph", graph],
  ["generate", generate],
]);
const run = commands.get(process.argv[2] ?? "");
if (run === undefined) {
  console.error("Usage: scripts/megagraph.ts <graph|generate>");
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
