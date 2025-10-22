import type { AccountValueNode, PublicKeyValueNode } from "codama";
import { ASSOCIATED_TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";
import {
  pdaNode,
  pdaSeedValueNode,
  pdaValueNode,
  publicKeyTypeNode,
  variablePdaSeedNode,
} from "codama";
import { TOKEN_PROGRAM_VALUE_NODE } from "./program-value-nodes.js";

export const associatedTokenAccountPdaNode = pdaNode({
  name: "associatedTokenAccount",
  docs: "Associated Token Account",
  programId: ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
  seeds: [
    variablePdaSeedNode("owner", publicKeyTypeNode()),
    variablePdaSeedNode("tokenProgram", publicKeyTypeNode()),
    variablePdaSeedNode("mint", publicKeyTypeNode()),
  ],
});

export const associatedTokenAccountValueNode = ({
  owner,
  mint,
  tokenProgram = TOKEN_PROGRAM_VALUE_NODE,
}: {
  owner: AccountValueNode;
  mint: AccountValueNode;
  tokenProgram?: PublicKeyValueNode | AccountValueNode;
}) =>
  pdaValueNode(associatedTokenAccountPdaNode, [
    pdaSeedValueNode("owner", owner),
    pdaSeedValueNode("tokenProgram", tokenProgram),
    pdaSeedValueNode("mint", mint),
  ]);
