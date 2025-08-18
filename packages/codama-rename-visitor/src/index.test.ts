/// <reference types="bun-types" />
import { describe, expect, it } from "bun:test";
import type { ProgramNode, RootNode } from "codama";
import {
  camelCase,
  definedTypeNode,
  instructionAccountNode,
  instructionNode,
  numberTypeNode,
  programNode,
  publicKeyTypeNode,
  rootNode,
  visit,
} from "codama";
import {
  renameDefinedTypesVisitor,
  renameEventsVisitor,
  renameInstructionsVisitor,
  renameVisitor,
} from "./index.js";

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

    expect(instructions[0].name).toBe("transferTokens");
    expect(instructions[1].name).toBe("mintNft");
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

    expect(instructions[0].name).toBe("burn");
  });
});

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

    expect(types[0].name).toBe("counterAccount");
    expect(types[1].name).toBe("programConfig");
  });
});

describe("renameEventsVisitor", () => {
  it("should rename events (as defined types with Event suffix)", () => {
    const program: ProgramNode = programNode({
      name: camelCase("testProgram"),
      publicKey: "11111111111111111111111111111111",
      definedTypes: [
        definedTypeNode({
          name: camelCase("tokenMintedEvent"),
          type: numberTypeNode("u64"),
        }),
        definedTypeNode({
          name: camelCase("transferCompleteEvent"),
          type: publicKeyTypeNode(),
        }),
        definedTypeNode({
          name: camelCase("regularType"),
          type: numberTypeNode("u32"),
        }),
      ],
    });

    const root = rootNode(program);
    const visitor = renameEventsVisitor({
      tokenMintedEvent: "nftMintedEvent",
      transferCompleteEvent: "transferFinishedEvent",
    });

    const updatedRoot = visit(root, visitor) as RootNode;
    const types = updatedRoot.program.definedTypes;

    expect(types[0].name).toBe("nftMintedEvent");
    expect(types[1].name).toBe("transferFinishedEvent");
    expect(types[2].name).toBe("regularType"); // Should remain unchanged
  });

  it("should rename events without suffix if explicitly in mapping", () => {
    const program: ProgramNode = programNode({
      name: camelCase("testProgram"),
      publicKey: "11111111111111111111111111111111",
      definedTypes: [
        definedTypeNode({
          name: camelCase("tokenMinted"),
          type: numberTypeNode("u64"),
        }),
      ],
    });

    const root = rootNode(program);
    const visitor = renameEventsVisitor({
      tokenMinted: "nftMinted",
    });

    const updatedRoot = visit(root, visitor) as RootNode;
    const types = updatedRoot.program.definedTypes;

    expect(types[0].name).toBe("nftMinted");
  });
});

describe("renameVisitor (legacy format)", () => {
  it("should rename both instructions and events", () => {
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
          name: camelCase("tokenMintedEvent"),
          type: numberTypeNode("u64"),
        }),
      ],
    });

    const root = rootNode(program);
    const visitor = renameVisitor({
      instructions: {
        transfer: "transferTokens",
      },
      events: {
        tokenMintedEvent: "nftMintedEvent",
      },
    });

    const updatedRoot = visit(root, visitor) as RootNode;
    const instructions = updatedRoot.program.instructions;
    const types = updatedRoot.program.definedTypes;

    expect(instructions[0].name).toBe("transferTokens");
    expect(types[0].name).toBe("nftMintedEvent");
  });

  it("should handle empty options gracefully", () => {
    const program: ProgramNode = programNode({
      name: camelCase("testProgram"),
      publicKey: "11111111111111111111111111111111",
      instructions: [
        instructionNode({
          name: camelCase("transfer"),
          accounts: [],
        }),
      ],
    });

    const root = rootNode(program);
    const visitor = renameVisitor({});

    const updatedRoot = visit(root, visitor) as RootNode;
    const instructions = updatedRoot.program.instructions;

    expect(instructions[0].name).toBe("transfer");
  });
});

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

    expect(quarryInstructions[0].name).toBe("claimRewardsMine");
    expect(quarryInstructions[1].name).toBe("stake"); // Unchanged
    expect(tokenInstructions[0].name).toBe("transferTokens");
    expect(tokenInstructions[1].name).toBe("mintNft");
  });

  it("should rename events and defined types in specific programs", () => {
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
        events: {
          tokenMintedEvent: "nftMintedEvent",
        },
        definedTypes: {
          counter: "counterAccount",
        },
      },
    });

    const updatedRoot = visit(root, visitor) as RootNode;
    const types = updatedRoot.program.definedTypes;

    expect(types[0].name).toBe("nftMintedEvent");
    expect(types[1].name).toBe("counterAccount");
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

    expect(instructions[0].name).toBe("claimRewardsMergeMine");
    expect(instructions[1].name).toBe("stake"); // Unchanged
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
        events: {
          transferEvent: "tokenSentEvent",
        },
      },
    });

    const updatedRoot = visit(root, visitor) as RootNode;
    const instructions = updatedRoot.program.instructions;
    const types = updatedRoot.program.definedTypes;

    expect(instructions[0].name).toBe("sendTokens");
    expect(types[0].name).toBe("tokenSentEvent");
  });
});
