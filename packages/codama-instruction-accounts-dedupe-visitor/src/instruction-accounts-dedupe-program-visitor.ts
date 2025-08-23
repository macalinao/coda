import type { AnchorIdl } from "@codama/nodes-from-anchor";
import type { ProgramNode } from "codama";
import {
  assertIsNode,
  bottomUpTransformerVisitor,
  camelCase,
  visit,
} from "codama";
import { instructionAccountNodesFromAnchorV01 } from "./instruction-account-nodes-from-anchor-v01.js";

/**
 * Creates a Codama program visitor that deduplicates and flattens nested instruction accounts from an Anchor IDL.
 *
 * This is a program-level visitor that can be composed with other visitors. It transforms
 * instruction nodes to have flattened account structures, removing nested account groups.
 *
 * @param idl - The Anchor IDL containing the instruction definitions with potentially nested accounts
 * @returns A visitor that transforms all instruction nodes to have flattened account structures
 *
 * @example
 * ```typescript
 * // Use with a single program
 * const programNode = programNodeFromAnchor(idl);
 * const visitor = instructionAccountsDedupeProgramVisitor(idl);
 * const transformedProgram = visit(programNode, visitor);
 *
 * // Or compose with other visitors
 * const composedVisitor = mergeVisitor(
 *   instructionAccountsDedupeProgramVisitor(idl),
 *   otherProgramVisitor(),
 * );
 * ```
 *
 * @remarks
 * - This visitor operates at the program level, not the root level
 * - Account names are joined with underscores to maintain parent-child relationships
 * - PDA seed paths are automatically updated to match the flattened structure
 * - All account metadata and constraints are preserved during flattening
 */
export function instructionAccountsDedupeProgramVisitor(
  idl: AnchorIdl,
  programNode: ProgramNode,
): ProgramNode {
  const accountNodes = programNode.accounts;
  const instructionVisitor = bottomUpTransformerVisitor([
    {
      select: "[instructionNode]",
      transform: (instructionNode) => {
        assertIsNode(instructionNode, "instructionNode");
        const idlIx = idl.instructions.find(
          (ix) => camelCase(ix.name) === instructionNode.name,
        );
        if (!idlIx) {
          throw new Error(
            `Instruction ${instructionNode.name} not found in IDL`,
          );
        }
        // Always use the flattening visitor to handle nested accounts
        return {
          ...instructionNode,
          accounts: instructionAccountNodesFromAnchorV01(
            accountNodes,
            instructionNode.arguments,
            idlIx.accounts,
          ),
        };
      },
    },
  ]);

  return visit(programNode, instructionVisitor) as ProgramNode;
}
