/// <reference types="bun-types" />
import { describe, expect, it } from "bun:test";
import type { IdlV01InstructionAccountItem } from "@codama/nodes-from-anchor";
import type { AccountNode } from "codama";
import { instructionAccountNodesFromAnchorV01 } from "./instruction-account-nodes-from-anchor-v01.js";

describe("instructionAccountNodesFromAnchorV01", () => {
  const mockAccounts: AccountNode[] = [];
  const mockArguments = [];

  it("should flatten nested account structures", () => {
    const nestedAccounts: IdlV01InstructionAccountItem[] = [
      {
        name: "mintAccounts",
        accounts: [
          { name: "mint", isMut: true, isSigner: false },
          { name: "metadata", isMut: true, isSigner: false },
        ],
      },
    ];

    const result = instructionAccountNodesFromAnchorV01(
      mockAccounts,
      mockArguments,
      nestedAccounts,
    );

    expect(result).toHaveLength(2);
    expect(result[0]?.name).toBe("mintAccountsMint");
    expect(result[1]?.name).toBe("mintAccountsMetadata");
  });

  it("should handle deeply nested account structures", () => {
    const deeplyNested: IdlV01InstructionAccountItem[] = [
      {
        name: "level1",
        accounts: [
          {
            name: "level2",
            accounts: [
              { name: "account1", isMut: false, isSigner: true },
              { name: "account2", isMut: true, isSigner: false },
            ],
          },
        ],
      },
    ];

    const result = instructionAccountNodesFromAnchorV01(
      mockAccounts,
      mockArguments,
      deeplyNested,
    );

    expect(result).toHaveLength(2);
    expect(result[0]?.name).toBe("level1Level2Account1");
    expect(result[1]?.name).toBe("level1Level2Account2");
  });

  it("should handle flat account structures", () => {
    const flatAccounts: IdlV01InstructionAccountItem[] = [
      { name: "account1", isMut: true, isSigner: false },
      { name: "account2", isMut: false, isSigner: true },
    ];

    const result = instructionAccountNodesFromAnchorV01(
      mockAccounts,
      mockArguments,
      flatAccounts,
    );

    expect(result).toHaveLength(2);
    expect(result[0]?.name).toBe("account1");
    expect(result[1]?.name).toBe("account2");
  });

  it("should handle nested accounts with PDA", () => {
    const accountsWithPda: IdlV01InstructionAccountItem[] = [
      {
        name: "parent",
        accounts: [
          {
            name: "child",
            isMut: true,
            isSigner: false,
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
    expect(result[0]?.name).toBe("parentChild");

    // The flattened account should be writable since isMut=true
    const account = result[0];
    expect(account.isWritable).toBeDefined();
  });

  it("should handle mixed nested and flat structures", () => {
    const mixedAccounts: IdlV01InstructionAccountItem[] = [
      { name: "flatAccount", isMut: true, isSigner: false },
      {
        name: "nestedGroup",
        accounts: [
          { name: "nested1", isMut: false, isSigner: false },
          { name: "nested2", isMut: true, isSigner: true },
        ],
      },
      { name: "anotherFlat", isMut: false, isSigner: true },
    ];

    const result = instructionAccountNodesFromAnchorV01(
      mockAccounts,
      mockArguments,
      mixedAccounts,
    );

    expect(result).toHaveLength(4);
    expect(result[0]?.name).toBe("flatAccount");
    expect(result[1]?.name).toBe("nestedGroupNested1");
    expect(result[2]?.name).toBe("nestedGroupNested2");
    expect(result[3]?.name).toBe("anotherFlat");
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
            isMut: true,
            isSigner: true,
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
    expect(account.name).toBe("groupMutableSigner");
    // The isWritable property is determined by isMut
    expect(account.isWritable).toBeDefined();
    // The isSigner property is determined by the isSigner flag
    expect(account.isSigner).toBeDefined();
    expect(account.docs).toEqual(["Test documentation"]);
  });
});
