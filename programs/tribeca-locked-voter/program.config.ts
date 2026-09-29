import {
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  constantValueNode,
  pdaLinkNode,
  publicKeyTypeNode,
  SYSTEM_PROGRAM_VALUE_NODE,
  updateAccountsVisitor,
  variablePdaSeedNode,
  zeroableOptionTypeNode,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export default defineProgram({
  package: {
    name: "@solana-programs/tribeca-locked-voter",
    description:
      "TypeScript client for the Tribeca Locked Voter (vote escrow) program",
    keywords: ["tribeca", "governance", "voting", "vote-escrow", "dao"],
    initialVersion: "0.5.1",
  },

  visitors: [
    addPdasVisitor({
      lockedVoter: [
        {
          name: "locker",
          docs: [
            "Locker account that manages vote escrows for a specific base",
          ],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "Locker"),
            variablePdaSeedNode("base", publicKeyTypeNode()),
          ],
        },
        {
          name: "escrow",
          docs: ["Escrow account that holds locked tokens for a user"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "Escrow"),
            variablePdaSeedNode("locker", publicKeyTypeNode()),
            variablePdaSeedNode("authority", publicKeyTypeNode()),
          ],
        },
        {
          name: "whitelist",
          docs: [
            "Whitelist entry for a program that can interact with the locker",
          ],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "LockerWhitelistEntry"),
            variablePdaSeedNode("locker", publicKeyTypeNode()),
            variablePdaSeedNode("programId", publicKeyTypeNode()),
            variablePdaSeedNode(
              "owner",
              zeroableOptionTypeNode(
                publicKeyTypeNode(),
                constantValueNode(
                  publicKeyTypeNode(),
                  SYSTEM_PROGRAM_VALUE_NODE,
                ),
              ),
            ),
          ],
        },
      ],
    }),
    updateAccountsVisitor({
      locker: {
        pda: pdaLinkNode("locker"),
      },
      escrow: {
        pda: pdaLinkNode("escrow"),
      },
      lockerWhitelistEntry: {
        pda: pdaLinkNode("whitelist"),
      },
    }),
  ],
});
