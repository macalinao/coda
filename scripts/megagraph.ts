#!/usr/bin/env node
/**
 * Driver for the program megagraph of this repository.
 *
 *   node scripts/megagraph.ts graph     programs/ -> graph/
 *   node scripts/megagraph.ts generate  graph/ + programs/ -> clients/
 *   node scripts/megagraph.ts release plan  --mirror <dir>
 *       Plans a release of clients/ against the release state in <dir> (a
 *       checkout of toolboxdao/solana-programs), writing release-plan.json
 *       and release-plan.md (also appended to $GITHUB_STEP_SUMMARY).
 *   node scripts/megagraph.ts release apply --mirror <dir> --commit <sha>
 *       Writes the planned versions and changelog entries into clients/.
 *
 * Neither graph/ nor clients/ is committed. clients/ is a standalone Bun
 * workspace (not part of this repository's workspaces): after generating,
 * `bun install` and `bun run build` run inside it. `bun run codegen` does all
 * of that; see package.json.
 */
import type { ReleasePlan } from "@macalinao/megagraph";
import { spawnSync } from "node:child_process";
import { appendFile, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import {
  applyRelease,
  buildMegagraph,
  generatePackages,
  getReleasedPackages,
  planRelease,
  renderPlanMarkdown,
  loadPrograms,
  readMegagraph,
  writeMegagraph,
  writeWorkspaceScaffold,
} from "@macalinao/megagraph";

const REPO_ROOT = resolve(import.meta.dirname, "..");
const PROGRAMS_DIR = join(REPO_ROOT, "programs");
const GRAPH_DIR = join(REPO_ROOT, "graph");
const CLIENTS_DIR = join(REPO_ROOT, "clients");

/** Catalog entries the generated manifests use. */
const CLIENT_CATALOG = [
  "@macalinao/tsconfig",
  "@solana/kit",
  "@solana/program-client-core",
  "tsdown",
  "typescript",
];

interface Manifest {
  packageManager: string;
  engines: Record<string, string>;
  workspaces: { catalog: Record<string, string> };
  devDependencies: Record<string, string>;
}

async function readManifest(path: string): Promise<Manifest> {
  return JSON.parse(await readFile(path, "utf-8")) as Manifest;
}

function pick(record: Record<string, string>, name: string): string {
  const value = record[name];
  if (value === undefined) {
    throw new Error(`Missing version for ${name}`);
  }
  return value;
}

/** Builds the megagraph from programs/ and writes it to graph/. */
async function graph(): Promise<void> {
  const sources = await loadPrograms(PROGRAMS_DIR);
  console.log(
    `Building the megagraph from ${sources.programs.length.toString()} programs...`,
  );
  const megagraph = await buildMegagraph(sources);
  await writeMegagraph(GRAPH_DIR, megagraph);

  for (const entry of megagraph.packages) {
    const edges =
      entry.dependencies.length > 0
        ? ` -> ${entry.dependencies.join(", ")}`
        : "";
    console.log(`  ${entry.protocol}/${entry.program}${edges}`);
  }
  for (const umbrella of megagraph.umbrellas) {
    console.log(
      `  [${umbrella.packageName}] = ${umbrella.programs.join(" + ")}`,
    );
  }
  console.log("Wrote graph/codama.json and graph/packages.json");
}

/** Generates the clients/ workspace from graph/. */
async function generate(): Promise<void> {
  const rootManifest = await readManifest(join(REPO_ROOT, "package.json"));
  const codaManifest = await readManifest(
    join(REPO_ROOT, "packages", "coda", "package.json"),
  );
  await writeWorkspaceScaffold(CLIENTS_DIR, {
    name: "solana-programs",
    repositoryUrl: "git+https://github.com/toolboxdao/solana-programs.git",
    catalog: Object.fromEntries(
      CLIENT_CATALOG.map((name) => [
        name,
        pick(rootManifest.workspaces.catalog, name),
      ]),
    ),
    devDependencies: {
      "@types/node": pick(codaManifest.devDependencies, "@types/node"),
      oxfmt: pick(rootManifest.devDependencies, "oxfmt"),
      tsdown: pick(rootManifest.devDependencies, "tsdown"),
      typescript: pick(rootManifest.devDependencies, "typescript"),
    },
    packageManager: rootManifest.packageManager,
    engines: rootManifest.engines,
    copyFiles: [
      "LICENSE",
      "bunfig.toml",
      ".oxfmtrc.json",
      "tsdown.config.ts",
    ].map((file) => ({ from: join(REPO_ROOT, file), to: file })),
  });

  const sources = await loadPrograms(PROGRAMS_DIR);
  await generatePackages({
    megagraph: await readMegagraph(GRAPH_DIR),
    programs: sources.programs,
    protocols: sources.protocols,
    repoRoot: REPO_ROOT,
    outDir: CLIENTS_DIR,
  });

  // The renderer does not format its output. Format it with the workspace's
  // own .oxfmtrc.json (this repository's config ignores clients/).
  const result = spawnSync(
    join(REPO_ROOT, "node_modules", ".bin", "oxfmt"),
    ["packages", "scripts"],
    { cwd: CLIENTS_DIR, stdio: "inherit" },
  );
  if (result.status !== 0) {
    throw new Error("oxfmt failed on the generated packages");
  }
}

const PLAN_JSON = join(REPO_ROOT, "release-plan.json");
const PLAN_MARKDOWN = join(REPO_ROOT, "release-plan.md");

function option(name: string): string {
  const index = process.argv.indexOf(`--${name}`);
  const value = index === -1 ? undefined : process.argv[index + 1];
  if (value === undefined) {
    throw new Error(`Missing --${name} <value>`);
  }
  return value;
}

/** Plans a release of clients/ against the mirror's release state. */
async function releasePlan(): Promise<void> {
  const plan = await planRelease({
    megagraph: await readMegagraph(GRAPH_DIR),
    clientsDir: CLIENTS_DIR,
    mirrorDir: resolve(option("mirror")),
  });
  const markdown = renderPlanMarkdown(plan);
  await writeFile(PLAN_JSON, `${JSON.stringify(plan, null, 2)}\n`);
  await writeFile(PLAN_MARKDOWN, markdown);
  const summary = process.env.GITHUB_STEP_SUMMARY;
  if (summary !== undefined && summary !== "") {
    await appendFile(summary, markdown);
  }
  console.log(markdown);
}

/** Applies release-plan.json to clients/. */
async function releaseApply(): Promise<void> {
  const plan = JSON.parse(await readFile(PLAN_JSON, "utf-8")) as ReleasePlan;
  await applyRelease({
    plan,
    clientsDir: CLIENTS_DIR,
    mirrorDir: resolve(option("mirror")),
    source: { repository: "macalinao/coda", commit: option("commit") },
  });
  const released = getReleasedPackages(plan);
  console.log(
    `Applied ${released.length.toString()} release(s): ${released
      .map((release) => `${release.name}@${release.version}`)
      .join(", ")}`,
  );
}

const commands = new Map([
  ["graph", graph],
  ["generate", generate],
  ["release plan", releasePlan],
  ["release apply", releaseApply],
]);
const commandName =
  process.argv[2] === "release"
    ? `release ${process.argv[3] ?? ""}`
    : (process.argv[2] ?? "");
const run = commands.get(commandName);
if (run === undefined) {
  console.error(
    "Usage: scripts/megagraph.ts <graph|generate|release plan|release apply>",
  );
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
