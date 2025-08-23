import type { RootNode } from "@codama/nodes";
import { rootNode } from "@codama/nodes";
import type { AnchorIdl } from "@codama/nodes-from-anchor";
import { programNodeFromAnchor } from "./program-node-from-anchor.js";

/**
 * Creates a Codama root node from multiple Anchor IDLs.
 *
 * This function takes an array of Anchor IDL objects and converts them into
 * a single Codama root node that can be used with Codama visitors for
 * code generation and AST transformation.
 *
 * @param idls - An array of Anchor IDL objects to convert
 * @returns A Codama root node containing all programs from the IDLs
 *
 * @throws {Error} If no IDL files are provided
 * @throws {Error} If no program nodes could be created
 *
 * @example
 * ```typescript
 * import { rootNodeFromAnchorIdls } from "@macalinao/codama-nodes-from-anchor-x";
 * import { visit } from "codama";
 *
 * const idls = [idl1, idl2, idl3];
 * const root = rootNodeFromAnchorIdls(idls);
 *
 * // Use with Codama visitors
 * visit(root, myVisitor);
 * ```
 *
 * @remarks
 * - Supports both Anchor IDL v0.0.0 and v0.1.0 formats
 * - The first IDL becomes the main program, others are additional programs
 * - Use this when you need to work with multiple related programs together
 */
export function rootNodeFromAnchorIdls(idls: AnchorIdl[]): RootNode {
  if (idls.length === 0) {
    throw new Error("No IDL files were provided");
  }

  // Create program nodes from IDLs
  const programNodes = idls.map((idl) => programNodeFromAnchor(idl));

  const [firstProgramNode, ...restProgramNodes] = programNodes;
  if (!firstProgramNode) {
    throw new Error("No program nodes could be created from the provided IDLs");
  }

  return rootNode(firstProgramNode, restProgramNodes);
}
