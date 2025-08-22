/// <reference types="bun-types" />
import { describe, expect, test } from "bun:test";
import {
  accountNode,
  constantDiscriminatorNode,
  constantValueNode,
  fieldDiscriminatorNode,
  numberTypeNode,
  numberValueNode,
  sizeDiscriminatorNode,
  stringTypeNode,
  structFieldTypeNode,
  structTypeNode,
} from "@codama/nodes";
import { LinkableDictionary } from "@codama/visitors-core";
import * as prettier from "prettier";
import type { RenderContext } from "../types.js";
import { renderAccount } from "./renderAccount.js";

const mockContext: RenderContext = {
  linkables: new LinkableDictionary(),
  options: {
    formatWithPrettier: true,
    hideDiscriminators: false, // Show discriminators in tests
  },
};

describe("renderAccount", () => {
  test("renders basic account with discriminator when hideDiscriminators is false", async () => {
    const account = accountNode({
      name: "userAccount",
      docs: ["A user account storing user data"],
      data: structTypeNode([
        structFieldTypeNode({
          name: "name",
          type: stringTypeNode("utf8"),
          docs: ["User's name"],
        }),
        structFieldTypeNode({
          name: "balance",
          type: numberTypeNode("u64"),
          docs: ["User's balance"],
        }),
      ]),
      discriminators: [
        constantDiscriminatorNode(
          constantValueNode(numberTypeNode("u8"), numberValueNode(1)),
          0,
        ),
      ],
      size: 100,
    });

    const markdown = renderAccount(account, mockContext);
    const formatted = await prettier.format(markdown, { parser: "markdown" });

    expect(formatted).toContain("### userAccount");
    expect(formatted).toContain("A user account storing user data");
    expect(formatted).toContain("**Size:** 100 bytes");
    expect(formatted).toContain("| `name`    | `string` | User's name    |");
    expect(formatted).toContain("| `balance` | `u64`    | User's balance |");
  });

  test("renders account with field discriminator", async () => {
    const account = accountNode({
      name: "versionedAccount",
      data: structTypeNode([
        structFieldTypeNode({
          name: "version",
          type: numberTypeNode("u8"),
        }),
      ]),
      discriminators: [fieldDiscriminatorNode("version", 0)],
    });

    const markdown = renderAccount(account, mockContext);
    const formatted = await prettier.format(markdown, { parser: "markdown" });

    expect(formatted).toContain("### versionedAccount");
    expect(formatted).toContain("- Field: `version`");
  });

  test("hides discriminators by default", async () => {
    const account = accountNode({
      name: "userAccount",
      data: structTypeNode([
        structFieldTypeNode({
          name: "name",
          type: stringTypeNode("utf8"),
        }),
      ]),
      discriminators: [
        constantDiscriminatorNode(
          constantValueNode(numberTypeNode("u8"), numberValueNode(1)),
          0,
        ),
      ],
    });

    const contextWithHiddenDiscriminators: RenderContext = {
      linkables: new LinkableDictionary(),
      options: {
        formatWithPrettier: true,
        // hideDiscriminators defaults to true
      },
    };

    const markdown = renderAccount(account, contextWithHiddenDiscriminators);
    const formatted = await prettier.format(markdown, { parser: "markdown" });

    expect(formatted).toContain("### userAccount");
    expect(formatted).not.toContain("**Discriminator:**");
    expect(formatted).not.toContain("Constant:");
  });

  test("renders account with size discriminator", async () => {
    const account = accountNode({
      name: "fixedAccount",
      data: structTypeNode([]),
      discriminators: [sizeDiscriminatorNode(64)],
    });

    const markdown = renderAccount(account, mockContext);
    const formatted = await prettier.format(markdown, { parser: "markdown" });

    expect(formatted).toContain("### fixedAccount");
    expect(formatted).toContain("- Size: `64`");
  });
});
