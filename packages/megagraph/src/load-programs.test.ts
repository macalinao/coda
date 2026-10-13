import type { AnchorIdl } from "@codama/nodes-from-anchor";
import type { ProgramDefinition } from "./define-program.ts";
import type { MegagraphConfig } from "./define-release.ts";
import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { programHandle } from "@macalinao/coda";
import { defineProgram, defineProtocol } from "./define-program.ts";
import {
  defineProgramRelease,
  defineProtocolRelease,
} from "./define-release.ts";
import { resolvePrograms } from "./load-programs.ts";

const quarry = defineProtocol({
  name: "quarry",
  displayName: "Quarry",
  description: "Liquidity mining.",
});

function program(name: string, protocol = quarry): ProgramDefinition {
  return defineProgram({
    protocol,
    name,
    program: programHandle(name),
    idl: {} as AnchorIdl,
  });
}

function release(definition: ProgramDefinition) {
  return defineProgramRelease({
    program: definition,
    package: { description: "client", version: "0.1.0" },
  });
}

async function programsDir(...slugs: string[]): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "megagraph-load-"));
  for (const slug of slugs) {
    await mkdir(join(dir, slug), { recursive: true });
  }
  return dir;
}

function config(
  overrides: Partial<Pick<MegagraphConfig, "programs" | "protocols">>,
): Pick<MegagraphConfig, "programs" | "externals" | "protocols"> {
  return { programs: [], externals: [], protocols: [], ...overrides };
}

describe("resolvePrograms", () => {
  test("resolves listed programs to their directories, sorted by path", async () => {
    const dir = await programsDir("quarry/mine", "quarry/mine-v2");
    const mineV2 = release(program("mine-v2"));
    const mine = release(program("mine"));
    const protocol = defineProtocolRelease({
      protocol: quarry,
      keywords: ["q"],
    });
    const { programs, protocols } = resolvePrograms(
      config({ programs: [mineV2, mine], protocols: [protocol] }),
      dir,
    );
    // Like their directories' paths: "quarry/mine-v2/" < "quarry/mine/".
    expect(programs.map((source) => source.slug)).toEqual([
      "quarry/mine-v2",
      "quarry/mine",
    ]);
    expect(programs[1]?.dir).toBe(join(dir, "quarry/mine"));
    expect(programs[1]?.packageName).toBe("@solana-programs/quarry-mine");
    expect(protocols).toEqual([
      {
        protocol: "quarry",
        dir: join(dir, "quarry"),
        definition: quarry,
        release: protocol,
      },
    ]);
  });

  test("fails on a missing program directory", async () => {
    const dir = await programsDir();
    expect(() =>
      resolvePrograms(config({ programs: [release(program("mine"))] }), dir),
    ).toThrow("programs/src/quarry/mine: missing directory");
  });

  test("fails on a program listed twice", async () => {
    const dir = await programsDir("quarry/mine");
    const mine = release(program("mine"));
    expect(() =>
      resolvePrograms(config({ programs: [mine, mine] }), dir),
    ).toThrow("listed more than once");
  });

  test("fails on names that are not kebab-case", async () => {
    const dir = await programsDir("quarry/mergeMine");
    expect(() =>
      resolvePrograms(
        config({ programs: [release(program("mergeMine"))] }),
        dir,
      ),
    ).toThrow('Program name must be kebab-case: "mergeMine"');
  });

  test("fails on two protocol definitions with the same name", async () => {
    const dir = await programsDir("quarry/mine", "quarry/registry");
    const other = defineProtocol({ ...quarry });
    expect(() =>
      resolvePrograms(
        config({
          programs: [
            release(program("mine")),
            release(program("registry", other)),
          ],
        }),
        dir,
      ),
    ).toThrow('Two different protocol definitions are named "quarry"');
  });

  test("fails on a release of an unlisted protocol", async () => {
    const dir = await programsDir();
    expect(() =>
      resolvePrograms(
        config({ protocols: [defineProtocolRelease({ protocol: quarry })] }),
        dir,
      ),
    ).toThrow('The release of protocol "quarry" does not belong');
  });
});
