import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolveIdlPaths } from "./resolve-idl-paths.ts";

async function makeIdlDir(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "coda-idls-"));
  await mkdir(join(root, "idls"));
  await writeFile(join(root, "idls", "b.json"), "{}");
  await writeFile(join(root, "idls", "a.json"), "{}");
  await writeFile(join(root, "idl.json"), "{}");
  return root;
}

describe("resolveIdlPaths", () => {
  test("resolves globs against baseDir instead of the working directory", async () => {
    const root = await makeIdlDir();

    const paths = await resolveIdlPaths("./idls/*.json", { baseDir: root });

    expect(paths).toEqual([
      join(root, "idls", "a.json"),
      join(root, "idls", "b.json"),
    ]);
  });

  test("resolves plain paths and arrays against baseDir", async () => {
    const root = await makeIdlDir();

    const paths = await resolveIdlPaths(["./idl.json", "idls/a.json"], {
      baseDir: root,
    });

    expect(paths).toEqual([
      join(root, "idl.json"),
      join(root, "idls", "a.json"),
    ]);
  });
});
