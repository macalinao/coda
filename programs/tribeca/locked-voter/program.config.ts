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
  package: {
    description:
      "TypeScript client for the Tribeca Locked Voter (vote escrow) program",
    keywords: ["tribeca", "governance", "voting", "vote-escrow", "dao"],
    version: "0.1.0",
    releaseNotes: [
      "Split out of `@solana-programs/tribeca`, which now re-exports this package.",
    ],
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
