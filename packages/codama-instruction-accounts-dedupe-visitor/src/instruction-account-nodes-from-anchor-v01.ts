import type { IdlV01InstructionAccountItem } from "@codama/nodes-from-anchor";
import type {
  AccountNode,
  InstructionAccountNode,
  InstructionArgumentNode,
} from "codama";
import { instructionAccountNodeFromAnchorV01 } from "@codama/nodes-from-anchor";

/**
 * Recursively flattens nested instruction account structures from Anchor IDL v0.1.0 format.
 *
 * This function handles the nested account structures (account groups) that appear in
 * Anchor IDLs and flattens them into a single array of instruction account nodes.
 * Parent-child relationships are preserved through naming conventions.
 *
 * @param allAccounts - All account nodes available in the program
 * @param instructionArguments - Arguments for the instruction
 * @param idl - The instruction account items from the Anchor IDL, potentially nested
 * @param parent - The parent account name prefix for nested accounts
 * @returns Flattened array of instruction account nodes
 *
 * @example
 * ```typescript
 * // Given nested accounts:
 * const nested = [
 *   {
 *     name: "mintAccounts",
 *     accounts: [
 *       { name: "mint", ... },
 *       { name: "metadata", ... }
 *     ]
 *   }
 * ];
 *
 * // Returns flattened:
 * // [
 * //   { name: "mintAccounts_mint", ... },
 * //   { name: "mintAccounts_metadata", ... }
 * // ]
 * ```
 *
 * @remarks
 * - Account names are joined with underscores when nested
 * - PDA seed paths are updated to include the parent prefix
 * - Recursively processes nested account groups
 */
export function instructionAccountNodesFromAnchorV01(
  allAccounts: AccountNode[],
  instructionArguments: InstructionArgumentNode[],
  idl: IdlV01InstructionAccountItem[],
  parent: string | null = null,
): InstructionAccountNode[] {
  return idl.flatMap((account) =>
    "accounts" in account
      ? instructionAccountNodesFromAnchorV01(
          allAccounts,
          instructionArguments,
          account.accounts,
          parent ? `${parent}_${account.name}` : account.name,
        )
      : [
          instructionAccountNodeFromAnchorV01(
            account,
            instructionArguments,
            parent ?? undefined,
          ),
        ],
  );
}
