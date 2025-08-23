import type { RootNode } from "@codama/nodes";
import { rootNode } from "@codama/nodes";
import type { AnchorIdl } from "@codama/nodes-from-anchor";
import { programNodeFromAnchor } from "./program-node-from-anchor.js";

/**
 * Creates a Codama root node from a single Anchor IDL.
 *
 * This function takes an Anchor IDL object and converts it into
 * a Codama root node that can be used with Codama visitors for
 * code generation and AST transformation.
 *
 * @param idl - An Anchor IDL object to convert
 * @returns A Codama root node containing the program from the IDL
 *
 * @example
 * ```typescript
 * import { rootNodeFromAnchor } from "@macalinao/codama-nodes-from-anchor-x";
 * import { visit } from "codama";
 *
 * const idl = JSON.parse(fs.readFileSync("./idl.json", "utf-8"));
 * const root = rootNodeFromAnchor(idl);
 *
 * // Use with Codama visitors
 * visit(root, myVisitor);
 * ```
 *
 * @remarks
 * - Supports both Anchor IDL v0.0.0 and v0.1.0 formats
 * - Automatically detects the IDL version and uses the appropriate parser
 * - For multiple IDLs, use `rootNodeFromAnchorIdls` instead
 */
export function rootNodeFromAnchor(idl: AnchorIdl): RootNode {
  const program = programNodeFromAnchor(idl);
  return rootNode(program);
}
