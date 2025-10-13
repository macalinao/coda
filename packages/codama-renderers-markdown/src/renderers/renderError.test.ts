/// <reference types="bun" />
import { describe, expect, test } from "bun:test";
import { errorNode } from "@codama/nodes";
import { renderError } from "./renderError.js";

describe("renderError", () => {
  test("renders error node", () => {
    const error = errorNode({
      name: "insufficientFunds",
      code: 1001,
      message: "Insufficient funds for operation",
      docs: ["This error occurs when the account lacks sufficient balance"],
    });

    const markdown = renderError(error);

    expect(markdown).toBe(
      "- **1001 - InsufficientFunds**: Insufficient funds for operation *(Hex: `0x3e9`)*",
    );
  });
});
