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
  updateAccountsVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export default defineProgram({
  package: {
    name: "@solana-programs/kamino-farms",
    description: "TypeScript client for the Kamino Farms program",
    keywords: ["kamino", "farms", "staking", "defi", "ian-macalinao"],
    initialVersion: "0.9.1",
  },
  instructionAccountDefaultValues: [
    ...["initializeFarm", "stake"].map((instruction) => ({
      instruction,
      account: "farmVault",
      defaultValue: pdaValueNode(pdaLinkNode("farmVault"), [
        pdaSeedValueNode("farmState", accountValueNode("farmState")),
        pdaSeedValueNode("tokenMint", accountValueNode("tokenMint")),
      ]),
    })),
    // note: delegated farms will have a different seed, the "owner" is the delegatee.
    ...["harvestReward", "stake", "unstake", "withdrawUnstakedDeposits"].map(
      (instruction) => ({
        instruction,
        account: "userState",
        defaultValue: pdaValueNode(pdaLinkNode("farmsUserState"), [
          pdaSeedValueNode("farmState", accountValueNode("farmState")),
          pdaSeedValueNode("owner", accountValueNode("owner")),
        ]),
      }),
    ),
    {
      instruction: "initializeUser",
      account: "userState",
      defaultValue: pdaValueNode(pdaLinkNode("farmsUserState"), [
        pdaSeedValueNode("farmState", accountValueNode("farmState")),
        pdaSeedValueNode("owner", accountValueNode("delegatee")),
      ]),
    },
    {
      account: "userRewardAta",
      defaultValue: associatedTokenAccountValueNode({
        owner: accountValueNode("owner"),
        mint: accountValueNode("rewardMint"),
        tokenProgram: accountValueNode("tokenProgram"),
      }),
    },
    {
      account: "rewardVault",
      defaultValue: pdaValueNode(pdaLinkNode("rewardVault"), [
        pdaSeedValueNode("farmState", accountValueNode("farmState")),
        pdaSeedValueNode("rewardMint", accountValueNode("rewardMint")),
      ]),
    },
    {
      account: "rewardsVault",
      defaultValue: pdaValueNode(pdaLinkNode("rewardVault"), [
        pdaSeedValueNode("farmState", accountValueNode("farmState")),
        pdaSeedValueNode("rewardMint", accountValueNode("rewardMint")),
      ]),
    },
    {
      account: "rewardsTreasuryVault",
      defaultValue: pdaValueNode(pdaLinkNode("rewardTreasuryVault"), [
        pdaSeedValueNode("globalConfig", accountValueNode("globalConfig")),
        pdaSeedValueNode("rewardMint", accountValueNode("rewardMint")),
      ]),
    },
    {
      account: "rewardTreasuryVault",
      defaultValue: pdaValueNode(pdaLinkNode("rewardTreasuryVault"), [
        pdaSeedValueNode("globalConfig", accountValueNode("globalConfig")),
        pdaSeedValueNode("rewardMint", accountValueNode("rewardMint")),
      ]),
    },
    {
      account: "treasuryVaultAuthority",
      defaultValue: pdaValueNode(pdaLinkNode("treasuryVaultsAuthority"), [
        pdaSeedValueNode("globalConfig", accountValueNode("globalConfig")),
      ]),
    },
    {
      account: "treasuryVaultsAuthority",
      defaultValue: pdaValueNode(pdaLinkNode("treasuryVaultsAuthority"), [
        pdaSeedValueNode("globalConfig", accountValueNode("globalConfig")),
      ]),
    },
    {
      account: "farmVaultsAuthority",
      defaultValue: pdaValueNode(pdaLinkNode("farmVaultsAuthority"), [
        pdaSeedValueNode("farmState", accountValueNode("farmState")),
      ]),
    },
  ],
  visitors: [
    addPdasVisitor({
      farms: [
        {
          name: "rewardTreasuryVault",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "tvault"),
            variablePdaSeedNode("globalConfig", publicKeyTypeNode()),
            variablePdaSeedNode("rewardMint", publicKeyTypeNode()),
          ],
        },
        {
          name: "treasuryVaultsAuthority",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "authority"),
            variablePdaSeedNode("globalConfig", publicKeyTypeNode()),
          ],
        },
        {
          name: "farmVaultsAuthority",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "authority"),
            variablePdaSeedNode("farmState", publicKeyTypeNode()),
          ],
        },
        {
          name: "farmVault",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "fvault"),
            variablePdaSeedNode("farmState", publicKeyTypeNode()),
            variablePdaSeedNode("tokenMint", publicKeyTypeNode()),
          ],
        },
        {
          name: "rewardVault",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "rvault"),
            variablePdaSeedNode("farmState", publicKeyTypeNode()),
            variablePdaSeedNode("rewardMint", publicKeyTypeNode()),
          ],
        },
        {
          name: "farmsUserState",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "user"),
            variablePdaSeedNode("farmState", publicKeyTypeNode()),
            variablePdaSeedNode(
              "owner",
              publicKeyTypeNode(),
              "The user who is farming. This is sometimes the obligation in the case of delegated farms.",
            ),
          ],
        },
      ],
    }),
    // These names predate the split into one package per program, when they
    // clashed with Kamino Lending's in the combined client. They are kept so
    // the generated API does not change.
    renameVisitor({
      farms: {
        accounts: {
          userState: "farmsUserState",
          globalConfig: "farmsGlobalConfig",
        },
        instructions: {
          idlMissingTypes: "farmsIdlMissingTypes",
        },
      },
    }),
    updateAccountsVisitor({
      farmsUserState: {
        pda: pdaLinkNode("farmsUserState"),
      },
    }),
  ],
});
