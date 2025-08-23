import type { InstructionNode, Node, NodeKind, Visitor } from "codama";
import { assertIsNode, bottomUpTransformerVisitor, camelCase } from "codama";

/**
 * Transform function that renames an instruction node based on a mapping.
 *
 * @param node - The node to transform
 * @param mapping - Object mapping old instruction names to new instruction names
 * @returns The transformed instruction node
 */
export function renameInstructionTransform(
  node: Node,
  mapping: Record<string, string>,
): InstructionNode {
  assertIsNode(node, "instructionNode");
  const newName = mapping[node.name];
  if (!newName) {
    return node;
  }
  return {
    ...node,
    name: camelCase(newName),
  };
}

/**
 * Creates a visitor that renames instructions in a Codama IDL.
 *
 * @param mapping - Object mapping old instruction names to new instruction names
 * @returns A root node visitor that renames instructions
 *
 * @example
 * ```typescript
 * const visitor = renameInstructionsVisitor({
 *   "transfer": "transferTokens",
 *   "mint": "mintNft"
 * });
 * codama.update(visitor);
 * ```
 */
export function renameInstructionsVisitor<
  TNodeKind extends NodeKind = NodeKind,
>(mapping: Record<string, string>): Visitor<Node | null, TNodeKind> {
  return bottomUpTransformerVisitor([
    {
      select: "[instructionNode]",
      transform: (node) => renameInstructionTransform(node, mapping),
    },
  ]);
}
