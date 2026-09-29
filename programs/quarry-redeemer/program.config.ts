import {
  accountValueNode,
  addPdasVisitor,
  associatedTokenAccountValueNode,
  constantPdaSeedNodeFromString,
  pdaLinkNode,
  publicKeyTypeNode,
  setInstructionAccountDefaultValuesVisitor,
  updateAccountsVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export default defineProgram({
  package: {
    name: "@solana-programs/quarry-redeemer",
    description:
      "TypeScript client for the Quarry Redeemer program, which redeems IOU tokens for their underlying tokens",
    keywords: ["quarry", "redeemer", "ian-macalinao"],
    initialVersion: "0.8.1",
  },

  visitors: [
    updateAccountsVisitor({
      redeemer: {
        pda: pdaLinkNode("redeemer"),
      },
    }),
    addPdasVisitor({
      quarryRedeemer: [
        {
          name: "redeemer",
          docs: [
            "Redeemer account for exchanging IOU tokens for redemption tokens",
          ],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "Redeemer"),
            variablePdaSeedNode("iouMint", publicKeyTypeNode()),
            variablePdaSeedNode("redemptionMint", publicKeyTypeNode()),
          ],
        },
      ],
    }),
    setInstructionAccountDefaultValuesVisitor([
      {
        account: "iouSource",
        defaultValue: associatedTokenAccountValueNode({
          owner: accountValueNode("sourceAuthority"),
          mint: accountValueNode("iouMint"),
        }),
      },
    ]),
  ],
});
