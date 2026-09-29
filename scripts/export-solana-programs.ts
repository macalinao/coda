#!/usr/bin/env bun
/**
 * Assembles the standalone github.com/toolboxdao/solana-programs repository
 * from this repository's program data and generated packages.
 *
 *   bun scripts/export-solana-programs.ts <out-dir> [--source-commit <sha>]
 *
 * The export contains programs/, graph/, every generated package under
 * packages/<slug>/ (from clients/<slug>/), and the scaffolding needed for
 * `bun install && bun run build` to work there on its own. It is output only:
 * the export cannot regenerate itself, since the generator lives here.
 *
 * `<out-dir>` must be empty apart from `.git` and `bun.lock` (a lockfile from
 * a previous sync is kept so that `bun install` only re-resolves what
 * changed). No dependencies beyond Node's standard library.
 */
import { execFileSync } from "node:child_process";
import {
  cp,
  mkdir,
  readdir,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises";
import { basename, join, resolve } from "node:path";

const REPO_ROOT = resolve(import.meta.dirname, "..");
const SOURCE_REPO = "macalinao/coda";
const TARGET_REPO = "toolboxdao/solana-programs";

/** Entries of the output directory that are allowed to exist beforehand. */
const PRESERVED_OUTPUT_ENTRIES = new Set([".git", "bun.lock"]);

/** Build and install artifacts that are never exported. */
const EXCLUDED_ENTRIES = new Set([
  "node_modules",
  "dist",
  ".turbo",
  "tsconfig.tsbuildinfo",
]);

/** Files copied verbatim from the root of this repository. */
const ROOT_FILES = [
  "LICENSE",
  "bunfig.toml",
  ".oxfmtrc.json",
  "tsdown.config.ts",
];

type Manifest = Record<string, unknown> & {
  name: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

/** Dependencies that only resolve inside the coda monorepo. */
const CODA_ONLY_DEPENDENCY = /^@macalinao\/(?!tsconfig$)/;

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

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf-8")) as T;
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

async function assertExportable(outDir: string): Promise<void> {
  await mkdir(outDir, { recursive: true });
  const unexpected = (await readdir(outDir)).filter(
    (entry) => !PRESERVED_OUTPUT_ENTRIES.has(entry),
  );
  if (unexpected.length > 0) {
    throw new Error(
      `${outDir} must be empty apart from ${[...PRESERVED_OUTPUT_ENTRIES].join(", ")}; found ${unexpected.join(", ")}`,
    );
  }
}

async function copyTree(from: string, to: string): Promise<void> {
  await cp(from, to, {
    recursive: true,
    filter: (source) => !EXCLUDED_ENTRIES.has(basename(source)),
  });
}

/** Removes everything from a client manifest that only works inside coda. */
function rewriteManifest(manifest: Manifest, slug: string): Manifest {
  const withoutCodaOnly = (dependencies?: Record<string, string>) =>
    dependencies === undefined
      ? undefined
      : Object.fromEntries(
          Object.entries(dependencies).filter(
            ([name]) => !CODA_ONLY_DEPENDENCY.test(name),
          ),
        );
  const scripts = Object.fromEntries(
    Object.entries(manifest.scripts ?? {}).filter(
      ([name, command]) => name !== "codegen" && !command.includes("coda"),
    ),
  );
  const rewritten: Manifest = {
    ...manifest,
    scripts,
    repository: {
      type: "git",
      url: `git+https://github.com/${TARGET_REPO}.git`,
      directory: `packages/${slug}`,
    },
  };
  for (const key of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
  ] as const) {
    const filtered = withoutCodaOnly(manifest[key]);
    if (filtered === undefined || Object.keys(filtered).length === 0) {
      delete rewritten[key];
    } else {
      rewritten[key] = filtered;
    }
  }
  return rewritten;
}

function renderReadme(sourceCommit: string, packages: Manifest[]): string {
  const commitUrl = `https://github.com/${SOURCE_REPO}/commit/${sourceCommit}`;
  return `# solana-programs

TypeScript clients for Solana programs, one npm package per program.

> [!IMPORTANT]
> This repository is **generated** from [${SOURCE_REPO}](https://github.com/${SOURCE_REPO}) at [\`${sourceCommit.slice(0, 7)}\`](${commitUrl}). Do not edit it by hand: change \`programs/\` in ${SOURCE_REPO} instead, and the next sync overwrites everything here.

## Layout

- \`programs/<slug>/\`: each program's Anchor IDL (\`idl.json\`) and Coda config (\`program.config.ts\`), plus the umbrella packages in \`programs/bundles.ts\`. These are the generator's inputs, kept for reference; they need the coda tooling to run.
- \`graph/codama.json\`: every program merged into one Codama graph. \`graph/packages.json\` lists each program's package and the programs it links to.
- \`packages/<slug>/\`: the generated packages.

## Development

\`\`\`bash
bun install
bun run build
\`\`\`

## Packages

${packages.map((manifest) => `- [\`${manifest.name}\`](https://www.npmjs.com/package/${manifest.name})`).join("\n")}

## License

Copyright © 2025 Ian Macalinao

Licensed under the Apache License, Version 2.0
`;
}

async function main(): Promise<void> {
  const { outDir, sourceCommit } = parseArgs(process.argv.slice(2));
  await assertExportable(outDir);

  const rootManifest = await readJson<{
    packageManager: string;
    engines: Record<string, string>;
    workspaces: { catalog: Record<string, string> };
    devDependencies: Record<string, string>;
  }>(join(REPO_ROOT, "package.json"));

  await copyTree(join(REPO_ROOT, "programs"), join(outDir, "programs"));
  await copyTree(join(REPO_ROOT, "graph"), join(outDir, "graph"));
  for (const file of ROOT_FILES) {
    await cp(join(REPO_ROOT, file), join(outDir, file));
  }

  // Generated packages, and the catalog entries their manifests use.
  const clientsDir = join(REPO_ROOT, "clients");
  const slugs = (await readdir(clientsDir)).toSorted();
  const manifests: Manifest[] = [];
  const catalogNames = new Set<string>();
  for (const slug of slugs) {
    const clientDir = join(clientsDir, slug);
    if (!(await stat(clientDir)).isDirectory()) {
      continue;
    }
    const packageDir = join(outDir, "packages", slug);
    await copyTree(clientDir, packageDir);
    const manifest = rewriteManifest(
      await readJson<Manifest>(join(clientDir, "package.json")),
      slug,
    );
    await writeJson(join(packageDir, "package.json"), manifest);
    manifests.push(manifest);
    for (const dependencies of [
      manifest.dependencies,
      manifest.devDependencies,
    ]) {
      for (const [name, version] of Object.entries(dependencies ?? {})) {
        if (version === "catalog:") {
          catalogNames.add(name);
        }
      }
    }
  }

  const catalog = Object.fromEntries(
    [...catalogNames].toSorted().map((name) => {
      const version = rootManifest.workspaces.catalog[name];
      if (version === undefined) {
        throw new Error(
          `No catalog entry for ${name} in the root package.json`,
        );
      }
      return [name, version];
    }),
  );
  const devDependency = (name: string): string => {
    const version = rootManifest.devDependencies[name];
    if (version === undefined) {
      throw new Error(`No devDependency ${name} in the root package.json`);
    }
    return version;
  };

  await writeJson(join(outDir, "package.json"), {
    name: "solana-programs",
    private: true,
    type: "module",
    license: "Apache-2.0",
    author: "Ian Macalinao <me@ianm.com>",
    repository: {
      type: "git",
      url: `git+https://github.com/${TARGET_REPO}.git`,
    },
    workspaces: {
      packages: ["packages/*"],
      catalog,
    },
    scripts: {
      build: "bun run --filter './packages/*' build",
      lint: "oxfmt --check",
      format: "oxfmt",
    },
    devDependencies: {
      oxfmt: devDependency("oxfmt"),
      tsdown: devDependency("tsdown"),
      typescript: devDependency("typescript"),
    },
    packageManager: rootManifest.packageManager,
    engines: rootManifest.engines,
  });

  await writeFile(
    join(outDir, ".gitattributes"),
    [
      "packages/*/src/generated/** linguist-generated=true",
      "packages/*/docs/** linguist-generated=true",
      "graph/codama.json linguist-generated=true",
      "graph/packages.json linguist-generated=true",
      "",
    ].join("\n"),
  );
  await writeFile(
    join(outDir, ".gitignore"),
    [
      "node_modules/",
      "dist/",
      ".turbo/",
      "*.tsbuildinfo",
      ".DS_Store",
      "",
    ].join("\n"),
  );
  await writeFile(
    join(outDir, "README.md"),
    renderReadme(sourceCommit, manifests),
  );

  console.log(
    `Exported ${manifests.length.toString()} packages from ${SOURCE_REPO}@${sourceCommit.slice(0, 7)} to ${outDir}`,
  );
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
