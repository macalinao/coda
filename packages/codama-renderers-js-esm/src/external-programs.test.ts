/// <reference types="bun" />

import { describe, expect, test } from "bun:test";
import { mkdtemp, readdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  accountValueNode,
  constantPdaSeedNodeFromString,
  definedTypeNode,
  instructionAccountNode,
  instructionNode,
  numberTypeNode,
  pdaLinkNode,
  pdaNode,
  pdaSeedValueNode,
  pdaValueNode,
  programNode,
  publicKeyTypeNode,
  rootNode,
  variablePdaSeedNode,
  visit,
} from "codama";
import { filterBarrel, getExternalLinkOverrides } from "./external-programs.ts";
import { renderESMTypeScriptVisitor } from "./render-esm-typescript-visitor.ts";

const externalProgram = programNode({
  name: "tokenMetadata",
  publicKey: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
  pdas: [
    pdaNode({
      name: "metadata",
      seeds: [
        constantPdaSeedNodeFromString("utf8", "metadata"),
        variablePdaSeedNode("mint", publicKeyTypeNode()),
      ],
    }),
  ],
  definedTypes: [
    definedTypeNode({ name: "creator", type: numberTypeNode("u8") }),
  ],
});

function makeLocalProgram(extraPdaName?: string) {
  return programNode({
    name: "bubblegum",
    publicKey: "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY",
    pdas: extraPdaName ? [pdaNode({ name: extraPdaName, seeds: [] })] : [],
    // Same name as the external type: must stay local.
    definedTypes: [
      definedTypeNode({ name: "creator", type: numberTypeNode("u16") }),
    ],
    instructions: [
      instructionNode({
        name: "verifyCollection",
        accounts: [
          instructionAccountNode({
            name: "collectionMint",
            isSigner: false,
            isWritable: false,
          }),
          instructionAccountNode({
            name: "collectionMetadata",
            isSigner: false,
            isWritable: true,
            defaultValue: pdaValueNode(
              pdaLinkNode("metadata", "tokenMetadata"),
              [pdaSeedValueNode("mint", accountValueNode("collectionMint"))],
            ),
          }),
        ],
      }),
    ],
  });
}

describe("getExternalLinkOverrides", () => {
  test("maps program-qualified links to the owning module", () => {
    const overrides = getExternalLinkOverrides([makeLocalProgram()], {
      tokenMetadata: "@solana-programs/token-metadata",
    });
    expect(overrides.pdas).toEqual({
      metadata: "@solana-programs/token-metadata",
    });
    expect(overrides.definedTypes).toEqual({});
  });

  test("throws when a linked name is also declared locally", () => {
    expect(() =>
      getExternalLinkOverrides([makeLocalProgram("metadata")], {
        tokenMetadata: "@solana-programs/token-metadata",
      }),
    ).toThrow(/local node of the same kind is also named "metadata"/);
  });
});

describe("filterBarrel", () => {
  test("drops removed targets and duplicates", () => {
    const code = [
      "/** header */",
      "export * from './a.ts';",
      "export * from './b.ts';",
      "export * from './a.ts';",
    ].join("\n");
    expect(filterBarrel(code, (target) => target !== "b.ts")).toBe(
      ["/** header */", "export * from './a.ts';"].join("\n"),
    );
  });

  test("returns null when nothing is left to export", () => {
    expect(filterBarrel("export * from './a.ts';", () => false)).toBeNull();
  });
});

describe("renderESMTypeScriptVisitor with externalPrograms", () => {
  test("imports linked nodes from the owning package and drops its files", async () => {
    const outDir = await mkdtemp(join(tmpdir(), "coda-esm-external-"));
    visit(
      rootNode(makeLocalProgram(), [externalProgram]),
      renderESMTypeScriptVisitor(outDir, {
        externalPrograms: {
          tokenMetadata: "@solana-programs/token-metadata",
        },
      }),
    );

    const instruction = await readFile(
      join(outDir, "instructions", "verifyCollection.ts"),
      "utf-8",
    );
    expect(instruction).toContain(
      "import { findMetadataPda } from '@solana-programs/token-metadata';",
    );

    expect((await readdir(join(outDir, "programs"))).toSorted()).toEqual([
      "bubblegum.ts",
      "index.ts",
    ]);
    // The pdas directory only held the external PDA.
    expect(await readdir(outDir)).not.toContain("pdas");
    const rootBarrel = await readFile(join(outDir, "index.ts"), "utf-8");
    expect(rootBarrel).not.toContain("pdas");

    // The local `creator` type wins over the external one with the same name.
    const creator = await readFile(
      join(outDir, "types", "creator.ts"),
      "utf-8",
    );
    expect(creator).toContain("getU16Encoder");
  });
});
