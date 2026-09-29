import {
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  numberTypeNode,
  pdaLinkNode,
  publicKeyTypeNode,
  updateAccountsVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export default defineProgram({
  package: {
    name: "@solana-programs/tribeca-govern",
    description: "TypeScript client for the Tribeca Govern program",
    keywords: ["tribeca", "governance", "voting", "dao"],
    initialVersion: "0.5.1",
  },

  visitors: [
    addPdasVisitor({
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
