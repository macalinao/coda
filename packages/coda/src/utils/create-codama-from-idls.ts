import type { AnchorIdl } from "@codama/nodes-from-anchor";
import { rootNodeFromAnchorIdls } from "@macalinao/codama-nodes-from-anchor-x";
import type { Codama } from "codama";
import { createFromRoot } from "codama";

/**
 * Create a Codama instance from IDLs
 */
export function createCodamaFromIdls(idls: AnchorIdl[]): Codama {
  console.log(
    `Creating Codama nodes from ${idls.length.toString()} Anchor IDL(s)...`,
  );

  const root = rootNodeFromAnchorIdls(idls);
  return createFromRoot(root);
}
