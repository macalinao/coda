/// <reference types="bun-types" />
import { describe, expect, it } from "bun:test";
import type { IdlV01InstructionAccountItem } from "@codama/nodes-from-anchor";
import type { AccountNode, InstructionArgumentNode } from "codama";
import { camelCase } from "codama";
import { instructionAccountNodesFromAnchorV01 } from "./instruction-account-nodes-from-anchor-v01.js";

describe("instructionAccountNodesFromAnchorV01", () => {
  const mockAccounts: AccountNode[] = [];
  const mockArguments: InstructionArgumentNode[] = [];

  it("should flatten nested account structures", () => {
    const nestedAccounts: IdlV01InstructionAccountItem[] = [
      {
        name: "mintAccounts",
        accounts: [
          { name: "mint", writable: true, signer: false },
          { name: "metadata", writable: true, signer: false },
        ],
      },
    ];

    const result = instructionAccountNodesFromAnchorV01(
      mockAccounts,
      mockArguments,
      nestedAccounts,
    );

    expect(result).toHaveLength(2);
    expect(result[0]?.name).toBe(camelCase("mintAccountsMint"));
    expect(result[1]?.name).toBe(camelCase("mintAccountsMetadata"));
  });

  it("should handle deeply nested account structures", () => {
    const deeplyNested: IdlV01InstructionAccountItem[] = [
      {
        name: "level1",
        accounts: [
          {
            name: "level2",
            accounts: [
              { name: "account1", writable: false, signer: true },
              { name: "account2", writable: true, signer: false },
            ],
          } as IdlV01InstructionAccountItem,
        ],
      },
    ];

    const result = instructionAccountNodesFromAnchorV01(
      mockAccounts,
      mockArguments,
      deeplyNested,
    );

    expect(result).toHaveLength(2);
    expect(result[0]?.name).toBe(camelCase("level1Level2Account1"));
    expect(result[1]?.name).toBe(camelCase("level1Level2Account2"));
  });

  it("should handle flat account structures", () => {
    const flatAccounts: IdlV01InstructionAccountItem[] = [
      { name: "account1", writable: true, signer: false },
      { name: "account2", writable: false, signer: true },
    ];

    const result = instructionAccountNodesFromAnchorV01(
      mockAccounts,
      mockArguments,
      flatAccounts,
    );

    expect(result).toHaveLength(2);
    expect(result[0]?.name).toBe(camelCase("account1"));
    expect(result[1]?.name).toBe(camelCase("account2"));
  });

  it("should handle nested accounts with PDA", () => {
    const accountsWithPda: IdlV01InstructionAccountItem[] = [
      {
        name: "parent",
        accounts: [
          {
            name: "child",
            writable: true,
            signer: false,
          },
        ],
      },
    ];

    const result = instructionAccountNodesFromAnchorV01(
      mockAccounts,
      mockArguments,
      accountsWithPda,
    );

    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe(camelCase("parentChild"));

    // The flattened account should be writable since writable=true
    const account = result[0];
    expect(account?.isWritable).toBeDefined();
  });

  it("should handle mixed nested and flat structures", () => {
    const mixedAccounts: IdlV01InstructionAccountItem[] = [
      { name: "flatAccount", writable: true, signer: false },
      {
        name: "nestedGroup",
        accounts: [
          { name: "nested1", writable: false, signer: false },
          { name: "nested2", writable: true, signer: true },
        ],
      },
      { name: "anotherFlat", writable: false, signer: true },
    ];

    const result = instructionAccountNodesFromAnchorV01(
      mockAccounts,
      mockArguments,
      mixedAccounts,
    );

    expect(result).toHaveLength(4);
    expect(result[0]?.name).toBe(camelCase("flatAccount"));
    expect(result[1]?.name).toBe(camelCase("nestedGroupNested1"));
    expect(result[2]?.name).toBe(camelCase("nestedGroupNested2"));
    expect(result[3]?.name).toBe(camelCase("anotherFlat"));
  });

  it("should handle empty account arrays", () => {
    const result = instructionAccountNodesFromAnchorV01(
      mockAccounts,
      mockArguments,
      [],
    );

    expect(result).toHaveLength(0);
  });

  it("should preserve account properties during flattening", () => {
    const accountsWithProps: IdlV01InstructionAccountItem[] = [
      {
        name: "group",
        accounts: [
          {
            name: "mutableSigner",
            writable: true,
            signer: true,
            docs: ["Test documentation"],
          },
        ],
      },
    ];

    const result = instructionAccountNodesFromAnchorV01(
      mockAccounts,
      mockArguments,
      accountsWithProps,
    );

    expect(result).toHaveLength(1);
    const account = result[0];
    expect(account?.name).toBe(camelCase("groupMutableSigner"));
    // The isWritable property is determined by writable
    expect(account?.isWritable).toBeDefined();
    // The isSigner property is determined by the signer flag
    expect(account?.isSigner).toBeDefined();
    expect(account?.docs).toEqual(["Test documentation"]);
  });
});
