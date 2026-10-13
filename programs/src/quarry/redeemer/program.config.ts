import type { AnchorIdl } from "@codama/nodes-from-anchor";
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
import idlJson from "./idl.json" with { type: "json" };
import protocol from "../protocol.config.ts";

/** The program's Anchor IDL. */
export const idl: AnchorIdl = idlJson as AnchorIdl;

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
  protocol,
  name: "redeemer",
  program,
  idl,
  pdas,
  // The on-chain program. Addresses were checked with getAccountInfo on
  // mainnet-beta and devnet (2026-10).
  metadata: {
    displayName: "Quarry Redeemer",
    description: "Exchanges IOU tokens for their underlying redemption tokens.",
    repository: "https://github.com/QuarryProtocol/quarry",
    addresses: {
      devnet: "QRDxhMw1P2NEfiw5mYXG79bwfgHTdasY2xNP76XSea9",
    },
    docs: "https://docs.rs/quarry-redeemer",
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
