import type { Node } from "codama";
import { assertIsNode, bottomUpTransformerVisitor } from "codama";

/**
 * Docs for the fields of a struct, keyed by field name. Each value may be a
 * single line or an array of lines.
 */
export type StructFieldDocsMap = Record<string, string | string[]>;

/**
 * A map of struct/type names to the docs for their fields.
 *
 * The outer key is the (camelCase) name of a defined type, account, or any
 * other node that contains a struct. The inner key is the field name.
 */
export type StructFieldDocs = Record<string, StructFieldDocsMap>;

/**
 * Creates a visitor that injects docs onto individual struct fields.
 *
 * Codama's built-in `updateInstructionsVisitor` and `updateDefinedTypesVisitor`
 * can set docs on instructions, instruction accounts, instruction arguments and
 * whole defined types, but they cannot reach the individual fields of a struct.
 * This visitor fills that gap so that account data fields and the fields of
 * instruction argument structs can be documented.
 *
 * @param map - A map of type/struct names to their per-field docs.
 * @returns A bottom-up transformer visitor that sets the field docs.
 *
 * @example
 * ```typescript
 * setStructFieldDocsVisitor({
 *   createV1Args: {
 *     name: "The name of the asset.",
 *     uri: "The URI pointing to the asset's off-chain JSON metadata.",
 *   },
 * });
 * ```
 */
export function setStructFieldDocsVisitor(map: StructFieldDocs) {
  return bottomUpTransformerVisitor(
    Object.entries(map).flatMap(([typeName, fields]) =>
      Object.entries(fields).map(([fieldName, docs]) => ({
        select: `${typeName}.[structFieldTypeNode]${fieldName}`,
        transform: (node: Node) => {
          assertIsNode(node, "structFieldTypeNode");
          return {
            ...node,
            docs: Array.isArray(docs) ? docs : [docs],
          };
        },
      })),
    ),
  );
}
