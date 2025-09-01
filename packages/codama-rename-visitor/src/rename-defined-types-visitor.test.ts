/// <reference types="bun-types" />

import type { ProgramNode, RootNode } from "codama";
import { describe, expect, it } from "bun:test";
import {
  camelCase,
  definedTypeNode,
  numberTypeNode,
  programNode,
  publicKeyTypeNode,
  rootNode,
  visit,
} from "codama";
import { renameDefinedTypesVisitor } from "./rename-defined-types-visitor.js";

describe("renameDefinedTypesVisitor", () => {
  it("should rename defined types based on the mapping", () => {
    const program: ProgramNode = programNode({
      name: camelCase("testProgram"),
      publicKey: "11111111111111111111111111111111",
      definedTypes: [
        definedTypeNode({
          name: camelCase("counter"),
          type: numberTypeNode("u64"),
        }),
        definedTypeNode({
          name: camelCase("config"),
          type: publicKeyTypeNode(),
        }),
      ],
    });

    const root = rootNode(program);
    const visitor = renameDefinedTypesVisitor({
      counter: "counterAccount",
      config: "programConfig",
    });

    const updatedRoot = visit(root, visitor) as RootNode;
    const types = updatedRoot.program.definedTypes;

    expect(types[0].name.toString()).toBe("counterAccount");
    expect(types[1].name.toString()).toBe("programConfig");
  });
});
