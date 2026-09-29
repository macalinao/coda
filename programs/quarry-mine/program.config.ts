import {
  accountValueNode,
  addPdasVisitor,
  associatedTokenAccountValueNode,
  constantPdaSeedNodeFromString,
  pdaLinkNode,
  pdaSeedValueNode,
  pdaValueNode,
  publicKeyTypeNode,
  setInstructionAccountDefaultValuesVisitor,
  updateAccountsVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export default defineProgram({
  package: {
    name: "@solana-programs/quarry-mine",
    description:
      "TypeScript client for the Quarry Mine program, the core liquidity mining program of the Quarry protocol",
    keywords: ["quarry", "mining", "staking", "ian-macalinao"],
    initialVersion: "0.8.1",
  },

  visitors: [
    updateAccountsVisitor({
      rewarder: {
        pda: pdaLinkNode("rewarder"),
      },
      quarry: {
        pda: pdaLinkNode("quarry"),
      },
      miner: {
        pda: pdaLinkNode("miner"),
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
    }),
    setInstructionAccountDefaultValuesVisitor([
      ...["createQuarry", "createQuarryV2"].map((instruction) => ({
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

      // Rewards are minted through the Quarry Mint Wrapper program.
      ...["claimRewards", "claimRewardsV2"].flatMap((instruction) => [
        {
          account: "minter",
          instruction,
          defaultValue: pdaValueNode(
            pdaLinkNode("minter", "quarryMintWrapper"),
            [
              pdaSeedValueNode("wrapper", accountValueNode("mintWrapper")),
              pdaSeedValueNode("authority", accountValueNode("rewarder")),
            ],
          ),
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
    ]),
  ],
});
