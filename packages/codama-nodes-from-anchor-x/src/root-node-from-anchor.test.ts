import type { AnchorIdl } from "@codama/nodes-from-anchor";
import { describe, expect, it } from "bun:test";
import { rootNodeFromAnchor } from "./root-node-from-anchor.js";

describe("rootNodeFromAnchor", () => {
  const createMockIdl = (name: string, version = "0.0.0"): AnchorIdl => ({
    name,
    version,
    instructions: [],
    accounts: [],
    types: [],
    errors: [],
  });

  const createMockIdlV01 = (name: string): AnchorIdl => ({
    version: "0.1.0",
    metadata: {
      spec: "0.1.0",
      address: "11111111111111111111111111111111",
      name,
    },
    instructions: [],
    accounts: [],
    types: [],
    errors: [],
  });

  it("should create a root node from a v0.0.0 IDL", () => {
    const idl = createMockIdl("test_program");
    const root = rootNodeFromAnchor(idl);

    expect(root.kind).toBe("rootNode");
    expect(root.program.name).toBe("testProgram");
    expect(root.additionalPrograms).toHaveLength(0);
  });

  it("should create a root node from a v0.1.0 IDL", () => {
    const idl = createMockIdlV01("new_format_program");
    const root = rootNodeFromAnchor(idl);

    expect(root.kind).toBe("rootNode");
    expect(root.program.name).toBe("newFormatProgram");
    expect(root.additionalPrograms).toHaveLength(0);
  });

  it("should convert snake_case names to camelCase", () => {
    const idl = createMockIdl("my_snake_case_program");
    const root = rootNodeFromAnchor(idl);

    expect(root.program.name).toBe("mySnakeCaseProgram");
  });

  it("should handle IDLs with instructions and accounts", () => {
    const idl: AnchorIdl = {
      name: "complex_program",
      version: "0.0.0",
      instructions: [
        {
          name: "initialize",
          accounts: [],
          args: [],
        },
        {
          name: "transfer",
          accounts: [],
          args: [{ name: "amount", type: "u64" }],
        },
      ],
      accounts: [
        {
          name: "MyAccount",
          type: {
            kind: "struct",
            fields: [
              { name: "value", type: "u64" },
              { name: "owner", type: "publicKey" },
            ],
          },
        },
      ],
      types: [],
      errors: [
        {
          code: 6000,
          name: "InvalidAmount",
          msg: "The amount is invalid",
        },
      ],
    };

    const root = rootNodeFromAnchor(idl);

    expect(root.kind).toBe("rootNode");
    expect(root.program.name).toBe("complexProgram");
    expect(root.program.instructions).toHaveLength(2);
    expect(root.program.instructions[0].name).toBe("initialize");
    expect(root.program.instructions[1].name).toBe("transfer");
    expect(root.program.accounts).toHaveLength(1);
    expect(root.program.accounts[0].name).toBe("myAccount");
    expect(root.program.errors).toHaveLength(1);
  });

  it("should handle empty IDL", () => {
    const idl: AnchorIdl = {
      name: "empty_program",
      version: "0.0.0",
      instructions: [],
      accounts: [],
      types: [],
      errors: [],
    };

    const root = rootNodeFromAnchor(idl);

    expect(root.kind).toBe("rootNode");
    expect(root.program.name).toBe("emptyProgram");
    expect(root.program.instructions).toHaveLength(0);
    expect(root.program.accounts).toHaveLength(0);
    expect(root.program.errors).toHaveLength(0);
  });
});
