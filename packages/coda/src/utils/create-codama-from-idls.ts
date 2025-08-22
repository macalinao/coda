import type { AnchorIdl, IdlV00, IdlV01 } from "@codama/nodes-from-anchor";
import {
  programNodeFromAnchorV00,
  programNodeFromAnchorV01,
} from "@codama/nodes-from-anchor";
import type { Codama } from "codama";
import { createFromRoot, rootNode } from "codama";

/**
 * Create a Codama instance from IDLs
 */
export function createCodamaFromIdls(idls: AnchorIdl[]): Codama {
  if (idls.length === 0) {
    throw new Error("No IDL files were loaded");
  }

  console.log(
    `Creating Codama nodes from ${idls.length.toString()} Anchor IDL(s)...`,
  );

  // Create program nodes from IDLs
  const programNodes = idls.map((idl) => {
    if (
      idl.metadata &&
      "spec" in idl.metadata &&
      idl.metadata.spec === "0.1.0"
    ) {
      return programNodeFromAnchorV01(idl as unknown as IdlV01);
    }
    return programNodeFromAnchorV00(idl as unknown as IdlV00);
  });

  const [firstProgramNode, ...restProgramNodes] = programNodes;
  if (!firstProgramNode) {
    throw new Error("Unexpected: No program nodes loaded");
  }

  const root = rootNode(firstProgramNode, restProgramNodes);
  return createFromRoot(root);
}
