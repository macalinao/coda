import {
  accountValueNode,
  associatedTokenAccountValueNode,
  constant,
  definePdas,
  programHandle,
  publicKeyTypeNode,
  renameVisitor,
  setInstructionAccountDefaultValuesVisitor,
  updateAccountsVisitor,
  variable,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";
import * as quarryMine from "../mine/program.config.ts";
import * as quarryMintWrapper from "../mint-wrapper/program.config.ts";

export const program = programHandle("quarryMergeMine");

export const pdas = definePdas(program, {
  mergePool: {
    docs: ["Merge pool that allows staking multiple quarry rewards as one"],
    seeds: [
      constant("MergePool"),
      variable("primaryMint", publicKeyTypeNode()),
    ],
  },
  replicaMint: {
    docs: ["Replica mint token for the merge pool"],
    seeds: [constant("ReplicaMint"), variable("pool", publicKeyTypeNode())],
  },
  mergeMiner: {
    docs: ["Merge miner account for a user in a merge pool"],
    seeds: [
      constant("MergeMiner"),
      variable("pool", publicKeyTypeNode()),
      variable("owner", publicKeyTypeNode()),
    ],
  },
});

export default defineProgram({
  package: {
    description:
      "TypeScript client for the Quarry Merge Mine program, which stakes one deposit across multiple quarries",
    keywords: ["quarry", "mining", "staking", "merge-mine", "ian-macalinao"],
    version: "0.1.0",
    releaseNotes: [
      "Split out of `@solana-programs/quarry`, which now re-exports this package.",
      "Imports `findMinerPda` and `findQuarryPda` from `@solana-programs/quarry-mine` and `findMinterPda` from `@solana-programs/quarry-mint-wrapper` instead of duplicating them.",
    ],
  },

  visitors: [
    updateAccountsVisitor({
      mergePool: {
        pda: pdas.mergePool.link,
      },
      mergeMiner: {
        pda: pdas.mergeMiner.link,
      },
    }),
    pdas.visitor,
    // These names predate the split into one package per program, when they
    // clashed with Quarry Mine's in the combined client. They are kept so the
    // generated API does not change.
    renameVisitor({
      quarryMergeMine: {
        instructions: {
          claimRewards: "claimRewardsMM",
          initMiner: "initMinerMM",
          initMinerV2: "initMinerMMV2",
          withdrawTokens: "withdrawTokensMM",
          rescueTokens: "rescueTokensMM",
        },
        definedTypes: {
          claimEvent: "claimEventMM",
        },
      },
    }),
    setInstructionAccountDefaultValuesVisitor([
      // Rewards are minted through the Quarry Mint Wrapper program.
      {
        account: "minter",
        instruction: "claimRewardsMM",
        defaultValue: quarryMintWrapper.pdas.minter.value({
          wrapper: accountValueNode("mintWrapper"),
          authority: accountValueNode("rewarder"),
        }),
      },
      {
        account: "claimFeeTokenAccount",
        instruction: "claimRewardsMM",
        defaultValue: associatedTokenAccountValueNode({
          owner: accountValueNode("rewarder"),
          mint: accountValueNode("rewardsTokenMint"),
        }),
      },

      // The merge miner stakes into Quarry Mine miners it owns.
      ...["claimRewardsMM", "stakePrimaryMiner", "stakeReplicaMiner"].map(
        (instruction) => ({
          account: "miner",
          instruction,
          defaultValue: quarryMine.pdas.miner.value({
            quarry: accountValueNode("quarry"),
            authority: accountValueNode("mm"),
          }),
        }),
      ),

      ...[
        "stakePrimaryMiner",
        "stakeReplicaMiner",
        "unstakePrimaryMiner",
        "unstakeAllReplicaMiner",
      ].map((instruction) => ({
        account: "mm",
        instruction,
        defaultValue: pdas.mergeMiner.value({
          pool: accountValueNode("pool"),
          owner: accountValueNode("mmOwner"),
        }),
      })),
      ...["withdrawTokensMM", "initMergeMiner", "initMergeMinerV2"].map(
        (instruction) => ({
          account: "mm",
          instruction,
          defaultValue: pdas.mergeMiner.value({
            pool: accountValueNode("pool"),
            owner: accountValueNode("owner"),
          }),
        }),
      ),

      {
        account: "mmTokenAccount",
        defaultValue: associatedTokenAccountValueNode({
          owner: accountValueNode("mm"),
          mint: accountValueNode("withdrawMint"),
        }),
      },
      {
        account: "rewardsTokenAccount",
        defaultValue: associatedTokenAccountValueNode({
          owner: accountValueNode("mm"),
          mint: accountValueNode("rewardsTokenMint"),
        }),
      },

      ...[
        "newPool",
        "newPoolV2",
        "stakeReplicaMiner",
        "unstakeAllReplicaMiner",
      ].map((instruction) => ({
        account: "replicaMint",
        instruction,
        defaultValue: pdas.replicaMint.value({
          pool: accountValueNode("pool"),
        }),
      })),

      ...["stakeReplicaMiner", "unstakeAllReplicaMiner"].flatMap(
        (instruction) => [
          {
            account: "replicaMintTokenAccount",
            instruction,
            defaultValue: associatedTokenAccountValueNode({
              owner: accountValueNode("mm"),
              mint: accountValueNode("replicaMint"),
            }),
          },
          {
            account: "quarry",
            instruction,
            defaultValue: quarryMine.pdas.quarry.value({
              rewarder: accountValueNode("rewarder"),
              tokenMint: accountValueNode("replicaMint"),
            }),
          },
          {
            account: "minerVault",
            instruction,
            defaultValue: associatedTokenAccountValueNode({
              owner: accountValueNode("miner"),
              mint: accountValueNode("replicaMint"),
            }),
          },
        ],
      ),
    ]),
  ],
});
