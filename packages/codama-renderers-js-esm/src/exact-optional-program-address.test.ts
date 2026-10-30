/// <reference types="bun" />

import { describe, expect, test } from "bun:test";
import { allowUndefinedProgramAddress } from "./exact-optional-program-address.ts";

describe("allowUndefinedProgramAddress", () => {
  test("widens the instruction builder programAddress override", () => {
    expect(
      allowUndefinedProgramAddress(
        "export function getFooInstruction(input: FooInput, config?: { programAddress?: TProgramAddress | { readonly address: TProgramAddress } } ): FooInstruction {",
      ),
    ).toBe(
      "export function getFooInstruction(input: FooInput, config?: { programAddress?: TProgramAddress | { readonly address: TProgramAddress } | undefined } ): FooInstruction {",
    );
  });

  test("is idempotent", () => {
    const once = allowUndefinedProgramAddress(
      "config?: { programAddress?: TProgramAddress | { readonly address: TProgramAddress } }",
    );
    expect(allowUndefinedProgramAddress(once)).toBe(once);
  });

  test("leaves other programAddress declarations alone", () => {
    const code = [
      "config: { programAddress?: Address | HasAddress | undefined } = {}",
      "config?: { programAddress?: Address | HasAddress }",
    ].join("\n");
    expect(allowUndefinedProgramAddress(code)).toBe(code);
  });
});
