import type { AnchorIdl } from "@codama/nodes-from-anchor";
import {
  constant,
  definePdas,
  programHandle,
  publicKeyTypeNode,
  updateAccountsVisitor,
  variable,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";
import idlJson from "./idl.json" with { type: "json" };
import protocol from "../protocol.config.ts";

/** The program's Anchor IDL. */
export const idl: AnchorIdl = idlJson as AnchorIdl;

export const program = programHandle("quarryRegistry");

export const pdas = definePdas(program, {
  registry: {
    docs: ["Registry tracking all quarries for a rewarder"],
    seeds: [
      constant("QuarryRegistry"),
      variable("rewarder", publicKeyTypeNode()),
    ],
  },
});

export default defineProgram({
  protocol,
  name: "registry",
  program,
  idl,
  pdas,
  // The on-chain program. Addresses were checked with getAccountInfo on
  // mainnet-beta and devnet (2026-10).
  metadata: {
    displayName: "Quarry Registry",
    description: "Keeps an on-chain list of the quarries of a rewarder.",
    repository: "https://github.com/QuarryProtocol/quarry",
    addresses: {
      devnet: "QREGBnEj9Sa5uR91AV8u3FxThgP5ZCvdZUW2bHAkfNc",
    },
    docs: "https://docs.rs/quarry-registry",
  },

  visitors: [
    updateAccountsVisitor({
      registry: {
        pda: pdas.registry.link,
      },
    }),
    pdas.visitor,
  ],
});
