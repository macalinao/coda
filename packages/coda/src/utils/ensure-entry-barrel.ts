import { writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { fileExists } from "./file-exists.js";

/**
 * Ensure a barrel entry module re-exports the generated client.
 *
 * `coda generate` only writes the `generated/` directory. Packages typically
 * compile their published entry point (e.g. `dist/index.js`) from
 * `src/index.ts`, so without a sibling barrel the entry is never produced --
 * `tsc` succeeds but emits no entry file, and the published package resolves to
 * nothing. When the output follows the conventional `.../generated` layout and
 * no sibling `index.ts` already exists, scaffold one that re-exports the
 * generated barrel.
 *
 * Existing entry files are never overwritten, so clients with custom exports
 * are left untouched.
 *
 * @param outputPath - Absolute path the client was generated to.
 * @returns The path written, or `null` if nothing was created.
 */
export async function ensureEntryBarrel(
  outputPath: string,
): Promise<string | null> {
  if (basename(outputPath) !== "generated") {
    return null;
  }

  const entryPath = resolve(outputPath, "..", "index.ts");
  if (await fileExists(entryPath)) {
    return null;
  }

  await writeFile(
    entryPath,
    'export * from "./generated/index.js";\n',
    "utf-8",
  );
  return entryPath;
}
