import type { Node } from "codama";
import { bottomUpTransformerVisitor } from "codama";

/**
 * Creates a visitor that fixes docs by splitting lines that contain newline characters.
 * This ensures that each doc line is a separate array element.
 *
 * @returns A bottom-up transformer visitor that splits docs
 *
 * @example
 * ```typescript
 * const visitor = fixDocsVisitor();
 * codama.update(visitor);
 * ```
 */
export function fixDocsVisitor() {
  return bottomUpTransformerVisitor([
    {
      select: "*",
      transform: (node: Node) => {
        // Check if node has docs property
        const nodeWithDocs = node as Node & { docs?: string[] };
        if (nodeWithDocs.docs) {
          return {
            ...node,
            docs: nodeWithDocs.docs.flatMap((line) => line.split("\n")),
          };
        }
        return node;
      },
    },
  ]);
}
