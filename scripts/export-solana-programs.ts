#!/usr/bin/env bun
/**
 * Assembles the github.com/toolboxdao/solana-programs mirror from the
 * generated tree.
 *
 *   bun scripts/export-solana-programs.ts <out-dir> [--source-commit <sha>]
 *
 * Run `bun run codegen` (and, for a release, `megagraph.ts release apply`)
 * first. The export contains the generated clients/ workspace (root
 * scaffolding and packages/<protocol>/<program>/), graph/, programs/ (the
 * generator's inputs, for reference) and a README naming the source commit.
 * It is output only: the mirror cannot regenerate itself.
 *
 * `<out-dir>` must be empty apart from `.git` and `bun.lock` (the mirror's
 * lockfile is kept so `bun install` there only re-resolves what changed).
 * No dependencies beyond Node's standard library.
 */
import { execFileSync } from "node:child_process";
import { cp, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";

const REPO_ROOT = resolve(import.meta.dirname, "..");
const SOURCE_REPO = "macalinao/coda";

/** Entries of the output directory that are allowed to exist beforehand. */
const PRESERVED_OUTPUT_ENTRIES = new Set([".git", "bun.lock"]);

/** Build, install and local artifacts that are never exported. */
const EXCLUDED_ENTRIES = new Set([
  "node_modules",
  "dist",
  ".turbo",
  "tsconfig.tsbuildinfo",
  "bun.lock",
]);

function parseArgs(argv: string[]): { outDir: string; sourceCommit: string } {
  const positional: string[] = [];
  let sourceCommit: string | undefined;
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === "--source-commit") {
      sourceCommit = argv[++index];
    } else if (arg !== undefined) {
      positional.push(arg);
    }
  }
  const [outDir] = positional;
  if (outDir === undefined || positional.length !== 1) {
    throw new Error(
      "Usage: bun scripts/export-solana-programs.ts <out-dir> [--source-commit <sha>]",
    );
  }
  return {
    outDir: resolve(outDir),
    sourceCommit:
      sourceCommit ??
      execFileSync("git", ["rev-parse", "HEAD"], {
        cwd: REPO_ROOT,
        encoding: "utf-8",
      }).trim(),
  };
}

async function copyTree(from: string, to: string): Promise<void> {
  await cp(from, to, {
    recursive: true,
    filter: (source) => !EXCLUDED_ENTRIES.has(basename(source)),
  });
}

function renderReadme(
  sourceCommit: string,
  packages: { name: string; path: string }[],
): string {
  const commitUrl = `https://github.com/${SOURCE_REPO}/commit/${sourceCommit}`;
  return `# solana-programs

TypeScript clients for Solana programs, one npm package per program, plus umbrella packages that re-export a protocol's programs.

> [!IMPORTANT]
> This repository is **generated** from [${SOURCE_REPO}](https://github.com/${SOURCE_REPO}) at [\`${sourceCommit.slice(0, 7)}\`](${commitUrl}). Do not edit it by hand: change \`programs/\` in ${SOURCE_REPO} instead. Releases are cut and published from ${SOURCE_REPO}; the versions, changelogs and \`graph/\` here are the release state it diffs against.

## Layout

- \`packages/<protocol>/<program>/\`: one package per program. \`packages/<protocol>/\`: the protocol's umbrella package, if it has one.
- \`graph/codama.json\`: every program merged into one Codama graph. \`graph/packages.json\` lists each program's protocol and package, the programs it links to, and the umbrellas.
- \`programs/<protocol>/<program>/\`: the generator's inputs (Anchor IDL, \`program.config.ts\`), for reference. They need the coda tooling to run.

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

async function findPackages(
  root: string,
  dir: string,
  depth: number,
): Promise<{ name: string; path: string }[]> {
  const found: { name: string; path: string }[] = [];
  for (const entry of await readdir(join(root, dir), { withFileTypes: true })) {
    if (!entry.isDirectory() || EXCLUDED_ENTRIES.has(entry.name)) {
      continue;
    }
    const path = join(dir, entry.name);
    try {
      const manifest = JSON.parse(
        await readFile(join(root, path, "package.json"), "utf-8"),
      ) as { name: string };
      found.push({ name: manifest.name, path });
    } catch {
      // Protocol directories without an umbrella have no manifest.
    }
    if (depth > 1) {
      found.push(...(await findPackages(root, path, depth - 1)));
    }
  }
  return found;
}

async function main(): Promise<void> {
  const { outDir, sourceCommit } = parseArgs(process.argv.slice(2));
  await mkdir(outDir, { recursive: true });
  const unexpected = (await readdir(outDir)).filter(
    (entry) => !PRESERVED_OUTPUT_ENTRIES.has(entry),
  );
  if (unexpected.length > 0) {
    throw new Error(
      `${outDir} must be empty apart from ${[...PRESERVED_OUTPUT_ENTRIES].join(", ")}; found ${unexpected.join(", ")}`,
    );
  }

  const clientsDir = join(REPO_ROOT, "clients");
  const graphDir = join(REPO_ROOT, "graph");
  try {
    await readFile(join(clientsDir, "package.json"));
    await readFile(join(graphDir, "codama.json"));
  } catch {
    throw new Error(
      "clients/ or graph/ is missing; run `bun run codegen` first",
    );
  }

  await copyTree(clientsDir, outDir);
  await copyTree(graphDir, join(outDir, "graph"));
  await copyTree(join(REPO_ROOT, "programs"), join(outDir, "programs"));

  const packages = (await findPackages(outDir, "packages", 2)).toSorted(
    (a, b) => a.name.localeCompare(b.name),
  );
  await writeFile(
    join(outDir, "README.md"),
    renderReadme(sourceCommit, packages),
  );
  console.log(
    `Exported ${packages.length.toString()} packages from ${SOURCE_REPO}@${sourceCommit.slice(0, 7)} to ${outDir}`,
  );
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
