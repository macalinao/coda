/// <reference types="bun-types" />
import { describe, expect, it } from "bun:test";
import type { AnchorIdl, IdlV01 } from "@codama/nodes-from-anchor";
import type { RootNode } from "codama";
import {
  accountNode,
  camelCase,
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
      address: "11111111111111111111111111111111",
      metadata: {
        name: "test_program",
        version: "0.1.0",
        spec: "0.1.0",
      },
      instructions: [
        {
          name: "test_instruction",
          discriminator: [0, 1, 2, 3, 4, 5, 6, 7],
          accounts: [
            {
              name: "mint_accounts",
              accounts: [
                { name: "mint", writable: true, signer: false },
                { name: "metadata", writable: true, signer: false },
              ],
            },
            { name: "authority", writable: false, signer: true },
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
    const transformedRoot = visit(root, visitor) as RootNode;

    const instruction = transformedRoot.program.instructions[0];
    expect(instruction?.accounts).toHaveLength(3);
    expect(instruction?.accounts[0]?.name).toBe(camelCase("mintAccountsMint"));
    expect(instruction?.accounts[1]?.name).toBe(
      camelCase("mintAccountsMetadata"),
    );
    expect(instruction?.accounts[2]?.name).toBe(camelCase("authority"));
  });

  it("should handle instructions with no nested accounts", () => {
    const idl: AnchorIdl = {
      address: "11111111111111111111111111111111",
      metadata: {
        name: "test_program",
        version: "0.1.0",
        spec: "0.1.0",
      },
      instructions: [
        {
          name: "simple_instruction",
          discriminator: [0, 1, 2, 3, 4, 5, 6, 7],
          accounts: [
            { name: "account1", writable: true, signer: false },
            { name: "account2", writable: false, signer: true },
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
    const transformedRoot = visit(root, visitor) as RootNode;

    const instruction = transformedRoot.program.instructions[0];
    expect(instruction?.accounts).toHaveLength(2);
    expect(instruction?.accounts[0]?.name).toBe(camelCase("account1"));
    expect(instruction?.accounts[1]?.name).toBe(camelCase("account2"));
  });

  it("should handle multiple instructions", () => {
    const idl: AnchorIdl = {
      address: "11111111111111111111111111111111",
      metadata: {
        name: "test_program",
        version: "0.1.0",
        spec: "0.1.0",
      },
      instructions: [
        {
          name: "first_instruction",
          discriminator: [0, 1, 2, 3, 4, 5, 6, 7],
          accounts: [
            {
              name: "nested",
              accounts: [{ name: "inner", writable: true, signer: false }],
            },
          ],
          args: [],
        },
        {
          name: "second_instruction",
          discriminator: [1, 2, 3, 4, 5, 6, 7, 8],
          accounts: [{ name: "simple", writable: false, signer: true }],
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
    const transformedRoot = visit(root, visitor) as RootNode;

    const firstInstruction = transformedRoot.program.instructions[0];
    expect(firstInstruction?.accounts).toHaveLength(1);
    expect(firstInstruction?.accounts[0]?.name).toBe(camelCase("nestedInner"));

    const secondInstruction = transformedRoot.program.instructions[1];
    expect(secondInstruction?.accounts).toHaveLength(1);
    expect(secondInstruction?.accounts[0]?.name).toBe(camelCase("simple"));
  });

  it("should throw error if instruction not found in IDL", () => {
    const idl: AnchorIdl = {
      address: "11111111111111111111111111111111",
      metadata: {
        name: "test_program",
        version: "0.1.0",
        spec: "0.1.0",
      },
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
      address: "11111111111111111111111111111111",
      metadata: {
        name: "test_program",
        version: "0.1.0",
        spec: "0.1.0",
      },
      instructions: [
        {
          name: "instruction_with_args",
          discriminator: [0, 1, 2, 3, 4, 5, 6, 7],
          accounts: [
            {
              name: "nested",
              accounts: [{ name: "account", writable: true, signer: false }],
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
    const transformedRoot = visit(root, visitor) as RootNode;

    const instruction = transformedRoot.program.instructions[0];
    expect(instruction?.arguments).toHaveLength(2);
    expect(instruction?.arguments[0]?.name).toBe(camelCase("amount"));
    expect(instruction?.arguments[1]?.name).toBe(camelCase("data"));
    expect(instruction?.accounts).toHaveLength(1);
    expect(instruction?.accounts[0]?.name).toBe(camelCase("nestedAccount"));
  });

  it("should handle deeply nested account structures", () => {
    const idl: IdlV01 = {
      address: "11111111111111111111111111111111",
      metadata: {
        name: "test_program",
        version: "0.1.0",
        spec: "0.1.0",
      },
      instructions: [
        {
          name: "deep_nesting",
          discriminator: [0, 1, 2, 3, 4, 5, 6, 7],
          accounts: [
            {
              name: "level1",
              accounts: [
                {
                  name: "level2",
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
    const transformedRoot = visit(root, visitor) as RootNode;

    const instruction = transformedRoot.program.instructions[0];
    expect(instruction?.accounts).toHaveLength(1);
    expect(instruction?.accounts[0]?.name).toBe(camelCase("level1Level2"));
  });

  it("should work with program accounts", () => {
    const idl: AnchorIdl = {
      address: "11111111111111111111111111111111",
      metadata: {
        name: "test_program",
        version: "0.1.0",
        spec: "0.1.0",
      },
      instructions: [
        {
          name: "use_program_account",
          discriminator: [0, 1, 2, 3, 4, 5, 6, 7],
          accounts: [
            {
              name: "accounts_group",
              accounts: [
                { name: "user", writable: true, signer: false },
                { name: "data", writable: true, signer: false },
              ],
            },
          ],
          args: [],
        },
      ],
      accounts: [
        {
          name: "UserAccount",
          discriminator: [0, 1, 2, 3, 4, 5, 6, 7],
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
            discriminators: [],
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
    const transformedRoot = visit(root, visitor) as RootNode;

    const instruction = transformedRoot.program.instructions[0];
    expect(instruction?.accounts).toHaveLength(2);
    expect(instruction?.accounts[0]?.name).toBe(camelCase("accountsGroupUser"));
    expect(instruction?.accounts[1]?.name).toBe(camelCase("accountsGroupData"));

    // Program accounts should remain unchanged
    expect(transformedRoot.program.accounts).toHaveLength(1);
    expect(transformedRoot.program.accounts[0]?.name).toBe(
      camelCase("userAccount"),
    );
  });
});
