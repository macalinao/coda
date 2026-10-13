import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { loadPrograms } from "@macalinao/megagraph";
import { Glob } from "bun";
import megagraph from "./megagraph.config.ts";
import * as programs from "./index.ts";

const dir = import.meta.dirname;
const { protocols, programs: sources, externals } = await loadPrograms(dir);

function camelCase(name: string): string {
  return name.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase());
}

async function importDefault(path: string): Promise<unknown> {
  const imported = (await import(pathToFileURL(join(dir, path)).href)) as {
    default: unknown;
  };
  return imported.default;
}

async function scan(pattern: string): Promise<string[]> {
  return (
    await Array.fromAsync(new Glob(pattern).scan({ cwd: dir }))
  ).toSorted();
}

/** Keys of release metadata, which must never be part of a definition. */
const RELEASE_KEYS = [
  "package",
  "version",
  "releaseNotes",
  "keywords",
  "umbrella",
];

const exported = programs as unknown as Record<
  string,
  Record<string, unknown> | undefined
>;

describe("package exports", () => {
  test("every protocol is exported", () => {
    expect(Object.keys(programs).toSorted()).toEqual(
      protocols.map((source) => camelCase(source.protocol)).toSorted(),
    );
  });

  for (const source of protocols) {
    test(`${source.protocol} exports its definition and every program`, () => {
      const namespace = exported[camelCase(source.protocol)];
      expect(namespace?.protocol).toBe(source.definition);
      const programNames = [...sources, ...externals]
        .filter((program) => program.protocol === source.protocol)
        .map((program) => camelCase(program.program));
      expect(Object.keys(namespace ?? {}).toSorted()).toEqual(
        ["protocol", ...programNames].toSorted(),
      );
    });
  }

  for (const source of [...sources, ...externals]) {
    test(`${source.slug} exports its definition, handles and IDL`, async () => {
      const namespace = exported[camelCase(source.protocol)]?.[
        camelCase(source.program)
      ] as Record<string, unknown> | undefined;
      expect(namespace?.definition).toBe(source.definition);
      expect(namespace?.idl).toBe(source.definition.idl);
      expect(source.definition.idl).toEqual(
        JSON.parse(await readFile(join(source.dir, "idl.json"), "utf-8")),
      );
      if ("program" in source.definition) {
        expect(namespace?.program).toBe(source.definition.program);
      }
      expect(Object.keys(namespace ?? {})).not.toContain("release");
    });
  }
});

describe("definitions", () => {
  test("carry no release metadata", () => {
    for (const { definition } of [...protocols, ...sources, ...externals]) {
      for (const key of RELEASE_KEYS) {
        expect(definition).not.toHaveProperty(key);
      }
    }
  });

  test("every program directory is listed in megagraph.config.ts", async () => {
    const definitions = await Promise.all(
      (await scan("*/*/program.config.ts")).map(importDefault),
    );
    const listed = new Set<unknown>([
      ...sources.map((source) => source.definition),
      ...externals.map((source) => source.definition),
    ]);
    expect(definitions.filter((definition) => !listed.has(definition))).toEqual(
      [],
    );
    expect(definitions.length).toBe(listed.size);
  });

  test("every release config is listed in megagraph.config.ts", async () => {
    const releases = await Promise.all(
      (await scan("**/release.config.ts")).map(importDefault),
    );
    const listed = new Set<unknown>([
      ...megagraph.programs,
      ...megagraph.protocols,
    ]);
    expect(releases.filter((release) => !listed.has(release))).toEqual([]);
    expect(releases.length).toBe(listed.size);
  });
});

describe("published files", () => {
  test("release metadata is not published", async () => {
    const manifest = JSON.parse(
      await readFile(join(dir, "..", "package.json"), "utf-8"),
    ) as { files: string[] };
    expect(manifest.files).toContain("!src/**/release.config.ts");
    expect(manifest.files).toContain("!src/megagraph.config.ts");
  });
});
