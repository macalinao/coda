/// <reference types="bun-types" />

import type { RenderContext } from "../types.js";
import { describe, expect, test } from "bun:test";
import {
  instructionAccountNode,
  instructionArgumentNode,
  instructionNode,
  numberTypeNode,
} from "@codama/nodes";
import { LinkableDictionary } from "@codama/visitors-core";
import * as prettier from "prettier";
import { renderInstruction } from "./renderInstruction.js";

const mockContext: RenderContext = {
  linkables: new LinkableDictionary(),
  options: {
    formatWithPrettier: true,
    hideDiscriminators: false, // Show discriminators in tests
  },
};

describe("renderInstruction", () => {
  test("renders basic instruction", async () => {
    const instruction = instructionNode({
      name: "transfer",
      docs: ["Transfer tokens between accounts"],
      accounts: [
        instructionAccountNode({
          name: "source",
          isSigner: true,
          isWritable: true,
          docs: ["Source account"],
        }),
        instructionAccountNode({
          name: "destination",
          isSigner: false,
          isWritable: true,
          docs: ["Destination account"],
        }),
        instructionAccountNode({
          name: "authority",
          isSigner: true,
          isWritable: false,
        }),
      ],
      arguments: [
        instructionArgumentNode({
          name: "amount",
          type: numberTypeNode("u64"),
          docs: ["Amount to transfer"],
        }),
      ],
    });

    const markdown = renderInstruction(instruction, mockContext);
    const formatted = await prettier.format(markdown, { parser: "markdown" });

    expect(formatted).toContain("### transfer");
    expect(formatted).toContain("Transfer tokens between accounts");
    expect(formatted).toContain(
      "| `source`      | signer, writable | Source account      |",
    );
    expect(formatted).toContain(
      "| `destination` | writable         | Destination account |",
    );
    expect(formatted).toContain("| `authority`   | signer           |");
    expect(formatted).toContain("| `amount` | `u64` | Amount to transfer |");
  });
});
