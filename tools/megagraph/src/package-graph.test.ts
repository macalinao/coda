import { describe, expect, test } from "bun:test";
import {
  definedTypeLinkNode,
  definedTypeNode,
  instructionAccountNode,
  instructionNode,
  numberTypeNode,
  pdaLinkNode,
  pdaNode,
  pdaValueNode,
  programLinkNode,
  programNode,
  rootNode,
  structFieldTypeNode,
  structTypeNode,
} from "codama";
import {
  findCycles,
  findUnresolvedLinks,
  getLinkedProgramNames,
  getTransitiveDependencies,
} from "./package-graph.ts";

const mine = programNode({
  name: "quarryMine",
  publicKey: "QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB",
  pdas: [pdaNode({ name: "miner", seeds: [] })],
  definedTypes: [
    definedTypeNode({ name: "rate", type: numberTypeNode("u64") }),
    definedTypeNode({
      name: "pool",
      type: structTypeNode([
        // Unqualified: resolves within quarryMine.
        structFieldTypeNode({
          name: "rate",
          type: definedTypeLinkNode("rate"),
        }),
      ]),
    }),
  ],
});

const mergeMine = programNode({
  name: "quarryMergeMine",
  publicKey: "QMMD16kjauP5knBwxNUJRZ1Z5o3deBuFrqVjBVmmqto",
  definedTypes: [
    definedTypeNode({
      name: "config",
      type: structTypeNode([
        structFieldTypeNode({
          name: "rate",
          type: definedTypeLinkNode("rate", "quarryMine"),
        }),
      ]),
    }),
  ],
  pdas: [pdaNode({ name: "mergeMiner", seeds: [] })],
});

describe("getLinkedProgramNames", () => {
  test("returns the programs a program links into, excluding itself", () => {
    expect(getLinkedProgramNames(mine)).toEqual([]);
    expect(getLinkedProgramNames(mergeMine)).toEqual(["quarryMine"]);
  });

  test("counts program links", () => {
    const lending = programNode({
      name: "kaminoLending",
      publicKey: "KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD",
      instructions: [
        instructionNode({
          name: "initFarmsForReserve",
          accounts: [
            instructionAccountNode({
              name: "farmsProgram",
              isSigner: false,
              isWritable: false,
              defaultValue: programLinkNode("farms"),
            }),
          ],
        }),
      ],
    });
    expect(getLinkedProgramNames(lending)).toEqual(["farms"]);
  });
});

describe("findUnresolvedLinks", () => {
  test("accepts links that resolve, qualified or not", () => {
    expect(findUnresolvedLinks(rootNode(mine, [mergeMine]))).toEqual([]);
  });

  test("reports links into a missing program or node", () => {
    const unresolved = findUnresolvedLinks(rootNode(mergeMine));
    expect(unresolved).toHaveLength(1);
    expect(unresolved[0]).toMatchObject({
      kind: "definedTypeLinkNode",
      name: "rate",
      program: "quarryMine",
    });

    const operator = programNode({
      name: "quarryOperator",
      publicKey: "QoP6NfrQbaGnccXQrMLUkog2tQZ4C1RFgJcwDnT8Kmz",
      instructions: [
        instructionNode({
          name: "delegateCreateQuarry",
          accounts: [
            instructionAccountNode({
              name: "quarry",
              isSigner: false,
              isWritable: true,
              // Unqualified, so it points at quarryOperator, which has no
              // `quarry` PDA.
              defaultValue: pdaValueNode(pdaLinkNode("quarry")),
            }),
          ],
        }),
      ],
    });
    expect(findUnresolvedLinks(rootNode(operator, [mine]))).toMatchObject([
      { kind: "pdaLinkNode", name: "quarry", program: undefined },
    ]);
  });
});

describe("findCycles", () => {
  test("returns nothing for a DAG", () => {
    const graph = new Map([
      ["a", ["b", "c"]],
      ["b", ["c"]],
      ["c", []],
    ]);
    expect(findCycles(graph)).toEqual([]);
  });

  test("reports each cycle", () => {
    const graph = new Map([
      ["a", ["b"]],
      ["b", ["c"]],
      ["c", ["a"]],
      ["d", ["d"]],
    ]);
    expect(findCycles(graph)).toEqual([
      ["a", "b", "c", "a"],
      ["d", "d"],
    ]);
  });
});

describe("getTransitiveDependencies", () => {
  test("follows dependencies of dependencies", () => {
    const graph = new Map([
      ["quarryMergeMine", ["quarryMine", "quarryMintWrapper"]],
      ["quarryOperator", ["quarryMine"]],
      ["quarryMine", ["quarryMintWrapper"]],
      ["quarryMintWrapper", []],
    ]);
    expect(getTransitiveDependencies(graph, "quarryOperator")).toEqual([
      "quarryMine",
      "quarryMintWrapper",
    ]);
    expect(getTransitiveDependencies(graph, "quarryMintWrapper")).toEqual([]);
  });
});
