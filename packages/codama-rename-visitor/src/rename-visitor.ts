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
interface RenameTransform {
  select: string;
  transform: (node: Node) => Node | null;
}

/**
 * Builds a transform for each entry of a rename record, targeting nodes of the
 * given kind within the given program.
 */
function buildRenameTransforms(
  programName: string,
  nodeKind: string,
  renames: Record<string, string> | undefined,
  rename: (node: Node, mapping: Record<string, string>) => Node | null,
): RenameTransform[] {
  if (!renames) {
    return [];
  }
  return Object.entries(renames).map(([oldName, newName]) => ({
    select: `[programNode]${programName}.[${nodeKind}]${oldName}`,
    transform: (node: Node) => rename(node, { [oldName]: newName }),
  }));
}

export function renameVisitor(
  renamesByProgram: Record<string, ProgramRenameOptions>,
): ReturnType<typeof rootNodeVisitor> {
  return rootNodeVisitor((root) => {
    const transforms: RenameTransform[] = [];

    // Process each program's rename configuration
    for (const [programName, renameOptions] of Object.entries(
      renamesByProgram,
    )) {
      transforms.push(
        ...buildRenameTransforms(
          programName,
          "instructionNode",
          renameOptions.instructions,
          renameInstructionTransform,
        ),
        ...buildRenameTransforms(
          programName,
          "accountNode",
          renameOptions.accounts,
          renameAccountTransform,
        ),
        ...buildRenameTransforms(
          programName,
          "definedTypeNode",
          renameOptions.definedTypes,
          renameDefinedTypeTransform,
        ),
      );
    }

    if (transforms.length === 0) {
      return root;
    }

    const visitor = bottomUpTransformerVisitor(transforms);
    return visit(root, visitor);
  });
}
