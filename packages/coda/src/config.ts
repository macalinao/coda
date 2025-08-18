import type { AnchorIdl } from "@codama/nodes-from-anchor";
import type { Node, Visitor } from "codama";

/**
 * Context provided to visitor functions
 */
export interface VisitorContext {
  /** The parsed Anchor IDL */
  idl: AnchorIdl;
}

/**
 * Configuration for Coda code generation
 */
export interface CodaConfig {
  /**
   * Path to the Anchor IDL file.
   * Overrides the --idl command line option.
   * @default "./target/idl/program.json"
   */
  idlPath?: string;

  /**
   * Output directory for the generated client.
   * Overrides the --output command line option.
   * @default "./src/generated"
   */
  outputDir?: string;

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
 * ```
 */
export function defineConfig(config: CodaConfig): CodaConfig {
  return config;
}
