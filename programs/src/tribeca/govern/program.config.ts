import type { AnchorIdl } from "@codama/nodes-from-anchor";
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
import idlJson from "./idl.json" with { type: "json" };
import protocol from "../protocol.config.ts";

/** The program's Anchor IDL. */
export const idl: AnchorIdl = idlJson as AnchorIdl;

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
  protocol,
  name: "govern",
  program,
  idl,
  pdas,
  // The on-chain program. Addresses were checked with getAccountInfo on
  // mainnet-beta and devnet (2026-10).
  metadata: {
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
