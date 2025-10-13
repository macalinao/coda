/// <reference types="bun" />

import type { ProgramNode, RootNode } from "codama";
import { describe, expect, it } from "bun:test";
import {
  camelCase,
  definedTypeNode,
  instructionNode,
  numberTypeNode,
  programNode,
  rootNode,
  visit,
} from "codama";
import { renameVisitor } from "./rename-visitor.js";

describe("renameVisitor (program-specific format)", () => {
  it("should rename instructions in specific programs", () => {
    const quarryMineProgram: ProgramNode = programNode({
      name: camelCase("quarryMine"),
      publicKey: "11111111111111111111111111111111",
      instructions: [
        instructionNode({
          name: camelCase("claimRewards"),
          accounts: [],
        }),
        instructionNode({
          name: camelCase("stake"),
          accounts: [],
        }),
      ],
    });

    const tokenProgram: ProgramNode = programNode({
      name: camelCase("token"),
      publicKey: "22222222222222222222222222222222",
      instructions: [
        instructionNode({
          name: camelCase("transfer"),
          accounts: [],
        }),
        instructionNode({
          name: camelCase("mint"),
          accounts: [],
        }),
      ],
    });

    // Create a root with multiple programs
    const root = rootNode(quarryMineProgram, [tokenProgram]);

    const visitor = renameVisitor({
      quarryMine: {
        instructions: {
          claimRewards: "claimRewardsMine",
        },
      },
      token: {
        instructions: {
          transfer: "transferTokens",
          mint: "mintNft",
        },
      },
    });

    const updatedRoot = visit(root, visitor) as RootNode;
    const quarryInstructions = updatedRoot.program.instructions;
    const tokenInstructions =
      updatedRoot.additionalPrograms?.[0]?.instructions ?? [];

    expect(quarryInstructions[0].name.toString()).toBe("claimRewardsMine");
    expect(quarryInstructions[1].name.toString()).toBe("stake"); // Unchanged
    expect(tokenInstructions[0].name.toString()).toBe("transferTokens");
    expect(tokenInstructions[1].name.toString()).toBe("mintNft");
  });

  it("should rename defined types in specific programs", () => {
    const program: ProgramNode = programNode({
      name: camelCase("myProgram"),
      publicKey: "11111111111111111111111111111111",
      definedTypes: [
        definedTypeNode({
          name: camelCase("tokenMintedEvent"),
          type: numberTypeNode("u64"),
        }),
        definedTypeNode({
          name: camelCase("counter"),
          type: numberTypeNode("u64"),
        }),
      ],
    });

    const root = rootNode(program);

    const visitor = renameVisitor({
      myProgram: {
        definedTypes: {
          counter: "counterAccount",
          tokenMintedEvent: "nftMintedEvent",
        },
      },
    });

    const updatedRoot = visit(root, visitor) as RootNode;
    const types = updatedRoot.program.definedTypes;

    expect(types[0].name.toString()).toBe("nftMintedEvent");
    expect(types[1].name.toString()).toBe("counterAccount");
  });

  it("should work with Quarry-style program names (camelCase)", () => {
    const quarryMergeMineProgram: ProgramNode = programNode({
      name: camelCase("quarryMergeMine"),
      publicKey: "QMMD16kjauP5knBwxNUJRZ1Z5o3deBuFrqVjBVmmqto",
      instructions: [
        instructionNode({
          name: camelCase("claimRewards"),
          accounts: [],
        }),
        instructionNode({
          name: camelCase("stake"),
          accounts: [],
        }),
      ],
    });

    const root = rootNode(quarryMergeMineProgram);

    const visitor = renameVisitor({
      quarryMergeMine: {
        instructions: {
          claimRewards: "claimRewardsMergeMine",
        },
      },
    });

    const updatedRoot = visit(root, visitor) as RootNode;
    const instructions = updatedRoot.program.instructions;

    expect(instructions[0].name.toString()).toBe("claimRewardsMergeMine");
    expect(instructions[1].name.toString()).toBe("stake"); // Unchanged
  });

  it("should handle mixed program configurations", () => {
    const program: ProgramNode = programNode({
      name: camelCase("testProgram"),
      publicKey: "11111111111111111111111111111111",
      instructions: [
        instructionNode({
          name: camelCase("transfer"),
          accounts: [],
        }),
      ],
      definedTypes: [
        definedTypeNode({
          name: camelCase("transferEvent"),
          type: numberTypeNode("u64"),
        }),
      ],
    });

    const root = rootNode(program);

    const visitor = renameVisitor({
      testProgram: {
        instructions: {
          transfer: "sendTokens",
        },
      },
    });

    const updatedRoot = visit(root, visitor) as RootNode;
    const instructions = updatedRoot.program.instructions;

    expect(instructions[0].name.toString()).toBe("sendTokens");
  });
});
