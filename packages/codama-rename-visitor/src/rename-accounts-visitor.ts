import type { AccountNode, Node, Visitor } from "codama";
import { assertIsNode, bottomUpTransformerVisitor, camelCase } from "codama";

/**
 * Transform function that renames an account node based on a mapping.
 *
 * @param node - The node to transform
 * @param mapping - Object mapping old account names to new account names
 * @returns The transformed account node
 */
export function renameAccountTransform(
  node: Node,
  mapping: Record<string, string>,
): AccountNode {
  assertIsNode(node, "accountNode");
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
 * Creates a visitor that renames accounts in a Codama IDL.
 *
 * @param mapping - Object mapping old account names to new account names
 * @returns A root node visitor that renames accounts
 *
 * @example
 * ```typescript
 * const visitor = renameAccountsVisitor({
 *   "userAccount": "user",
 *   "configAccount": "config"
 * });
 * codama.update(visitor);
 * ```
 */
export function renameAccountsVisitor(
  mapping: Record<string, string>,
): Visitor<Node | null, "rootNode"> {
  return bottomUpTransformerVisitor([
    {
      select: "[accountNode]",
      transform: (node) => renameAccountTransform(node, mapping),
    },
  ]);
}
