import {
  constant,
  definePdas,
  numberTypeNode,
  programHandle,
  publicKeyTypeNode,
  updateAccountsVisitor,
  variable,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export const program = programHandle("govern");

export const pdas = definePdas(program, {
  governor: {
    docs: ["Governor account that manages proposals and voting"],
    seeds: [constant("TribecaGovernor"), variable("base", publicKeyTypeNode())],
  },
  proposal: {
    docs: ["Proposal account for governance actions"],
    seeds: [
      constant("TribecaProposal"),
      variable("governor", publicKeyTypeNode()),
      variable("index", numberTypeNode("u64")),
    ],
  },
  vote: {
    docs: ["Vote account representing a voter's decision on a proposal"],
    seeds: [
      constant("TribecaVote"),
      variable("proposal", publicKeyTypeNode()),
      variable("voter", publicKeyTypeNode()),
    ],
  },
  proposalMeta: {
    docs: ["Proposal metadata account with additional information"],
    seeds: [
      constant("TribecaProposalMeta"),
      variable("proposal", publicKeyTypeNode()),
    ],
  },
});

export default defineProgram({
  package: {
    description: "TypeScript client for the Tribeca Govern program",
    keywords: ["tribeca", "governance", "voting", "dao"],
    version: "0.1.0",
    releaseNotes: [
      "Split out of `@solana-programs/tribeca`, which now re-exports this package.",
    ],
  },

  visitors: [
    pdas.visitor,
    updateAccountsVisitor({
      governor: {
        pda: pdas.governor.link,
      },
      proposal: {
        pda: pdas.proposal.link,
      },
      vote: {
        pda: pdas.vote.link,
      },
      proposalMeta: {
        pda: pdas.proposalMeta.link,
      },
    }),
  ],
});
