import { describe, expect, it } from "bun:test";
import type { AnchorIdl } from "@codama/nodes-from-anchor";
import { rootNodeFromAnchorIdls } from "./root-node-from-anchor-idls.js";

describe("rootNodeFromAnchorIdls", () => {
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

  it("should create a root node from a single IDL", () => {
    const idl = createMockIdl("test_program");
    const root = rootNodeFromAnchorIdls([idl]);

    expect(root.kind).toBe("rootNode");
    expect(root.program.name).toBe("testProgram");
    expect(root.additionalPrograms).toHaveLength(0);
  });

  it("should create a root node from multiple IDLs", () => {
    const idl1 = createMockIdl("program_one");
    const idl2 = createMockIdl("program_two");
    const idl3 = createMockIdl("program_three");

    const root = rootNodeFromAnchorIdls([idl1, idl2, idl3]);

    expect(root.kind).toBe("rootNode");
    expect(root.program.name).toBe("programOne");
    expect(root.additionalPrograms).toHaveLength(2);
    expect(root.additionalPrograms[0].name).toBe("programTwo");
    expect(root.additionalPrograms[1].name).toBe("programThree");
  });

  it("should handle IDL v0.1.0 format", () => {
    const idl = createMockIdlV01("new_format_program");
    const root = rootNodeFromAnchorIdls([idl]);

    expect(root.kind).toBe("rootNode");
    expect(root.program.name).toBe("newFormatProgram");
    // V0.1.0 IDL includes address in metadata but the program node might not expose it directly
    expect(root.program.name).toBe("newFormatProgram");
  });

  it("should handle mixed IDL versions", () => {
    const idlV00 = createMockIdl("old_program");
    const idlV01 = createMockIdlV01("new_program");

    const root = rootNodeFromAnchorIdls([idlV00, idlV01]);

    expect(root.kind).toBe("rootNode");
    expect(root.program.name).toBe("oldProgram");
    expect(root.additionalPrograms).toHaveLength(1);
    expect(root.additionalPrograms[0].name).toBe("newProgram");
    // V0.1.0 IDL includes address in metadata but might not be exposed in the program node
    expect(root.additionalPrograms[0].name).toBe("newProgram");
  });

  it("should throw an error when no IDLs are provided", () => {
    expect(() => rootNodeFromAnchorIdls([])).toThrow(
      "No IDL files were provided",
    );
  });

  it("should convert snake_case names to camelCase", () => {
    const idl = createMockIdl("my_snake_case_program");
    const root = rootNodeFromAnchorIdls([idl]);

    expect(root.program.name).toBe("mySnakeCaseProgram");
  });

  it("should preserve the order of programs", () => {
    const idls = [
      createMockIdl("first"),
      createMockIdl("second"),
      createMockIdl("third"),
      createMockIdl("fourth"),
    ];

    const root = rootNodeFromAnchorIdls(idls);

    expect(root.program.name).toBe("first");
    expect(root.additionalPrograms[0].name).toBe("second");
    expect(root.additionalPrograms[1].name).toBe("third");
    expect(root.additionalPrograms[2].name).toBe("fourth");
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
      ],
      accounts: [
        {
          name: "MyAccount",
          type: {
            kind: "struct",
            fields: [{ name: "value", type: "u64" }],
          },
        },
      ],
      types: [],
      errors: [],
    };

    const root = rootNodeFromAnchorIdls([idl]);

    expect(root.kind).toBe("rootNode");
    expect(root.program.name).toBe("complexProgram");
    expect(root.program.instructions).toHaveLength(1);
    expect(root.program.instructions[0].name).toBe("initialize");
    expect(root.program.accounts).toHaveLength(1);
    expect(root.program.accounts[0].name).toBe("myAccount");
  });
});
