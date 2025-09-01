import type { Node } from "codama";
import type { ProgramRenameOptions } from "./types.js";
import { bottomUpTransformerVisitor, rootNodeVisitor, visit } from "codama";
import { renameAccountTransform } from "./rename-accounts-visitor.js";
import { renameDefinedTypeTransform } from "./rename-defined-types-visitor.js";
import { renameInstructionTransform } from "./rename-instructions-visitor.js";

/**
 * Creates a visitor that renames accounts, instructions, and defined types in specific programs.
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
 *     },
 *     accounts: {
 *       miner: "minerAccount"
 *     }
 *   },
 *   token: {
 *     instructions: {
 *       transfer: "transferTokens",
 *       mint: "mintNft"
 *     },
 *     definedTypes: {
 *       tokenData: "tokenMetadata"
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
              transform: (node) =>
                renameInstructionTransform(node, { [oldName]: newName }),
            });
          },
        );
      }

      if (renameOptions.accounts) {
        Object.entries(renameOptions.accounts).forEach(([oldName, newName]) => {
          transforms.push({
            select: `[programNode]${programName}.[accountNode]${oldName}`,
            transform: (node) =>
              renameAccountTransform(node, { [oldName]: newName }),
          });
        });
      }

      // Add defined type renames for this program
      if (renameOptions.definedTypes) {
        Object.entries(renameOptions.definedTypes ?? {}).forEach(
          ([oldName, newName]) => {
            transforms.push({
              select: `[programNode]${programName}.[definedTypeNode]${oldName}`,
              transform: (node) =>
                renameDefinedTypeTransform(node, { [oldName]: newName }),
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
