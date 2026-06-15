import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ensureEntryBarrel } from "./ensure-entry-barrel.js";

const BARREL = 'export * from "./generated/index.js";\n';

async function makeGeneratedDir(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "coda-barrel-"));
  const generated = join(root, "src", "generated");
  await mkdir(generated, { recursive: true });
  return generated;
}

describe("ensureEntryBarrel", () => {
  test("creates a sibling index.ts re-exporting the generated barrel", async () => {
    const generated = await makeGeneratedDir();

    const written = await ensureEntryBarrel(generated);

    const expected = join(generated, "..", "index.ts");
    expect(written).toBe(expected);
    expect(await readFile(expected, "utf-8")).toBe(BARREL);
  });

  test("does not overwrite an existing entry file", async () => {
    const generated = await makeGeneratedDir();
    const entry = join(generated, "..", "index.ts");
    const custom =
      'export * from "./generated/index.js";\nexport const custom = 1;\n';
    await writeFile(entry, custom, "utf-8");

    const written = await ensureEntryBarrel(generated);

    expect(written).toBeNull();
    expect(await readFile(entry, "utf-8")).toBe(custom);
  });

  test("does nothing when the output dir is not the conventional generated/ layout", async () => {
    const root = await mkdtemp(join(tmpdir(), "coda-barrel-"));
    const output = join(root, "src");
    await mkdir(output, { recursive: true });

    const written = await ensureEntryBarrel(output);

    expect(written).toBeNull();
  });
});
