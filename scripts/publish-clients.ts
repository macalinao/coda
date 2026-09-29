#!/usr/bin/env bun
/**
 * Publishes every package of a solana-programs checkout whose version is not
 * on npm yet.
 *
 *   bun scripts/publish-clients.ts <mirror-dir> [--dry-run]
 *
 * Run after `bun install` in <mirror-dir>. Each package is packed with
 * `bun pm pack`, which resolves `workspace:` and `catalog:` ranges, and
 * published with `npm publish --provenance` (npm trusted publishing via
 * GitHub OIDC). Dependencies are published before their dependents. Because
 * the release commit is pushed to the mirror before publishing, a failed
 * publish is retried by the next run: the version is still ahead of npm.
 */
import { spawnSync } from "node:child_process";
import { mkdtemp, readdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

interface Package {
  dir: string;
  name: string;
  version: string;
  dependencies: string[];
}

async function findPackages(dir: string, depth: number): Promise<Package[]> {
  const found: Package[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "node_modules") {
      continue;
    }
    const child = join(dir, entry.name);
    try {
      const manifest = JSON.parse(
        await readFile(join(child, "package.json"), "utf-8"),
      ) as {
        name: string;
        version: string;
        private?: boolean;
        dependencies?: Record<string, string>;
      };
      if (manifest.private !== true) {
        found.push({
          dir: child,
          name: manifest.name,
          version: manifest.version,
          dependencies: Object.keys(manifest.dependencies ?? {}),
        });
      }
    } catch {
      // Protocol directories without an umbrella have no manifest.
    }
    if (depth > 1) {
      found.push(...(await findPackages(child, depth - 1)));
    }
  }
  return found;
}

/** Orders packages so that each comes after its dependencies. */
function topologicalOrder(packages: Package[]): Package[] {
  const byName = new Map(packages.map((entry) => [entry.name, entry]));
  const ordered: Package[] = [];
  const seen = new Set<string>();
  const visit = (entry: Package) => {
    if (seen.has(entry.name)) {
      return;
    }
    seen.add(entry.name);
    for (const dependency of entry.dependencies) {
      const target = byName.get(dependency);
      if (target !== undefined) {
        visit(target);
      }
    }
    ordered.push(entry);
  };
  for (const entry of packages.toSorted((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    visit(entry);
  }
  return ordered;
}

function run(command: string, args: string[], cwd?: string) {
  return spawnSync(command, args, { cwd, encoding: "utf-8" });
}

function isPublished(entry: Package): boolean {
  const result = run("npm", [
    "view",
    `${entry.name}@${entry.version}`,
    "version",
  ]);
  return result.status === 0 && result.stdout.trim() === entry.version;
}

async function main(): Promise<void> {
  const mirrorArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
  const dryRun = process.argv.includes("--dry-run");
  if (mirrorArg === undefined) {
    throw new Error(
      "Usage: bun scripts/publish-clients.ts <mirror-dir> [--dry-run]",
    );
  }
  const packages = topologicalOrder(
    await findPackages(join(resolve(mirrorArg), "packages"), 2),
  );

  const pending = packages.filter((entry) => !isPublished(entry));
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
    const destination = await mkdtemp(join(tmpdir(), "solana-programs-pack-"));
    const pack = run(
      process.execPath,
      ["pm", "pack", "--destination", destination],
      entry.dir,
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
      `${failed.length.toString()} package(s) failed to publish: ${failed.join(", ")}. New package names need a bootstrap publish and an npm trusted publisher for macalinao/coda's release-clients.yml before OIDC publishing works.`,
    );
  }
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
