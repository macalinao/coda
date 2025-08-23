import type { DefinedTypeNode } from "codama";
import {
  assertIsNode,
  bottomUpTransformerVisitor,
  camelCase,
  rootNodeVisitor,
  visit,
} from "codama";

/**
 * Creates a visitor that renames defined types in a Codama IDL.
 *
 * @param mapping - Object mapping old defined type names to new defined type names
 * @returns A root node visitor that renames defined types
 *
 * @example
 * ```typescript
 * const visitor = renameDefinedTypesVisitor({
 *   "counter": "counterAccount",
 *   "config": "programConfig"
 * });
 * codama.update(visitor);
 * ```
 */
export function renameDefinedTypesVisitor(
  mapping: Record<string, string>,
): ReturnType<typeof rootNodeVisitor> {
  return rootNodeVisitor((root) => {
    const typeVisitor = bottomUpTransformerVisitor([
      {
        select: "[definedTypeNode]",
        transform: (node) => {
          assertIsNode(node, "definedTypeNode");
          const newName = mapping[node.name];
          if (!newName) {
            return node;
          }
          return {
            ...node,
            name: camelCase(newName),
          } as DefinedTypeNode;
        },
      },
    ]);
    return visit(root, typeVisitor);
  });
}
