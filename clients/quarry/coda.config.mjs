import {
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  defineConfig,
  publicKeyTypeNode,
  variablePdaSeedNode,
} from "@macalinao/coda";
import { renameVisitor } from "@macalinao/codama-rename-visitor";

export default defineConfig({
  outputDir: "./src/generated",
  docs: {
    npmPackageName: "@macalinao/clients-quarry",
  },

  visitors: [
    addPdasVisitor({
      quarryMine: [
        {
          name: "rewarder",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "Rewarder"),
            variablePdaSeedNode("base", publicKeyTypeNode()),
          ],
        },
        {
          name: "quarry",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "Quarry"),
            variablePdaSeedNode("rewarder", publicKeyTypeNode()),
            variablePdaSeedNode("tokenMint", publicKeyTypeNode()),
          ],
        },
        {
          name: "miner",
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
          seeds: [
            constantPdaSeedNodeFromString("utf8", "MergePool"),
            variablePdaSeedNode("primaryMint", publicKeyTypeNode()),
          ],
        },
        {
          name: "replicaMint",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "ReplicaMint"),
            variablePdaSeedNode("pool", publicKeyTypeNode()),
          ],
        },
        {
          name: "mergeMiner",
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
          seeds: [
            constantPdaSeedNodeFromString("utf8", "MintWrapper"),
            variablePdaSeedNode("base", publicKeyTypeNode()),
          ],
        },
        {
          name: "minter",
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
          seeds: [
            constantPdaSeedNodeFromString("utf8", "Operator"),
            variablePdaSeedNode("base", publicKeyTypeNode()),
          ],
        },
      ],
      quarryRedeemer: [
        {
          name: "redeemer",
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
  ],
});
