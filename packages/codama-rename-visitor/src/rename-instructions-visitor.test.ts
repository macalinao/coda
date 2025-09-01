/// <reference types="bun-types" />

import type { ProgramNode, RootNode } from "codama";
import { describe, expect, it } from "bun:test";
import {
  camelCase,
  instructionAccountNode,
  instructionNode,
  programNode,
  rootNode,
  visit,
} from "codama";
import { renameInstructionsVisitor } from "./rename-instructions-visitor.js";

describe("renameInstructionsVisitor", () => {
  it("should rename instructions based on the mapping", () => {
    const program: ProgramNode = programNode({
      name: camelCase("testProgram"),
      publicKey: "11111111111111111111111111111111",
      instructions: [
        instructionNode({
          name: camelCase("transfer"),
          accounts: [
            instructionAccountNode({
              name: camelCase("source"),
              isWritable: true,
              isSigner: false,
            }),
            instructionAccountNode({
              name: camelCase("destination"),
              isWritable: true,
              isSigner: false,
            }),
          ],
        }),
        instructionNode({
          name: camelCase("mint"),
          accounts: [
            instructionAccountNode({
              name: camelCase("mint"),
              isWritable: true,
              isSigner: false,
            }),
          ],
        }),
      ],
    });

    const root = rootNode(program);
    const visitor = renameInstructionsVisitor({
      transfer: "transferTokens",
      mint: "mintNft",
    });

    const updatedRoot = visit(root, visitor) as RootNode;
    const instructions = updatedRoot.program.instructions;

    expect(instructions[0].name.toString()).toBe("transferTokens");
    expect(instructions[1].name.toString()).toBe("mintNft");
  });

  it("should leave unmapped instructions unchanged", () => {
    const program: ProgramNode = programNode({
      name: camelCase("testProgram"),
      publicKey: "11111111111111111111111111111111",
      instructions: [
        instructionNode({
          name: camelCase("burn"),
          accounts: [],
        }),
      ],
    });

    const root = rootNode(program);
    const visitor = renameInstructionsVisitor({
      transfer: "transferTokens",
    });

    const updatedRoot = visit(root, visitor) as RootNode;
    const instructions = updatedRoot.program.instructions;

    expect(instructions[0].name.toString()).toBe("burn");
  });
});
