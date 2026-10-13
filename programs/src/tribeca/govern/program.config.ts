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
  // The on-chain program. Addresses were checked with getAccountInfo on
  // mainnet-beta and devnet (2026-10).
  program: {
    displayName: "Tribeca Govern",
    description:
      "Core program of Tribeca governance: creates governors and proposals, and records votes.",
    repository: "https://github.com/TribecaHQ/tribeca",
    addresses: {
      devnet: "Govz1VyoyLD5BL6CSCxUJLVLsQHRwjfFj1prNsdNg5Jw",
    },
    docs: "https://docs.rs/govern",
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
