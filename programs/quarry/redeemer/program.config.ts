import {
  accountValueNode,
  associatedTokenAccountValueNode,
  constant,
  definePdas,
  programHandle,
  publicKeyTypeNode,
  setInstructionAccountDefaultValuesVisitor,
  updateAccountsVisitor,
  variable,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export const program = programHandle("quarryRedeemer");

export const pdas = definePdas(program, {
  redeemer: {
    docs: ["Redeemer account for exchanging IOU tokens for redemption tokens"],
    seeds: [
      constant("Redeemer"),
      variable("iouMint", publicKeyTypeNode()),
      variable("redemptionMint", publicKeyTypeNode()),
    ],
  },
});

export default defineProgram({
  package: {
    description:
      "TypeScript client for the Quarry Redeemer program, which redeems IOU tokens for their underlying tokens",
    keywords: ["quarry", "redeemer", "ian-macalinao"],
    version: "0.1.0",
    releaseNotes: [
      "Split out of `@solana-programs/quarry`, which now re-exports this package.",
    ],
  },

  visitors: [
    updateAccountsVisitor({
      redeemer: {
        pda: pdas.redeemer.link,
      },
    }),
    pdas.visitor,
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
