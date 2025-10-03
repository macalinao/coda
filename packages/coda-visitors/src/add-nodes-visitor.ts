import type {
  BottomUpNodeTransformerWithSelector,
  ProgramNodeInput,
} from "codama";
import {
  assertIsNode,
  bottomUpTransformerVisitor,
  camelCase,
  programLinkNode,
  programNode,
} from "codama";

export type ProgramAdditions = Partial<ProgramNodeInput>;

/**
 * Adds nodes to programs.
 * @param map
 * @returns
 */
export function addNodesVisitor(map: Record<string, ProgramAdditions>) {
  return bottomUpTransformerVisitor(
    Object.entries(map).flatMap(
      ([name, updates]): BottomUpNodeTransformerWithSelector[] => {
        const newName =
          typeof updates === "object" && "name" in updates && updates.name
            ? camelCase(updates.name)
            : undefined;

        const transformers: BottomUpNodeTransformerWithSelector[] = [
          {
            select: `[programNode]${name}`,
            transform: (node) => {
              assertIsNode(node, "programNode");
              return programNode({
                ...node,
                accounts: [...node.accounts, ...(updates.accounts ?? [])],
                instructions: [
                  ...node.instructions,
                  ...(updates.instructions ?? []),
                ],
                definedTypes: [
                  ...node.definedTypes,
                  ...(updates.definedTypes ?? []),
                ],
                errors: [...node.errors, ...(updates.errors ?? [])],
                pdas: [...node.pdas, ...(updates.pdas ?? [])],
              });
            },
          },
        ];

        if (newName) {
          transformers.push({
            select: `[programLinkNode]${name}`,
            transform: (node) => {
              assertIsNode(node, "programLinkNode");
              return programLinkNode(newName);
            },
          });
        }

        return transformers;
      },
    ),
  );
}
