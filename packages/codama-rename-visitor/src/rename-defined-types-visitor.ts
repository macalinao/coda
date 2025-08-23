import type { DefinedTypeNode, Node } from "codama";
import {
  assertIsNode,
  bottomUpTransformerVisitor,
  camelCase,
  rootNodeVisitor,
  visit,
} from "codama";

/**
 * Transform function that renames a defined type node based on a mapping.
 *
 * @param node - The node to transform
 * @param mapping - Object mapping old defined type names to new defined type names
 * @returns The transformed defined type node
 */
export function renameDefinedTypeTransform(
  node: Node,
  mapping: Record<string, string>,
): DefinedTypeNode {
  assertIsNode(node, "definedTypeNode");
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
        transform: (node) => renameDefinedTypeTransform(node, mapping),
      },
    ]);
    return visit(root, typeVisitor);
  });
}
