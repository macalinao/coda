/// <reference types="bun" />
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { programNode } from "@codama/nodes";
import { visit } from "@codama/visitors-core";
import { renderMarkdownVisitor } from "./render-markdown-visitor.js";

describe("renderMarkdownVisitor", () => {
  test("generates markdown files for programs", async () => {
    const testDir = join(tmpdir(), `markdown-test-${String(Date.now())}`);

    try {
      const program = programNode({
        name: "testProgram",
        publicKey: "11111111111111111111111111111111",
      });

      const visitor = renderMarkdownVisitor(testDir, {
        formatWithPrettier: true,
      });

      // Visit the program to generate markdown
      const rootNode = {
        kind: "rootNode" as const,
        program,
        additionalPrograms: [],
        standard: "codama" as const,
        version: "0.1.0" as const,
      };
      await visit(rootNode, visitor);

      // Check that the file was created with kebab-case naming
      const expectedFile = join(testDir, "test-program.md");
      expect(existsSync(expectedFile)).toBe(true);

      // Read and verify content
      const content = readFileSync(expectedFile, "utf-8");
      expect(content).toContain("# Test Program Program");
      expect(content).toContain(
        "- Program ID: `11111111111111111111111111111111`",
      );
    } finally {
      // Clean up test directory
      if (existsSync(testDir)) {
        rmSync(testDir, { recursive: true });
      }
    }
  });

  test("handles multiple programs", async () => {
    const testDir = join(tmpdir(), `markdown-test-${String(Date.now())}`);

    try {
      const program1 = programNode({
        name: "firstProgram",
        publicKey: "11111111111111111111111111111111",
      });

      const program2 = programNode({
        name: "secondProgram",
        publicKey: "22222222222222222222222222222222",
      });

      const visitor = renderMarkdownVisitor(testDir, {
        formatWithPrettier: false, // Skip prettier for faster test
      });

      // Visit both programs
      const rootNode = {
        kind: "rootNode" as const,
        program: program1,
        additionalPrograms: [program2],
        standard: "codama" as const,
        version: "0.1.0" as const,
      };
      await visit(rootNode, visitor);

      // Check that both files were created
      expect(existsSync(join(testDir, "first-program.md"))).toBe(true);
      expect(existsSync(join(testDir, "second-program.md"))).toBe(true);
    } finally {
      // Clean up test directory
      if (existsSync(testDir)) {
        rmSync(testDir, { recursive: true });
      }
    }
  });
});
