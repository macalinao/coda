import type { AccountValueNode, PublicKeyValueNode } from "codama";
import {
  pdaNode,
  pdaSeedValueNode,
  pdaValueNode,
  publicKeyTypeNode,
  publicKeyValueNode,
  variablePdaSeedNode,
} from "codama";

export const associatedTokenAccountPdaNode = pdaNode({
  name: "associatedTokenAccount",
  programId: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
  seeds: [
    variablePdaSeedNode("owner", publicKeyTypeNode()),
    variablePdaSeedNode("tokenProgram", publicKeyTypeNode()),
    variablePdaSeedNode("mint", publicKeyTypeNode()),
  ],
});

export const associatedTokenAccountValueNode = ({
  owner,
  mint,
  tokenProgram = publicKeyValueNode(
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  ),
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
