import type { DefinedTypeNode, InstructionNode, Node, RootNode } from "codama";
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
  /** Mapping of old instruction names to new instruction names */
  instructions?: Record<string, string>;
  /** Mapping of old event names (as defined types) to new event names */
  events?: Record<string, string>;
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
 * Creates a visitor that renames events (as defined types) in a Codama IDL.
 *
 * Events in Anchor IDLs are typically converted to defined types in Codama,
 * so this visitor renames specific defined types that represent events.
 *
 * @param mapping - Object mapping old event names to new event names
 * @param eventSuffix - Optional suffix to identify event types (default: "Event")
 * @returns A root node visitor that renames events
 *
 * @example
 * ```typescript
 * const visitor = renameEventsVisitor({
 *   "tokenMinted": "nftMinted",
 *   "transferComplete": "transferFinished"
 * });
 * codama.update(visitor);
 * ```
 */
export function renameEventsVisitor(
  mapping: Record<string, string>,
  eventSuffix = "Event",
): ReturnType<typeof rootNodeVisitor> {
  return rootNodeVisitor((root) => {
    const eventVisitor = bottomUpTransformerVisitor([
      {
        select: "[definedTypeNode]",
        transform: (node) => {
          assertIsNode(node, "definedTypeNode");

          // Check if this is an event type (by suffix or by being in the mapping)
          const isEventBySuffix = node.name.endsWith(eventSuffix);
          const isEventInMapping = mapping[node.name] !== undefined;

          if (!(isEventBySuffix || isEventInMapping)) {
            return node;
          }

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
    return visit(root, eventVisitor);
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
    // Check if this is the legacy single-program format
    // (has instructions, events, or definedTypes at the top level)
    const isLegacyFormat =
      "instructions" in renamesByProgram ||
      "events" in renamesByProgram ||
      "definedTypes" in renamesByProgram;

    if (isLegacyFormat) {
      // Legacy support: treat as single program renames
      const options = renamesByProgram as unknown as RenameVisitorOptions;
      let transformedRoot = root;

      // Apply instruction renaming
      if (
        options.instructions &&
        Object.keys(options.instructions).length > 0
      ) {
        transformedRoot = visit(
          transformedRoot,
          renameInstructionsVisitor(options.instructions),
        ) as RootNode;
      }

      // Apply event renaming
      if (options.events && Object.keys(options.events).length > 0) {
        transformedRoot = visit(
          transformedRoot,
          renameEventsVisitor(options.events),
        ) as RootNode;
      }

      // Apply defined type renaming
      if (
        options.definedTypes &&
        Object.keys(options.definedTypes).length > 0
      ) {
        transformedRoot = visit(
          transformedRoot,
          renameDefinedTypesVisitor(options.definedTypes),
        ) as RootNode;
      }

      return transformedRoot;
    }

    // New format: program-specific renames
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

      // Add event/defined type renames for this program
      if (renameOptions.events || renameOptions.definedTypes) {
        const allTypeRenames = {
          ...(renameOptions.events ?? {}),
          ...(renameOptions.definedTypes ?? {}),
        };

        Object.entries(allTypeRenames).forEach(([oldName, newName]) => {
          transforms.push({
            select: `[programNode]${programName}.[definedTypeNode]${oldName}`,
            transform: (node) => {
              assertIsNode(node, "definedTypeNode");
              return {
                ...node,
                name: camelCase(newName),
              } as DefinedTypeNode;
            },
          });
        });
      }
    });

    if (transforms.length === 0) {
      return root;
    }

    const visitor = bottomUpTransformerVisitor(transforms);
    return visit(root, visitor);
  });
}
