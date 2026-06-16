import {
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  constantValueNode,
  defineConfig,
  numberTypeNode,
  pdaLinkNode,
  publicKeyTypeNode,
  SYSTEM_PROGRAM_VALUE_NODE,
  updateAccountsVisitor,
  variablePdaSeedNode,
  zeroableOptionTypeNode,
} from "@macalinao/coda";

export default defineConfig({
  outputDir: "./src/generated",

  // Add custom PDAs for Tribeca programs
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
      govern: [
        {
          name: "governor",
          docs: ["Governor account that manages proposals and voting"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "TribecaGovernor"),
            variablePdaSeedNode("base", publicKeyTypeNode()),
          ],
        },
        {
          name: "proposal",
          docs: ["Proposal account for governance actions"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "TribecaProposal"),
            variablePdaSeedNode("governor", publicKeyTypeNode()),
            variablePdaSeedNode("index", numberTypeNode("u64")),
          ],
        },
        {
          name: "vote",
          docs: ["Vote account representing a voter's decision on a proposal"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "TribecaVote"),
            variablePdaSeedNode("proposal", publicKeyTypeNode()),
            variablePdaSeedNode("voter", publicKeyTypeNode()),
          ],
        },
        {
          name: "proposalMeta",
          docs: ["Proposal metadata account with additional information"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "TribecaProposalMeta"),
            variablePdaSeedNode("proposal", publicKeyTypeNode()),
          ],
        },
      ],
    }),
    updateAccountsVisitor({
      // lockedVoter accounts
      locker: {
        pda: pdaLinkNode("locker"),
      },
      escrow: {
        pda: pdaLinkNode("escrow"),
      },
      lockerWhitelistEntry: {
        pda: pdaLinkNode("whitelist"),
      },
      // govern accounts
      governor: {
        pda: pdaLinkNode("governor"),
      },
      proposal: {
        pda: pdaLinkNode("proposal"),
      },
      vote: {
        pda: pdaLinkNode("vote"),
      },
      proposalMeta: {
        pda: pdaLinkNode("proposalMeta"),
      },
    }),
  ],
});
