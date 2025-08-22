/// <reference types="bun-types" />
import { describe, expect, test } from "bun:test";
import { numberTypeNode, pdaNode, variablePdaSeedNode } from "@codama/nodes";
import { LinkableDictionary } from "@codama/visitors-core";
import * as prettier from "prettier";
import type { RenderContext } from "../types.js";
import { renderPda } from "./renderPda.js";

const mockContext: RenderContext = {
  linkables: new LinkableDictionary(),
  options: {
    formatWithPrettier: true,
  },
};

describe("renderPda", () => {
  test("renders PDA with variable seeds", async () => {
    const pda = pdaNode({
      name: "userPda",
      docs: ["User PDA for storing user data"],
      seeds: [
        variablePdaSeedNode("user", numberTypeNode("u32"), ["User identifier"]),
        variablePdaSeedNode("nonce", numberTypeNode("u8")),
      ],
    });

    const markdown = renderPda(pda, mockContext);
    const formatted = await prettier.format(markdown, { parser: "markdown" });

    expect(formatted).toContain("### userPda");
    expect(formatted).toContain("User PDA for storing user data");
    expect(formatted).toContain("| `user`  | `u32` | User identifier |");
    expect(formatted).toContain("| `nonce` | `u8`  |");
  });
});
