import type { AccountNode,
  assertIsNode,
  bottomUpTransformerVisitor,
  camelCase,
  type rootNodeVisitor } from "codama";

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
): ReturnType<typeof rootNodeVisitor> {
  return bottomUpTransformerVisitor([
    {
      select: "[accountNode]",
      transform: (node): AccountNode => {
        assertIsNode(node, "accountNode");
        const newName = mapping[node.name];
        if (!newName) {
          return node;
        }
        return {
          ...node,
          name: camelCase(newName),
        };
      },
    },
  ]);
}
