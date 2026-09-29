#!/usr/bin/env bun
/**
 * Runs a command in the generated clients/ workspace.
 *
 *   bun scripts/clients.ts <install|build|typecheck|test|lint>
 *   bun scripts/clients.ts fingerprint
 *
 * `fingerprint` prints a SHA-256 over every generated file in graph/ and
 * clients/ (not installs or build output), to check codegen idempotence.
 *
 * clients/ is produced by `bun run codegen` and is not committed. It is its
 * own Bun workspace rather than part of this repository's workspaces, so a
 * fresh clone installs without it and every client command runs inside it.
 * When clients/ has not been generated, commands print a notice and succeed,
 * so `bun run build` also works before `bun run codegen`.
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const REPO_ROOT = resolve(import.meta.dirname, "..");
const CLIENTS_DIR = join(REPO_ROOT, "clients");
const NOT_GENERATED = new Set(["node_modules", "dist", ".turbo", "bun.lock"]);

async function listFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (NOT_GENERATED.has(entry.name) || entry.name.endsWith(".tsbuildinfo")) {
      continue;
    }
    const path = join(dir, entry.name);
    files.push(...(entry.isDirectory() ? await listFiles(path) : [path]));
  }
  return files;
}

if (process.argv[2] === "fingerprint") {
  const hash = createHash("sha256");
  const files = [
    ...(await listFiles(join(REPO_ROOT, "graph"))),
    ...(await listFiles(CLIENTS_DIR)),
  ].toSorted();
  for (const file of files) {
    hash.update(relative(REPO_ROOT, file));
    hash.update("\0");
    hash.update(await readFile(file));
    hash.update("\0");
  }
  console.log(`${hash.digest("hex")}  (${files.length.toString()} files)`);
  process.exit(0);
}

const commands: Record<string, string[]> = {
  install: ["install"],
  build: ["run", "build"],
  typecheck: ["run", "typecheck"],
  test: ["run", "test"],
  lint: ["run", "lint"],
};

const name = process.argv[2] ?? "";
const args = commands[name];
if (args === undefined) {
  console.error(
    `Usage: bun scripts/clients.ts <${Object.keys(commands).join("|")}>`,
  );
  process.exit(1);
}
if (!existsSync(join(CLIENTS_DIR, "package.json"))) {
  console.log(
    `clients/ has not been generated; skipping \`${name}\`. Run \`bun run codegen\` first.`,
  );
  process.exit(0);
}
const result = spawnSync(process.execPath, args, {
  cwd: CLIENTS_DIR,
  stdio: "inherit",
});
process.exit(result.status ?? 1);
