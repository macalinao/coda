/// <reference types="bun" />

import { describe, expect, test } from "bun:test";
import { makeSyntaxErasable } from "./erasable-syntax.ts";

describe("makeSyntaxErasable", () => {
  test("replaces a scalar enum with a const object and a union type", () => {
    const code = makeSyntaxErasable(
      ["export enum Key {", "  Uninitialized,", "  Asset,", "}"].join("\n"),
    );

    expect(code).toBe(
      [
        `const KeyLookup = { 0: "Uninitialized", 1: "Asset", Uninitialized: 0, Asset: 1 } as const;`,
        "",
        "export const Key: Omit<typeof KeyLookup, number> = KeyLookup;",
        "",
        "export type Key = (typeof Key)[keyof typeof Key];",
      ].join("\n"),
    );
  });

  test("keeps the docblock on the exported declaration", () => {
    const code = makeSyntaxErasable(
      [
        "/**",
        " * Schema version.",
        " */",
        "export enum Version {",
        "  V1,",
        "}",
      ].join("\n"),
    );

    expect(code).toBe(
      [
        `const VersionLookup = { 0: "V1", V1: 0 } as const;`,
        "",
        "/**",
        " * Schema version.",
        " */",
        "export const Version: Omit<typeof VersionLookup, number> = VersionLookup;",
        "",
        "export type Version = (typeof Version)[keyof typeof Version];",
      ].join("\n"),
    );
  });

  test("swallows the trailing semicolon of a defined-type enum", () => {
    const code = makeSyntaxErasable("export enum Key { Asset };");

    expect(code).toEndWith("export type Key = (typeof Key)[keyof typeof Key];");
  });

  test("leaves an unrelated docblock above other code alone", () => {
    const code = makeSyntaxErasable(
      [
        "/** Unrelated. */",
        "export const answer = 42;",
        "",
        "export enum Key {",
        "  Asset,",
        "}",
      ].join("\n"),
    );

    expect(code).toContain("/** Unrelated. */\nexport const answer = 42;");
    expect(code).toContain(
      "export const Key: Omit<typeof KeyLookup, number> = KeyLookup;",
    );
  });

  test("keeps the enum members reachable in value positions", () => {
    const code = makeSyntaxErasable(
      [
        "export enum SplTokenInstruction {",
        "  MintTokens,",
        "}",
        "",
        "export function identify(): SplTokenInstruction {",
        "  return SplTokenInstruction.MintTokens;",
        "}",
      ].join("\n"),
    );

    expect(code).toContain("return SplTokenInstruction.MintTokens;");
  });

  test("queries instruction discriminants in type positions with typeof", () => {
    const code = makeSyntaxErasable(
      [
        "export enum SplTokenInstruction {",
        "  MintTokens,",
        "}",
        "",
        "export type ParsedSplTokenInstruction =",
        "  | ({",
        "      instructionType: SplTokenInstruction.MintTokens;",
        "    } & ParsedMintTokensInstruction);",
        "",
        "const parsed = {",
        "  instructionType: SplTokenInstruction.MintTokens,",
        "};",
      ].join("\n"),
    );

    expect(code).toContain(
      "instructionType: typeof SplTokenInstruction.MintTokens;",
    );
    expect(code).toContain("instructionType: SplTokenInstruction.MintTokens,");
  });

  test("queries single-line union discriminants with typeof", () => {
    const code = makeSyntaxErasable(
      [
        "export enum SplTokenInstruction { MintTokens };",
        "",
        "export type ParsedSplTokenInstruction<TProgram extends string> =",
        "| { instructionType: SplTokenInstruction.MintTokens } & ParsedMintTokensInstruction<TProgram>",
      ].join("\n"),
    );

    expect(code).toContain(
      "| { instructionType: typeof SplTokenInstruction.MintTokens } &",
    );
  });

  test("leaves discriminants of enums it did not rewrite alone", () => {
    const code = makeSyntaxErasable(
      "  instructionType: SomeExternalEnum.Transfer;",
    );

    expect(code).toBe("  instructionType: SomeExternalEnum.Transfer;");
  });

  test("replaces the angle-bracket plugin assertion with an as assertion", () => {
    const code = makeSyntaxErasable(
      [
        "return extendClient(client, {",
        "  splToken: <SplTokenPlugin>{",
        "    pdas: { mint: findMintPda },",
        "  },",
        "});",
      ].join("\n"),
    );

    expect(code).toBe(
      [
        "return extendClient(client, {",
        "  splToken: {",
        "    pdas: { mint: findMintPda },",
        "  } as SplTokenPlugin,",
        "});",
      ].join("\n"),
    );
  });

  test("does not end the plugin object on a brace inside a string", () => {
    const code = makeSyntaxErasable(
      ['const x = <SplTokenPlugin>{ name: "}" };'].join("\n"),
    );

    expect(code).toBe('const x = { name: "}" } as SplTokenPlugin;');
  });

  test("leaves code without non-erasable syntax untouched", () => {
    const code = "export type Key = 0 | 1;\n";

    expect(makeSyntaxErasable(code)).toBe(code);
  });

  test("stays linear on many unterminated enum declarations", () => {
    // The witness CodeQL reported for js/polynomial-redos: every prefix looks
    // like a declaration but none closes, so a pattern that scans for the
    // closing brace restarts that scan at each one. Quadratic behaviour takes
    // minutes here; linear behaviour takes milliseconds.
    const code = "export enum A {|".repeat(50_000);

    const started = performance.now();
    expect(makeSyntaxErasable(code)).toBe(code);
    expect(performance.now() - started).toBeLessThan(1_000);
  });
});
