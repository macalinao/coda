import type { ReleasePlan } from "../release/plan.ts";
import type { CliContext } from "./context.ts";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import {
  appendFile,
  cp,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, relative, resolve } from "node:path";
import { buildMegagraph } from "../build-graph.ts";
import { generatePackages } from "../generate-packages.ts";
import { readMegagraph, writeMegagraph } from "../graph-files.ts";
import { loadPrograms } from "../load-programs.ts";
import { applyRelease } from "../release/apply.ts";
import {
  getReleasedPackages,
  planRelease,
  renderPlanMarkdown,
} from "../release/plan.ts";
import { writeWorkspaceScaffold } from "../scaffold.ts";
import { rootVersion } from "./context.ts";
import {
  findWorkspacePackages,
  topologicalOrder,
} from "./workspace-packages.ts";

/** Runs a command, inheriting stdio, and throws when it fails. */
function run(command: string, args: string[], cwd: string): void {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`\`${command} ${args.join(" ")}\` failed in ${cwd}`);
  }
}

/** `graph`: builds the megagraph from programs/ into graph/. */
export async function graphCommand(context: CliContext): Promise<void> {
  const sources = await loadPrograms(context.programsDir);
  console.log(
    `Building the megagraph from ${sources.programs.length.toString()} programs and ${sources.externals.length.toString()} external IDL(s)...`,
  );
  const megagraph = await buildMegagraph(sources);
  await writeMegagraph(context.graphDir, megagraph);
  for (const entry of megagraph.packages) {
    const edges =
      entry.dependencies.length > 0
        ? ` -> ${entry.dependencies.join(", ")}`
        : "";
    console.log(`  ${entry.protocol}/${entry.program}${edges}`);
  }
  for (const external of megagraph.externals) {
    console.log(`  (external) ${external.program} = ${external.packageName}`);
  }
  for (const umbrella of megagraph.umbrellas) {
    console.log(
      `  [${umbrella.packageName}] = ${umbrella.programs.join(" + ")}`,
    );
  }
  console.log("Wrote graph/codama.json and graph/packages.json");
}

/** `generate`: generates the clients/ workspace from graph/ and programs/. */
export async function generateCommand(context: CliContext): Promise<void> {
  const { config } = context;
  await writeWorkspaceScaffold(context.clientsDir, {
    name: config.workspace.name,
    repositoryUrl: `git+https://github.com/${config.workspace.repository}.git`,
    catalog: Object.fromEntries(
      config.workspace.catalog.map((name) => [
        name,
        rootVersion(context, name),
      ]),
    ),
    devDependencies: Object.fromEntries(
      config.workspace.devDependencies.map((name) => [
        name,
        rootVersion(context, name),
      ]),
    ),
    packageManager: context.rootManifest.packageManager,
    engines: context.rootManifest.engines,
    copyFiles: config.workspace.copyFiles.map((file) => ({
      from: join(context.root, file),
      to: file,
    })),
  });

  const sources = await loadPrograms(context.programsDir);
  await generatePackages({
    megagraph: await readMegagraph(context.graphDir),
    peerDependencies: config.peerDependencies,
    programs: sources.programs,
    protocols: sources.protocols,
    repoRoot: context.root,
    outDir: context.clientsDir,
  });

  // The renderer does not format its output. Format it with the workspace's
  // own .oxfmtrc.json (the repository's config ignores clients/).
  const oxfmt = join(context.root, "node_modules", ".bin", "oxfmt");
  if (existsSync(oxfmt)) {
    run(oxfmt, ["packages", "scripts"], context.clientsDir);
  } else {
    console.warn("oxfmt is not installed; the generated code is unformatted");
  }
}

const CLIENT_COMMANDS: Record<string, string[]> = {
  install: ["install"],
  build: ["run", "build"],
  typecheck: ["run", "typecheck"],
  test: ["run", "test"],
  lint: ["run", "lint"],
};

/** Files of graph/ and clients/ that are not generated. */
const NOT_GENERATED = new Set(["node_modules", "dist", ".turbo", "bun.lock"]);

async function listGeneratedFiles(dir: string): Promise<string[]> {
  if (!existsSync(dir)) {
    return [];
  }
  const files: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (NOT_GENERATED.has(entry.name) || entry.name.endsWith(".tsbuildinfo")) {
      continue;
    }
    const path = join(dir, entry.name);
    files.push(
      ...(entry.isDirectory() ? await listGeneratedFiles(path) : [path]),
    );
  }
  return files;
}

/**
 * `clients <install|build|typecheck|test|lint|fingerprint>`: runs a command
 * inside the generated clients/ workspace, or prints a SHA-256 over every
 * generated file of graph/ and clients/ (to check codegen idempotence).
 * Skips with a notice when clients/ has not been generated.
 */
