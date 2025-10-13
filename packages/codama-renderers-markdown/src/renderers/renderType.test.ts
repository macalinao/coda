/// <reference types="bun" />

import type { RenderContext } from "../types.js";
import { describe, expect, test } from "bun:test";
import {
  definedTypeNode,
  enumEmptyVariantTypeNode,
  enumStructVariantTypeNode,
  enumTupleVariantTypeNode,
  enumTypeNode,
  numberTypeNode,
  stringTypeNode,
  structFieldTypeNode,
  structTypeNode,
  tupleTypeNode,
} from "@codama/nodes";
import { LinkableDictionary } from "@codama/visitors-core";
import * as prettier from "prettier";
import { renderDefinedType } from "./renderType.js";

const mockContext: RenderContext = {
  linkables: new LinkableDictionary(),
  options: {
    formatWithPrettier: true,
  },
};

describe("renderDefinedType", () => {
  test("renders struct type", async () => {
    const type = definedTypeNode({
      name: "metadata",
      docs: ["Metadata structure"],
      type: structTypeNode([
        structFieldTypeNode({
          name: "version",
          type: numberTypeNode("u8"),
        }),
        structFieldTypeNode({
          name: "name",
          type: stringTypeNode("utf8"),
        }),
      ]),
    });

    const markdown = renderDefinedType(type, mockContext);
    const formatted = await prettier.format(markdown, { parser: "markdown" });

    expect(formatted).toContain("### metadata");
    expect(formatted).toContain("Metadata structure");
    expect(formatted).toContain("```typescript");
    expect(formatted).toContain("version: bigint;");
    expect(formatted).toContain("name: string;");
  });

  test("renders enum type", async () => {
    const type = definedTypeNode({
      name: "status",
      type: enumTypeNode([
        enumEmptyVariantTypeNode("idle"),
        enumEmptyVariantTypeNode("active"),
        enumStructVariantTypeNode(
          "error",
          structTypeNode([
            structFieldTypeNode({
              name: "code",
              type: numberTypeNode("u32"),
            }),
          ]),
        ),
        enumTupleVariantTypeNode(
          "result",
          tupleTypeNode([numberTypeNode("u64"), stringTypeNode("utf8")]),
        ),
      ]),
    });

    const markdown = renderDefinedType(type, mockContext);
    const formatted = await prettier.format(markdown, { parser: "markdown" });

    expect(formatted).toContain("### status");
    expect(formatted).toContain('| { kind: "idle" }');
    expect(formatted).toContain('| { kind: "active" }');
    expect(formatted).toContain('| { kind: "error"; code: bigint }');
    expect(formatted).toContain(
      '| { kind: "result"; value: [bigint, string] }',
    );
  });
});
