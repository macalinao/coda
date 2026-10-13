import type { AnchorIdl } from "@codama/nodes-from-anchor";
import {
  constant,
  constantValueNode,
  definePdas,
  programHandle,
  publicKeyTypeNode,
  SYSTEM_PROGRAM_VALUE_NODE,
  updateAccountsVisitor,
  variable,
  zeroableOptionTypeNode,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";
import idlJson from "./idl.json" with { type: "json" };
import protocol from "../protocol.config.ts";

/** The program's Anchor IDL. */
export const idl: AnchorIdl = idlJson as AnchorIdl;

export const program = programHandle("lockedVoter");

export const pdas = definePdas(program, {
  locker: {
    docs: ["Locker account that manages vote escrows for a specific base"],
    seeds: [constant("Locker"), variable("base", publicKeyTypeNode())],
  },
  escrow: {
    docs: ["Escrow account that holds locked tokens for a user"],
    seeds: [
      constant("Escrow"),
      variable("locker", publicKeyTypeNode()),
      variable("authority", publicKeyTypeNode()),
    ],
  },
  whitelist: {
    docs: ["Whitelist entry for a program that can interact with the locker"],
    seeds: [
      constant("LockerWhitelistEntry"),
      variable("locker", publicKeyTypeNode()),
      variable("programId", publicKeyTypeNode()),
      variable(
        "owner",
        zeroableOptionTypeNode(
          publicKeyTypeNode(),
          constantValueNode(publicKeyTypeNode(), SYSTEM_PROGRAM_VALUE_NODE),
        ),
      ),
    ],
  },
});

export default defineProgram({
  protocol,
  name: "locked-voter",
  program,
  idl,
  pdas,
  // The on-chain program. Addresses were checked with getAccountInfo on
  // mainnet-beta and devnet (2026-10).
  metadata: {
    displayName: "Tribeca Locked Voter",
    description:
      "Vote escrow program: token holders lock tokens for a period of time in exchange for voting power in a Tribeca Govern governor.",
    repository: "https://github.com/TribecaHQ/tribeca",
    addresses: {
      devnet: "LocktDzaV1W2Bm9DeZeiyz4J9zs4fRqNiYqQyracRXw",
    },
    docs: "https://docs.rs/locked-voter",
  },

  visitors: [
    pdas.visitor,
    updateAccountsVisitor({
      locker: {
        pda: pdas.locker.link,
      },
      escrow: {
        pda: pdas.escrow.link,
      },
      lockerWhitelistEntry: {
        pda: pdas.whitelist.link,
      },
    }),
  ],
});
