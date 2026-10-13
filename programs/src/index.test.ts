import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { loadPrograms } from "@macalinao/megagraph";
import * as programs from "./index.ts";

const {
  protocols,
  programs: sources,
  externals,
} = await loadPrograms(import.meta.dirname);

function camelCase(name: string): string {
  return name.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase());
}

interface ProgramExports {
  config: unknown;
  idl: unknown;
}

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
    test(`${source.protocol} exports its config and every program`, () => {
      const namespace = exported[camelCase(source.protocol)];
      expect(namespace?.protocol).toBe(source.config);
      const programNames = [...sources, ...externals]
        .filter((program) => program.protocol === source.protocol)
        .map((program) => camelCase(program.program));
      expect(Object.keys(namespace ?? {}).toSorted()).toEqual(
        ["protocol", ...programNames].toSorted(),
      );
    });
  }

  for (const source of [...sources, ...externals]) {
    test(`${source.slug} exports its config and IDL`, async () => {
      const namespace = exported[camelCase(source.protocol)]?.[
        camelCase(source.program)
      ] as ProgramExports | undefined;
      const configModule = (await import(
        pathToFileURL(join(source.dir, "program.config.ts")).href
      )) as { default: unknown };
      expect(namespace?.config).toBe(configModule.default);
      expect(namespace?.idl).toEqual(
        JSON.parse(await readFile(join(source.dir, "idl.json"), "utf-8")),
      );
    });
  }
});