export async function clientsCommand(
  context: CliContext,
  name: string,
): Promise<void> {
  if (name === "fingerprint") {
    const hash = createHash("sha256");
    const files = [
      ...(await listGeneratedFiles(context.graphDir)),
      ...(await listGeneratedFiles(context.clientsDir)),
    ].toSorted();
    for (const file of files) {
      hash.update(relative(context.root, file));
      hash.update("\0");
      hash.update(await readFile(file));
      hash.update("\0");
    }
    console.log(`${hash.digest("hex")}  (${files.length.toString()} files)`);
    return;
  }
  const args = CLIENT_COMMANDS[name];
  if (args === undefined) {
    throw new Error(
      `Usage: megagraph clients <${[...Object.keys(CLIENT_COMMANDS), "fingerprint"].join("|")}>`,
    );
  }
  if (!existsSync(join(context.clientsDir, "package.json"))) {
    console.log(
      `clients/ has not been generated; skipping \`${name}\`. Run \`bun run codegen\` first.`,
    );
    return;
  }
  run(process.execPath, args, context.clientsDir);
}

const PLAN_JSON = "release-plan.json";
const PLAN_MARKDOWN = "release-plan.md";

/** `release plan --mirror <dir>`. */
export async function releasePlanCommand(
  context: CliContext,
  mirrorDir: string,
): Promise<void> {
  const plan = await planRelease({
    megagraph: await readMegagraph(context.graphDir),
    clientsDir: context.clientsDir,
    mirrorDir: resolve(mirrorDir),
  });
  const markdown = renderPlanMarkdown(plan);
  await writeFile(
    join(context.root, PLAN_JSON),
    `${JSON.stringify(plan, null, 2)}\n`,
  );
  await writeFile(join(context.root, PLAN_MARKDOWN), markdown);
  const summary = process.env.GITHUB_STEP_SUMMARY;
  if (summary !== undefined && summary !== "") {
    await appendFile(summary, markdown);
  }
  console.log(markdown);
}

/** `release apply --mirror <dir> --commit <sha>`. */
export async function releaseApplyCommand(
  context: CliContext,
  mirrorDir: string,
  commit: string,
): Promise<void> {
  const plan = JSON.parse(
    await readFile(join(context.root, PLAN_JSON), "utf-8"),
  ) as ReleasePlan;
  await applyRelease({
    plan,
    clientsDir: context.clientsDir,
    mirrorDir: resolve(mirrorDir),
    source: { repository: context.config.sourceRepository, commit },
  });
  const released = getReleasedPackages(plan);
  console.log(
    `Applied ${released.length.toString()} release(s): ${released
      .map((release) => `${release.name}@${release.version}`)
      .join(", ")}`,
  );
}

/** Entries of the export directory that may exist beforehand. */
const PRESERVED_EXPORT_ENTRIES = new Set([".git", "bun.lock"]);

/** Build, install and local artifacts that are never exported. */
const NOT_EXPORTED = new Set([
  "node_modules",
  "dist",
  ".turbo",
  "tsconfig.tsbuildinfo",
  "bun.lock",
]);

async function copyTree(from: string, to: string): Promise<void> {
  await cp(from, to, {
    recursive: true,
    filter: (source) => !NOT_EXPORTED.has(basename(source)),
  });
}

