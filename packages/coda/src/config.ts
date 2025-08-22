import type { AnchorIdl } from "@codama/nodes-from-anchor";
import type { Node, Visitor } from "codama";

/**
 * Context provided to visitor functions
 */
export interface VisitorContext {
  /** All parsed IDLs when using multiple IDLs */
  idls: AnchorIdl[];
}

/**
 * Configuration for Coda code generation
 */
export interface CodaConfig {
  /**
   * Path to the Anchor IDL file(s).
   * Can be:
   * - A single file path: "./target/idl/program.json"
   * - A glob pattern: "./idls/*.json"
   * - An array of paths and/or patterns: ["./idls/*.json", "./extra/program.json"]
   *
   * Glob patterns are supported for matching multiple files.
   * Overrides the --idl command line option.
   *
   * @default "./idls/*.json"
   */
  idlPath?: string | string[];

  /**
   * Output directory for the generated client.
   * Overrides the --output command line option.
   * @default "./src/generated"
   */
  outputDir?: string;

  /**
   * Output directory for the generated documentation.
   * @default "./docs"
   */
  docsPath?: string;

  /**
   * Documentation generation options.
   */
  docs?: {
    /**
     * NPM package name for the TypeScript client.
     * If provided, will add an NPM badge and link to the package in the generated documentation.
     * @example "@my-org/my-solana-client"
     */
    npmPackageName?: string;
  };

  /**
   * Additional root node visitors to apply to the Codama nodes before generating code.
   * These visitors are applied in order after the initial Anchor IDL parsing.
   * Can be either an array of visitors or a function that returns an array of visitors.
   */
  visitors?:
    | Visitor<Node | null, "rootNode">[]
    | ((context: VisitorContext) => Visitor<Node | null, "rootNode">[]);
}

/**
 * Define a Coda configuration.
 *
 * @param config - The configuration object
 * @returns The configuration object (for type safety)
 *
 * @example
 * ```typescript
 * // coda.config.mjs
 * import { defineConfig } from "@macalinao/coda";
 * import { someCustomVisitor } from "./visitors/custom.js";
 *
 * // Using an array of visitors
 * export default defineConfig({
 *   visitors: [
 *     someCustomVisitor(),
 *   ],
 * });
 *
 * // Using a function that returns visitors
 * export default defineConfig({
 *   visitors: ({ idl }) => [
 *     someCustomVisitor(idl),
 *   ],
 * });
 *
 * // Using multiple IDLs
 * export default defineConfig({
 *   idlPath: ["./idls/program1.json", "./idls/program2.json"],
 *   visitors: ({ idls }) => [
 *     someCustomVisitor(idls),
 *   ],
 * });
 * ```
 */
export function defineConfig(config: CodaConfig): CodaConfig {
  return config;
}
