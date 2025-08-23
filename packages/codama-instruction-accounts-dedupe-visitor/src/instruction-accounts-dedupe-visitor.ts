import type { AnchorIdl } from "@codama/nodes-from-anchor";
import { rootNodeVisitor } from "codama";
import { instructionAccountsDedupeProgramVisitor } from "./instruction-accounts-dedupe-program-visitor.js";

/**
 * Creates a Codama visitor that deduplicates and flattens nested instruction accounts from an Anchor IDL.
 *
 * This visitor addresses the issue where Anchor IDLs can have nested account structures (account groups)
 * that need to be flattened into a single level for proper code generation. It preserves the relationships
 * between parent and child accounts through naming conventions.
 *
 * @param idl - The Anchor IDL containing the instruction definitions with potentially nested accounts
 * @returns A root node visitor that transforms all instruction nodes to have flattened account structures
 *
 * @example
 * ```typescript
 * // Given an Anchor IDL with nested accounts:
 * // {
 * //   name: "mintAccounts",
 * //   accounts: [
 * //     { name: "mint", ... },
 * //     { name: "metadata", ... }
 * //   ]
 * // }
 *
 * // The visitor will flatten to:
 * // [
 * //   { name: "mintAccounts_mint", ... },
 * //   { name: "mintAccounts_metadata", ... }
 * // ]
 *
 * const root = rootNodeFromAnchor(idl);
 * const visitor = instructionAccountsDedupeVisitor(idl);
 * const transformedRoot = visit(root, visitor);
 * ```
 *
 * @remarks
 * - Account names are joined with underscores to maintain parent-child relationships
 * - PDA seed paths are automatically updated to match the flattened structure
 * - All account metadata and constraints are preserved during flattening
 * - The visitor operates on instruction nodes using a bottom-up transformer
 */
export function instructionAccountsDedupeVisitor(
  idl: AnchorIdl,
): ReturnType<typeof rootNodeVisitor> {
  return rootNodeVisitor((node) => {
    // Apply the program visitor to the program node
    const transformedProgram = instructionAccountsDedupeProgramVisitor(
      idl,
      node.program,
    );

    return {
      ...node,
      program: transformedProgram,
    };
  });
}
