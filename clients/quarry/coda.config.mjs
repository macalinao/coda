import {
  accountValueNode,
  addPdasVisitor,
  associatedTokenAccountValueNode,
  constantPdaSeedNodeFromString,
  defineConfig,
  pdaLinkNode,
  pdaSeedValueNode,
  pdaValueNode,
  publicKeyTypeNode,
  setInstructionAccountDefaultValuesVisitor,
  updateAccountsVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";
import { renameVisitor } from "@macalinao/codama-rename-visitor";

export default defineConfig({
  outputDir: "./src/generated",
  docs: {
    npmPackageName: "@macalinao/clients-quarry",
  },

  visitors: [
    updateAccountsVisitor({
      // quarryMine accounts
      rewarder: {
        pda: pdaLinkNode("rewarder"),
      },
      quarry: {
        pda: pdaLinkNode("quarry"),
      },
      miner: {
        pda: pdaLinkNode("miner"),
      },

      // quarryMergeMine accounts
      mergePool: {
        pda: pdaLinkNode("mergePool"),
      },
      mergeMiner: {
        pda: pdaLinkNode("mergeMiner"),
      },

      // quarryMintWrapper accounts
      mintWrapper: {
        pda: pdaLinkNode("mintWrapper"),
      },
      minter: {
        pda: pdaLinkNode("minter"),
      },

      // quarryOperator accounts
      operator: {
        pda: pdaLinkNode("operator"),
      },

      // quarryRedeemer accounts
      redeemer: {
        pda: pdaLinkNode("redeemer"),
      },

      // quarryRegistry accounts
      registry: {
        pda: pdaLinkNode("registry"),
      },
    }),
    addPdasVisitor({
      quarryMine: [
        {
          name: "rewarder",
          docs: [
            "Rewarder account that manages reward distribution for quarries",
          ],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "Rewarder"),
            variablePdaSeedNode("base", publicKeyTypeNode()),
          ],
        },
        {
          name: "quarry",
          docs: ["Individual quarry (staking pool) for a specific token mint"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "Quarry"),
            variablePdaSeedNode("rewarder", publicKeyTypeNode()),
            variablePdaSeedNode("tokenMint", publicKeyTypeNode()),
          ],
        },
        {
          name: "miner",
          docs: [
            "Miner account representing a user's staking position in a quarry",
          ],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "Miner"),
            variablePdaSeedNode("quarry", publicKeyTypeNode()),
            variablePdaSeedNode("authority", publicKeyTypeNode()),
          ],
        },
      ],
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
      quarryMintWrapper: [
        {
          name: "mintWrapper",
          docs: ["Mint wrapper that controls minting of wrapped tokens"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "MintWrapper"),
            variablePdaSeedNode("base", publicKeyTypeNode()),
          ],
        },
        {
          name: "minter",
          docs: ["Minter authority for a specific mint wrapper"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "MintWrapperMinter"),
            variablePdaSeedNode("wrapper", publicKeyTypeNode()),
            variablePdaSeedNode("authority", publicKeyTypeNode()),
          ],
        },
      ],
      quarryOperator: [
        {
          name: "operator",
          docs: [
            "Operator account with delegated authority to manage quarries",
          ],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "Operator"),
            variablePdaSeedNode("base", publicKeyTypeNode()),
          ],
        },
      ],
      quarryRedeemer: [
        {
          name: "redeemer",
          docs: [
            "Redeemer account for exchanging IOU tokens for redemption tokens",
          ],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "Redeemer"),
            variablePdaSeedNode("iouMint", publicKeyTypeNode()),
            variablePdaSeedNode("redemptionMint", publicKeyTypeNode()),
          ],
        },
      ],
      quarryRegistry: [
        {
          name: "registry",
          docs: ["Registry tracking all quarries for a rewarder"],
          seeds: [
            constantPdaSeedNodeFromString("utf8", "QuarryRegistry"),
            variablePdaSeedNode("rewarder", publicKeyTypeNode()),
          ],
        },
      ],
    }),
    // Rename instructions to avoid conflicts between programs
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
      // Operator
      {
        account: "operator",
        instruction: "createOperator",
        defaultValue: pdaValueNode(pdaLinkNode("operator"), [
          pdaSeedValueNode("base", accountValueNode("base")),
        ]),
      },
      {
        account: "operator",
        instruction: "createOperatorV2",
        defaultValue: pdaValueNode(pdaLinkNode("operator"), [
          pdaSeedValueNode("base", accountValueNode("base")),
        ]),
      },

      ...[
        "delegateCreateQuarry",
        "delegateCreateQuarryV2",
        "createQuarry",
        "createQuarryV2",
      ].map((instruction) => ({
        account: "quarry",
        instruction,
        defaultValue: pdaValueNode(pdaLinkNode("quarry"), [
          pdaSeedValueNode("rewarder", accountValueNode("rewarder")),
          pdaSeedValueNode("tokenMint", accountValueNode("tokenMint")),
        ]),
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
        defaultValue: pdaValueNode(pdaLinkNode("miner"), [
          pdaSeedValueNode("quarry", accountValueNode("quarry")),
          pdaSeedValueNode("authority", accountValueNode("authority")),
        ]),
      })),

      ...["claimRewardsMM", "claimRewards", "claimRewardsV2"].flatMap(
        (instruction) => [
          {
            account: "minter",
            instruction,
            defaultValue: pdaValueNode(pdaLinkNode("minter"), [
              pdaSeedValueNode("wrapper", accountValueNode("mintWrapper")),
              pdaSeedValueNode("authority", accountValueNode("rewarder")),
            ]),
          },
          {
            account: "claimFeeTokenAccount",
            instruction,
            defaultValue: associatedTokenAccountValueNode({
              owner: accountValueNode("rewarder"),
              mint: accountValueNode("rewardsTokenMint"),
            }),
          },
        ],
      ),

      ...["claimRewardsMM", "stakePrimaryMiner", "stakeReplicaMiner"].map(
        (instruction) => ({
          account: "miner",
          instruction,
          defaultValue: pdaValueNode(pdaLinkNode("miner"), [
            pdaSeedValueNode("quarry", accountValueNode("quarry")),
            pdaSeedValueNode("authority", accountValueNode("mm")),
          ]),
        }),
      ),

      ...["newRewarder", "newRewarderV2"].flatMap((instruction) => [
        {
          account: "rewarder",
          instruction,
          defaultValue: pdaValueNode(pdaLinkNode("rewarder"), [
            pdaSeedValueNode("base", accountValueNode("base")),
          ]),
        },
        {
          account: "initialAuthority",
          instruction,
          defaultValue: accountValueNode("payer"),
        },
      ]),

      ...[
        "stakePrimaryMiner",
        "stakeReplicaMiner",
        "unstakePrimaryMiner",
        "unstakeAllReplicaMiner",
      ].flatMap((instruction) => [
        {
          account: "mm",
          instruction,
          defaultValue: pdaValueNode(pdaLinkNode("mergeMiner"), [
            pdaSeedValueNode("pool", accountValueNode("pool")),
            pdaSeedValueNode("owner", accountValueNode("mmOwner")),
          ]),
        },
      ]),
      ...["withdrawTokensMM", "initMergeMiner", "initMergeMinerV2"].flatMap(
        (instruction) => [
          {
            account: "mm",
            instruction,
            defaultValue: pdaValueNode(pdaLinkNode("mergeMiner"), [
              pdaSeedValueNode("pool", accountValueNode("pool")),
              pdaSeedValueNode("owner", accountValueNode("owner")),
            ]),
          },
        ],
      ),

      {
        account: "iouSource",
        defaultValue: associatedTokenAccountValueNode({
          owner: accountValueNode("sourceAuthority"),
          mint: accountValueNode("iouMint"),
        }),
      },
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

      ...["newWrapper", "newWrapperV2"].flatMap((instruction) => [
        {
          account: "mintWrapper",
          instruction,
          defaultValue: pdaValueNode(pdaLinkNode("mintWrapper"), [
            pdaSeedValueNode("base", accountValueNode("base")),
          ]),
        },
        {
          account: "admin",
          instruction,
          defaultValue: accountValueNode("payer"),
        },
      ]),

      ...[
        "newPool",
        "newPoolV2",
        "stakeReplicaMiner",
        "unstakeAllReplicaMiner",
      ].flatMap((instruction) => [
        {
          account: "replicaMint",
          instruction,
          defaultValue: pdaValueNode(pdaLinkNode("replicaMint"), [
            pdaSeedValueNode("pool", accountValueNode("pool")),
          ]),
        },
      ]),

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
            defaultValue: pdaValueNode(pdaLinkNode("quarry"), [
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

      ...["newMinter", "newMinterV2"].flatMap((instruction) => [
        {
          account: "minter",
          instruction,
          defaultValue: pdaValueNode(pdaLinkNode("minter"), [
            pdaSeedValueNode("wrapper", accountValueNode("mintWrapper")),
            pdaSeedValueNode(
              "authority",
              accountValueNode("newMinterAuthority"),
            ),
          ]),
        },
        {
          account: "newMinterAuthority",
          instruction,
          defaultValue: accountValueNode("payer"),
        },
      ]),
    ]),
  ],
});
