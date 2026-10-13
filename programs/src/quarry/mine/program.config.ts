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
import * as quarryMintWrapper from "../mint-wrapper/program.config.ts";
import idlJson from "./idl.json" with { type: "json" };
import protocol from "../protocol.config.ts";

/** The program's Anchor IDL. */
export const idl: AnchorIdl = idlJson as AnchorIdl;

export const program = programHandle("quarryMine");

export const pdas = definePdas(program, {
  rewarder: {
    docs: ["Rewarder account that manages reward distribution for quarries"],
    seeds: [constant("Rewarder"), variable("base", publicKeyTypeNode())],
  },
  quarry: {
    docs: ["Individual quarry (staking pool) for a specific token mint"],
    seeds: [
      constant("Quarry"),
      variable("rewarder", publicKeyTypeNode()),
      variable("tokenMint", publicKeyTypeNode()),
    ],
  },
  miner: {
    docs: ["Miner account representing a user's staking position in a quarry"],
    seeds: [
      constant("Miner"),
      variable("quarry", publicKeyTypeNode()),
      variable("authority", publicKeyTypeNode()),
    ],
  },
});

export default defineProgram({
  protocol,
  name: "mine",
  program,
  idl,
  pdas,
  // The on-chain program. Addresses were checked with getAccountInfo on
  // mainnet-beta and devnet (2026-10).
  metadata: {
    displayName: "Quarry Mine",
    description:
      "Core liquidity mining program of Quarry: a rewarder distributes rewards across quarries (one per staked token mint), and miners stake into them.",
    repository: "https://github.com/QuarryProtocol/quarry",
    addresses: {
      devnet: "QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB",
    },
    docs: "https://docs.rs/quarry-mine",
    audits: [
      {
        auditor: "Quantstamp",
        url: "https://github.com/QuarryProtocol/quarry/blob/master/audit/quantstamp.pdf",
        date: "2021-12-08",
      },
    ],
  },

  visitors: [
    updateAccountsVisitor({
      rewarder: {
        pda: pdas.rewarder.link,
      },
      quarry: {
        pda: pdas.quarry.link,
      },
      miner: {
        pda: pdas.miner.link,
      },
    }),
    pdas.visitor,
    setInstructionAccountDefaultValuesVisitor([
      ...["createQuarry", "createQuarryV2"].map((instruction) => ({
        account: "quarry",
        instruction,
        defaultValue: pdas.quarry.value({
          rewarder: accountValueNode("rewarder"),
          tokenMint: accountValueNode("tokenMint"),
        }),
      })),

      ...[
        "createMiner",
        "createMinerV2",
        "claimRewards",
        "claimRewardsV2",
        "withdrawTokens",
        "stakeTokens",
      ].map((instruction) => ({
        account: "miner",
        instruction,
        defaultValue: pdas.miner.value({
          quarry: accountValueNode("quarry"),
          authority: accountValueNode("authority"),
        }),
      })),

      // Rewards are minted through the Quarry Mint Wrapper program.
      ...["claimRewards", "claimRewardsV2"].flatMap((instruction) => [
        {
          account: "minter",
          instruction,
          defaultValue: quarryMintWrapper.pdas.minter.value({
            wrapper: accountValueNode("mintWrapper"),
            authority: accountValueNode("rewarder"),
          }),
        },
        {
          account: "claimFeeTokenAccount",
          instruction,
          defaultValue: associatedTokenAccountValueNode({
            owner: accountValueNode("rewarder"),
            mint: accountValueNode("rewardsTokenMint"),
          }),
        },
      ]),

      ...["newRewarder", "newRewarderV2"].flatMap((instruction) => [
        {
          account: "rewarder",
          instruction,
          defaultValue: pdas.rewarder.value({ base: accountValueNode("base") }),
        },
        {
          account: "initialAuthority",
          instruction,
          defaultValue: accountValueNode("payer"),
        },
      ]),
    ]),
  ],
});
