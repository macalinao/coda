import {
  accountValueNode,
  addPdasVisitor,
  associatedTokenAccountValueNode,
  constantPdaSeedNodeFromString,
  pdaLinkNode,
  pdaSeedValueNode,
  pdaValueNode,
  publicKeyTypeNode,
  renameVisitor,
  setInstructionAccountDefaultValuesVisitor,
  updateAccountsVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export default defineProgram({
  package: {
    name: "@solana-programs/quarry-merge-mine",
    description:
      "TypeScript client for the Quarry Merge Mine program, which stakes one deposit across multiple quarries",
    keywords: ["quarry", "mining", "staking", "merge-mine", "ian-macalinao"],
    initialVersion: "0.8.1",
  },

  visitors: [
    updateAccountsVisitor({
      mergePool: {
        pda: pdaLinkNode("mergePool"),
      },
      mergeMiner: {
        pda: pdaLinkNode("mergeMiner"),
      },
    }),
    addPdasVisitor({
      quarryMergeMine: [
        {
          name: "mergePool",
          docs: [
            "Merge pool that allows staking multiple quarry rewards as one",
          ],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "MergePool"),
            variablePdaSeedNode("primaryMint", publicKeyTypeNode()),
          ],
        },
        {
          name: "replicaMint",
          docs: ["Replica mint token for the merge pool"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "ReplicaMint"),
            variablePdaSeedNode("pool", publicKeyTypeNode()),
          ],
        },
        {
          name: "mergeMiner",
          docs: ["Merge miner account for a user in a merge pool"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "MergeMiner"),
            variablePdaSeedNode("pool", publicKeyTypeNode()),
            variablePdaSeedNode("owner", publicKeyTypeNode()),
          ],
        },
      ],
    }),
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
        defaultValue: pdaValueNode(pdaLinkNode("minter", "quarryMintWrapper"), [
          pdaSeedValueNode("wrapper", accountValueNode("mintWrapper")),
          pdaSeedValueNode("authority", accountValueNode("rewarder")),
        ]),
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
          defaultValue: pdaValueNode(pdaLinkNode("miner", "quarryMine"), [
            pdaSeedValueNode("quarry", accountValueNode("quarry")),
            pdaSeedValueNode("authority", accountValueNode("mm")),
          ]),
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
        defaultValue: pdaValueNode(pdaLinkNode("mergeMiner"), [
          pdaSeedValueNode("pool", accountValueNode("pool")),
          pdaSeedValueNode("owner", accountValueNode("mmOwner")),
        ]),
      })),
      ...["withdrawTokensMM", "initMergeMiner", "initMergeMinerV2"].map(
        (instruction) => ({
          account: "mm",
          instruction,
          defaultValue: pdaValueNode(pdaLinkNode("mergeMiner"), [
            pdaSeedValueNode("pool", accountValueNode("pool")),
            pdaSeedValueNode("owner", accountValueNode("owner")),
          ]),
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
        defaultValue: pdaValueNode(pdaLinkNode("replicaMint"), [
          pdaSeedValueNode("pool", accountValueNode("pool")),
        ]),
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
            defaultValue: pdaValueNode(pdaLinkNode("quarry", "quarryMine"), [
              pdaSeedValueNode("rewarder", accountValueNode("rewarder")),
              pdaSeedValueNode("tokenMint", accountValueNode("replicaMint")),
            ]),
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
