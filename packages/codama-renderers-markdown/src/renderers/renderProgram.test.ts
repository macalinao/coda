/// <reference types="bun" />

import type { RenderContext } from "../types.js";
import { describe, expect, test } from "bun:test";
import {
  accountNode,
  errorNode,
  instructionAccountNode,
  instructionNode,
  numberTypeNode,
  programNode,
  structFieldTypeNode,
  structTypeNode,
} from "@codama/nodes";
import { LinkableDictionary } from "@codama/visitors-core";
import * as prettier from "prettier";
import { renderProgram } from "./renderProgram.js";

const mockContext: RenderContext = {
  linkables: new LinkableDictionary(),
  options: {
    formatWithPrettier: true,
    hideDiscriminators: false,
  },
};

describe("renderProgram", () => {
  test("renders complete program", async () => {
    const program = programNode({
      name: "tokenProgram",
      publicKey: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      docs: ["SPL Token Program"],
      accounts: [
        accountNode({
          name: "mint",
          data: structTypeNode([
            structFieldTypeNode({
              name: "supply",
              type: numberTypeNode("u64"),
            }),
          ]),
        }),
      ],
      instructions: [
        instructionNode({
          name: "initializeMint",
          accounts: [
            instructionAccountNode({
              name: "mint",
              isSigner: false,
              isWritable: true,
            }),
          ],
        }),
      ],
      errors: [
        errorNode({
          name: "invalidMint",
          code: 0,
          message: "Invalid mint",
        }),
      ],
    });

    const markdown = renderProgram(program, mockContext);
    const formatted = await prettier.format(markdown, { parser: "markdown" });

    expect(formatted).toContain("# Token Program Program");
    expect(formatted).toContain("SPL Token Program");
    expect(formatted).toContain(
      "`TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`",
    );
    expect(formatted).toContain("## Table of Contents");
    expect(formatted).toContain("## Accounts");
    expect(formatted).toContain("### mint");
    expect(formatted).toContain("## Instructions");
    expect(formatted).toContain("### initializeMint");
    expect(formatted).toContain("## Errors");
    expect(formatted).toContain(
      "- **0 - InvalidMint**: Invalid mint _(Hex: `0x0`)_",
    );
  });

  test("respects formatWithPrettier option", () => {
    const program = programNode({
      name: "testProgram",
      publicKey: "11111111111111111111111111111111",
      accounts: [],
    });

    const contextNoPrettier: RenderContext = {
      linkables: new LinkableDictionary(),
      options: {
        formatWithPrettier: false,
      },
    };

    const markdown = renderProgram(program, contextNoPrettier);
    // Without prettier, there might be inconsistent spacing
    expect(markdown).toContain("# Test Program Program");
    expect(markdown).not.toContain("```"); // No code blocks in empty program
  });

  test("respects renderTableOfContents option", () => {
    const program = programNode({
      name: "testProgram",
      publicKey: "11111111111111111111111111111111",
      accounts: [
        accountNode({
          name: "account1",
          data: structTypeNode([]),
        }),
      ],
    });

    const contextNoToc: RenderContext = {
      linkables: new LinkableDictionary(),
      options: {
        renderTableOfContents: false,
      },
    };

    const markdown = renderProgram(program, contextNoToc);
    expect(markdown).not.toContain("## Table of Contents");
  });

  test("renders NPM package badge and link when provided", async () => {
    const program = programNode({
      name: "myProgram",
      publicKey: "11111111111111111111111111111111",
      accounts: [],
    });

    const contextWithNpm: RenderContext = {
      linkables: new LinkableDictionary(),
      options: {
        formatWithPrettier: true,
        npmPackageName: "@my-org/my-solana-client",
      },
    };

    const markdown = renderProgram(program, contextWithNpm);
    const formatted = await prettier.format(markdown, { parser: "markdown" });

    // Check for NPM badge
    expect(formatted).toContain(
      "[![npm version](https://badge.fury.io/js/%40my-org%2Fmy-solana-client.svg)](https://www.npmjs.com/package/%40my-org%2Fmy-solana-client)",
    );

    // Check for TypeScript client link
    expect(formatted).toContain(
      "- TypeScript Client: [`@my-org/my-solana-client`](https://www.npmjs.com/package/@my-org/my-solana-client)",
    );
  });

  test("does not render NPM badge when not provided", () => {
    const program = programNode({
      name: "myProgram",
      publicKey: "11111111111111111111111111111111",
      accounts: [],
    });

    const contextWithoutNpm: RenderContext = {
      linkables: new LinkableDictionary(),
      options: {
        formatWithPrettier: false,
      },
    };

    const markdown = renderProgram(program, contextWithoutNpm);

    // Should not contain NPM badge or client link
    expect(markdown).not.toContain("npm version");
    expect(markdown).not.toContain("TypeScript Client:");
  });
});
