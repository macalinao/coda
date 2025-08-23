/// <reference types="bun-types" />
import { describe, expect, it } from "bun:test";
import type { AnchorIdl } from "@codama/nodes-from-anchor";
import {
  accountNode,
  instructionArgumentNode,
  instructionNode,
  programNode,
  rootNode,
  visit,
} from "codama";
import { instructionAccountsDedupeVisitor } from "./instruction-accounts-dedupe-visitor.js";

describe("instructionAccountsDedupeVisitor", () => {
  it("should flatten nested instruction accounts", () => {
    const idl: AnchorIdl = {
      version: "0.1.0",
      name: "test_program",
      instructions: [
        {
          name: "test_instruction",
          accounts: [
            {
              name: "mint_accounts",
              accounts: [
                { name: "mint", isMut: true, isSigner: false },
                { name: "metadata", isMut: true, isSigner: false },
              ],
            },
            { name: "authority", isMut: false, isSigner: true },
          ],
          args: [],
        },
      ],
      accounts: [],
      types: [],
      errors: [],
    };

    const root = rootNode(
      programNode({
        name: "testProgram",
        publicKey: "11111111111111111111111111111111",
        accounts: [],
        instructions: [
          instructionNode({
            name: "testInstruction",
            accounts: [],
            arguments: [],
          }),
        ],
      }),
    );

    const visitor = instructionAccountsDedupeVisitor(idl);
    const transformedRoot = visit(root, visitor);

    const instruction = transformedRoot.program.instructions[0];
    expect(instruction?.accounts).toHaveLength(3);
    expect(instruction?.accounts[0]?.name).toBe("mintAccountsMint");
    expect(instruction?.accounts[1]?.name).toBe("mintAccountsMetadata");
    expect(instruction?.accounts[2]?.name).toBe("authority");
  });

  it("should handle instructions with no nested accounts", () => {
    const idl: AnchorIdl = {
      version: "0.1.0",
      name: "test_program",
      instructions: [
        {
          name: "simple_instruction",
          accounts: [
            { name: "account1", isMut: true, isSigner: false },
            { name: "account2", isMut: false, isSigner: true },
          ],
          args: [],
        },
      ],
      accounts: [],
      types: [],
      errors: [],
    };

    const root = rootNode(
      programNode({
        name: "testProgram",
        publicKey: "11111111111111111111111111111111",
        accounts: [],
        instructions: [
          instructionNode({
            name: "simpleInstruction",
            accounts: [],
            arguments: [],
          }),
        ],
      }),
    );

    const visitor = instructionAccountsDedupeVisitor(idl);
    const transformedRoot = visit(root, visitor);

    const instruction = transformedRoot.program.instructions[0];
    expect(instruction?.accounts).toHaveLength(2);
    expect(instruction?.accounts[0]?.name).toBe("account1");
    expect(instruction?.accounts[1]?.name).toBe("account2");
  });

  it("should handle multiple instructions", () => {
    const idl: AnchorIdl = {
      version: "0.1.0",
      name: "test_program",
      instructions: [
        {
          name: "first_instruction",
          accounts: [
            {
              name: "nested",
              accounts: [{ name: "inner", isMut: true, isSigner: false }],
            },
          ],
          args: [],
        },
        {
          name: "second_instruction",
          accounts: [{ name: "simple", isMut: false, isSigner: true }],
          args: [],
        },
      ],
      accounts: [],
      types: [],
      errors: [],
    };

    const root = rootNode(
      programNode({
        name: "testProgram",
        publicKey: "11111111111111111111111111111111",
        accounts: [],
        instructions: [
          instructionNode({
            name: "firstInstruction",
            accounts: [],
            arguments: [],
          }),
          instructionNode({
            name: "secondInstruction",
            accounts: [],
            arguments: [],
          }),
        ],
      }),
    );

    const visitor = instructionAccountsDedupeVisitor(idl);
    const transformedRoot = visit(root, visitor);

    const firstInstruction = transformedRoot.program.instructions[0];
    expect(firstInstruction?.accounts).toHaveLength(1);
    expect(firstInstruction?.accounts[0]?.name).toBe("nestedInner");

    const secondInstruction = transformedRoot.program.instructions[1];
    expect(secondInstruction?.accounts).toHaveLength(1);
    expect(secondInstruction?.accounts[0]?.name).toBe("simple");
  });

  it("should throw error if instruction not found in IDL", () => {
    const idl: AnchorIdl = {
      version: "0.1.0",
      name: "test_program",
      instructions: [],
      accounts: [],
      types: [],
      errors: [],
    };

    const root = rootNode(
      programNode({
        name: "testProgram",
        publicKey: "11111111111111111111111111111111",
        accounts: [],
        instructions: [
          instructionNode({
            name: "missingInstruction",
            accounts: [],
            arguments: [],
          }),
        ],
      }),
    );

    const visitor = instructionAccountsDedupeVisitor(idl);

    expect(() => visit(root, visitor)).toThrow(
      "Instruction missingInstruction not found in IDL",
    );
  });

  it("should preserve instruction arguments", () => {
    const idl: AnchorIdl = {
      version: "0.1.0",
      name: "test_program",
      instructions: [
        {
          name: "instruction_with_args",
          accounts: [
            {
              name: "nested",
              accounts: [{ name: "account", isMut: true, isSigner: false }],
            },
          ],
          args: [
            { name: "amount", type: "u64" },
            { name: "data", type: "bytes" },
          ],
        },
      ],
      accounts: [],
      types: [],
      errors: [],
    };

    const root = rootNode(
      programNode({
        name: "testProgram",
        publicKey: "11111111111111111111111111111111",
        accounts: [],
        instructions: [
          instructionNode({
            name: "instructionWithArgs",
            accounts: [],
            arguments: [
              instructionArgumentNode({
                name: "amount",
                type: { kind: "numberTypeNode", format: "u64", endian: "le" },
              }),
              instructionArgumentNode({
                name: "data",
                type: { kind: "bytesTypeNode" },
              }),
            ],
          }),
        ],
      }),
    );

    const visitor = instructionAccountsDedupeVisitor(idl);
    const transformedRoot = visit(root, visitor);

    const instruction = transformedRoot.program.instructions[0];
    expect(instruction?.arguments).toHaveLength(2);
    expect(instruction?.arguments[0]?.name).toBe("amount");
    expect(instruction?.arguments[1]?.name).toBe("data");
    expect(instruction?.accounts).toHaveLength(1);
    expect(instruction?.accounts[0]?.name).toBe("nestedAccount");
  });

  it("should handle deeply nested account structures", () => {
    const idl: AnchorIdl = {
      version: "0.1.0",
      name: "test_program",
      instructions: [
        {
          name: "deep_nesting",
          accounts: [
            {
              name: "level1",
              accounts: [
                {
                  name: "level2",
                  accounts: [
                    {
                      name: "level3",
                      accounts: [
                        { name: "deepest", isMut: true, isSigner: false },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          args: [],
        },
      ],
      accounts: [],
      types: [],
      errors: [],
    };

    const root = rootNode(
      programNode({
        name: "testProgram",
        publicKey: "11111111111111111111111111111111",
        accounts: [],
        instructions: [
          instructionNode({
            name: "deepNesting",
            accounts: [],
            arguments: [],
          }),
        ],
      }),
    );

    const visitor = instructionAccountsDedupeVisitor(idl);
    const transformedRoot = visit(root, visitor);

    const instruction = transformedRoot.program.instructions[0];
    expect(instruction?.accounts).toHaveLength(1);
    expect(instruction?.accounts[0]?.name).toBe("level1Level2Level3Deepest");
  });

  it("should work with program accounts", () => {
    const idl: AnchorIdl = {
      version: "0.1.0",
      name: "test_program",
      instructions: [
        {
          name: "use_program_account",
          accounts: [
            {
              name: "accounts_group",
              accounts: [
                { name: "user", isMut: true, isSigner: false },
                { name: "data", isMut: true, isSigner: false },
              ],
            },
          ],
          args: [],
        },
      ],
      accounts: [
        {
          name: "UserAccount",
          type: {
            kind: "struct",
            fields: [{ name: "data", type: "u64" }],
          },
        },
      ],
      types: [],
      errors: [],
    };

    const root = rootNode(
      programNode({
        name: "testProgram",
        publicKey: "11111111111111111111111111111111",
        accounts: [
          accountNode({
            name: "userAccount",
            size: 8,
            discriminator: [0, 1, 2, 3, 4, 5, 6, 7],
          }),
        ],
        instructions: [
          instructionNode({
            name: "useProgramAccount",
            accounts: [],
            arguments: [],
          }),
        ],
      }),
    );

    const visitor = instructionAccountsDedupeVisitor(idl);
    const transformedRoot = visit(root, visitor);

    const instruction = transformedRoot.program.instructions[0];
    expect(instruction?.accounts).toHaveLength(2);
    expect(instruction?.accounts[0]?.name).toBe("accountsGroupUser");
    expect(instruction?.accounts[1]?.name).toBe("accountsGroupData");

    // Program accounts should remain unchanged
    expect(transformedRoot.program.accounts).toHaveLength(1);
    expect(transformedRoot.program.accounts[0]?.name).toBe("userAccount");
  });
});