function renderMirrorReadme(
  context: CliContext,
  sourceCommit: string,
  packages: { name: string; path: string }[],
): string {
  const source = context.config.sourceRepository;
  const commitUrl = `https://github.com/${source}/commit/${sourceCommit}`;
  return `# ${context.config.workspace.name}

TypeScript clients for Solana programs, one npm package per program, plus umbrella packages that re-export a protocol's programs.

> [!IMPORTANT]
> This repository is **generated** from [${source}](https://github.com/${source}) at [\`${sourceCommit.slice(0, 7)}\`](${commitUrl}). Do not edit it by hand: change \`programs/\` in ${source} instead. Releases are cut and published from ${source}; the versions, changelogs and \`graph/\` here are the release state it diffs against.

## Layout

- \`packages/<protocol>/<program>/\`: one package per program. \`packages/<protocol>/\`: the protocol's umbrella package, if it has one.
- \`graph/codama.json\`: every program merged into one Codama graph, including external programs (e.g. SPL Token) whose clients are published elsewhere. \`graph/packages.json\` lists each program's protocol and package, the programs it links to, the umbrellas and the external programs.
- \`programs/<protocol>/<program>/\`: the generator's inputs (IDL, \`program.config.ts\`), for reference. They need the coda tooling to run. External programs only have a vendored IDL here, no package.

## Development

\`\`\`bash
bun install
bun run build
bun run typecheck
bun run test
\`\`\`

## Packages

${packages.map((entry) => `- [\`${entry.name}\`](https://www.npmjs.com/package/${entry.name}) (\`${entry.path}\`)`).join("\n")}

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
`;
}

/**
 * `export <out-dir> [--source-commit <sha>]`: assembles the published mirror
 * from the generated tree: clients/ (the workspace), graph/, programs/ and a
 * README naming the source commit. `<out-dir>` must be empty apart from
 * `.git` and `bun.lock` (kept so `bun install` only re-resolves what changed).
 */
export async function exportCommand(
  context: CliContext,
  outDirArg: string,
  sourceCommit: string,
): Promise<void> {
  const outDir = resolve(outDirArg);
  await mkdir(outDir, { recursive: true });
  const unexpected = (await readdir(outDir)).filter(
    (entry) => !PRESERVED_EXPORT_ENTRIES.has(entry),
  );
  if (unexpected.length > 0) {
    throw new Error(
      `${outDir} must be empty apart from ${[...PRESERVED_EXPORT_ENTRIES].join(", ")}; found ${unexpected.join(", ")}`,
    );
  }
  if (
    !existsSync(join(context.clientsDir, "package.json")) ||
    !existsSync(join(context.graphDir, "codama.json"))
  ) {
    throw new Error(
      "clients/ or graph/ is missing; run `bun run codegen` first",
    );
  }

  await copyTree(context.clientsDir, outDir);
  await copyTree(context.graphDir, join(outDir, "graph"));
  await copyTree(context.programsDir, join(outDir, "programs"));

  const packages = await findWorkspacePackages(outDir);
  await writeFile(
    join(outDir, "README.md"),
    renderMirrorReadme(context, sourceCommit, packages),
  );
  console.log(
    `Exported ${packages.length.toString()} packages from ${context.config.sourceRepository}@${sourceCommit.slice(0, 7)} to ${outDir}`,
  );
}

function isPublished(name: string, version: string): boolean {
  const result = spawnSync("npm", ["view", `${name}@${version}`, "version"], {
    encoding: "utf-8",
  });
  return result.status === 0 && result.stdout.trim() === version;
}

/**
 * `publish <workspace-dir> [--dry-run]`: publishes every package of an
 * installed workspace (the mirror) whose version is not on npm yet, in
 * dependency order. Each package is packed with `bun pm pack`, which
 * resolves `workspace:` and `catalog:` ranges, and published with
 * `npm publish --provenance`.
 */
export async function publishCommand(
  workspaceDirArg: string,
  dryRun: boolean,
): Promise<void> {
  const packages = topologicalOrder(
    (await findWorkspacePackages(resolve(workspaceDirArg))).filter(
      (entry) => !entry.private,
    ),
  );
  const pending = packages.filter(
    (entry) => !isPublished(entry.name, entry.version),
  );
  if (pending.length === 0) {
    console.log("Every package version is already on npm.");
    return;
  }
  console.log(
    `To publish:\n${pending.map((entry) => `  ${entry.name}@${entry.version}`).join("\n")}`,
  );
  if (dryRun) {
    console.log("Dry run: not publishing.");
    return;
  }

  const failed: string[] = [];
  for (const entry of pending) {
    const destination = await mkdtemp(join(tmpdir(), "megagraph-pack-"));
    const pack = spawnSync(
      process.execPath,
      ["pm", "pack", "--destination", destination],
      { cwd: entry.dir, encoding: "utf-8" },
    );
    const tarball = (await readdir(destination)).find((file) =>
      file.endsWith(".tgz"),
    );
    if (pack.status !== 0 || tarball === undefined) {
      console.error(
        `::error::Failed to pack ${entry.name}@${entry.version}\n${pack.stderr}`,
      );
      failed.push(`${entry.name}@${entry.version}`);
      continue;
    }
    // npm, not bun: publishing with provenance over npm trusted publishing
    // (OIDC) needs the npm CLI >= 11.5.1.
    const publish = spawnSync(
      "npm",
      [
        "publish",
        join(destination, tarball),
        "--provenance",
        "--access",
        "public",
      ],
      { stdio: "inherit" },
    );
    if (publish.status === 0) {
      console.log(`Published ${entry.name}@${entry.version}`);
    } else {
      console.error(
        `::error::Failed to publish ${entry.name}@${entry.version}`,
      );
      failed.push(`${entry.name}@${entry.version}`);
    }
  }
  if (failed.length > 0) {
    throw new Error(
      `${failed.length.toString()} package(s) failed to publish: ${failed.join(", ")}. New package names need a bootstrap publish and an npm trusted publisher for the publishing workflow before OIDC publishing works.`,
    );
  }
}
