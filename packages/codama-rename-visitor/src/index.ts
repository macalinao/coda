import type {
  AccountNode,
  DefinedTypeNode,
  InstructionNode,
  Node,
} from "codama";
import {
  assertIsNode,
  bottomUpTransformerVisitor,
  camelCase,
  rootNodeVisitor,
  visit,
} from "codama";

/**
 * Rename mapping for a single program
 */
export interface ProgramRenameOptions {
  /** Mapping of old account names to new account names */
  accounts?: Record<string, string>;
  /** Mapping of old instruction names to new instruction names */
  instructions?: Record<string, string>;
  /** Mapping of old defined type names to new defined type names */
  definedTypes?: Record<string, string>;
}

/**
 * Options for the rename visitor (legacy interface)
 */
export type RenameVisitorOptions = ProgramRenameOptions;

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
export function renameInstructionsVisitor(
  mapping: Record<string, string>,
): ReturnType<typeof rootNodeVisitor> {
  return rootNodeVisitor((root) => {
    const instructionVisitor = bottomUpTransformerVisitor([
      {
        select: "[instructionNode]",
        transform: (node) => {
          assertIsNode(node, "instructionNode");
          const newName = mapping[node.name];
          if (!newName) {
            return node;
          }
          return {
            ...node,
            name: camelCase(newName),
          } as InstructionNode;
        },
      },
    ]);
    return visit(root, instructionVisitor);
  });
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

/**
 * Creates a visitor that renames instructions, events, and defined types in specific programs.
 * This follows the same pattern as addPdasVisitor from Codama.
 *
 * @param renamesByProgram - Object mapping program names to their rename configurations
 * @returns A root node visitor that performs all specified renames
 *
 * @example
 * ```typescript
 * const visitor = renameVisitor({
 *   quarryMine: {
 *     instructions: {
 *       claimRewards: "claimRewardsMine"
 *     }
 *   },
 *   token: {
 *     instructions: {
 *       transfer: "transferTokens",
 *       mint: "mintNft"
 *     },
 *     events: {
 *       tokenMinted: "nftMinted"
 *     }
 *   }
 * });
 * codama.update(visitor);
 * ```
 */
export function renameVisitor(
  renamesByProgram: Record<string, ProgramRenameOptions>,
): ReturnType<typeof rootNodeVisitor> {
  return rootNodeVisitor((root) => {
    const transforms: {
      select: string;
      transform: (node: Node) => Node | null;
    }[] = [];

    // Process each program's rename configuration
    Object.entries(renamesByProgram).forEach(([programName, renameOptions]) => {
      // Add instruction renames for this program
      if (renameOptions.instructions) {
        Object.entries(renameOptions.instructions).forEach(
          ([oldName, newName]) => {
            transforms.push({
              select: `[programNode]${programName}.[instructionNode]${oldName}`,
              transform: (node) => {
                assertIsNode(node, "instructionNode");
                return {
                  ...node,
                  name: camelCase(newName),
                } as InstructionNode;
              },
            });
          },
        );
      }

      if (renameOptions.accounts) {
        Object.entries(renameOptions.accounts).forEach(([oldName, newName]) => {
          transforms.push({
            select: `[programNode]${programName}.[accountNode]${oldName}`,
            transform: (node): AccountNode => {
              assertIsNode(node, "accountNode");
              return {
                ...node,
                name: camelCase(newName),
              };
            },
          });
        });
      }

      // Add defined type renames for this program
      if (renameOptions.definedTypes) {
        Object.entries(renameOptions.definedTypes ?? {}).forEach(
          ([oldName, newName]) => {
            transforms.push({
              select: `[programNode]${programName}.[definedTypeNode]${oldName}`,
              transform: (node): DefinedTypeNode => {
                assertIsNode(node, "definedTypeNode");
                return {
                  ...node,
                  name: camelCase(newName),
                };
              },
            });
          },
        );
      }
    });

    if (transforms.length === 0) {
      return root;
    }

    const visitor = bottomUpTransformerVisitor(transforms);
    return visit(root, visitor);
  });
}
