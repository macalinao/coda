import type { ProgramNode } from "@codama/nodes";
import type { AnchorIdl, IdlV00, IdlV01 } from "@codama/nodes-from-anchor";
import {
  programNodeFromAnchorV00,
  programNodeFromAnchorV01,
} from "@codama/nodes-from-anchor";
import { instructionAccountsDedupeProgramVisitor } from "@macalinao/codama-instruction-accounts-dedupe-visitor";

/**
 * Creates a Codama program node from a single Anchor IDL.
 *
 * This function takes an Anchor IDL object and converts it into
 * a Codama program node that can be used with Codama visitors for
 * code generation and AST transformation. For IDL v0.1.0, it automatically
 * applies the instruction accounts dedupe visitor to flatten nested accounts.
 *
 * @param idl - An Anchor IDL object to convert
 * @returns A Codama program node from the IDL
 *
 * @example
 * ```typescript
 * import { programNodeFromAnchor } from "@macalinao/codama-nodes-from-anchor-x";
 * import { visit } from "codama";
 *
 * const idl = JSON.parse(fs.readFileSync("./idl.json", "utf-8"));
 * const program = programNodeFromAnchor(idl);
 *
 * // Use with Codama visitors
 * visit(program, myVisitor);
 * ```
 *
 * @remarks
 * - Supports both Anchor IDL v0.0.0 and v0.1.0 formats
 * - Automatically detects the IDL version and uses the appropriate parser
 * - For v0.1.0 IDLs, applies instruction accounts deduplication
 */
export function programNodeFromAnchor(idl: AnchorIdl): ProgramNode {
  // Detect IDL version and create program node
  if (idl.metadata && "spec" in idl.metadata && idl.metadata.spec === "0.1.0") {
    const idlV01 = idl as unknown as IdlV01;
    const program = programNodeFromAnchorV01(idlV01);
    return instructionAccountsDedupeProgramVisitor(idlV01, program);
  }
  return programNodeFromAnchorV00(idl as unknown as IdlV00);
}
