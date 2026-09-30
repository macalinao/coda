import {
  accountValueNode,
  associatedTokenAccountValueNode,
  constant,
  definePdas,
  programHandle,
  publicKeyTypeNode,
  renameVisitor,
  updateAccountsVisitor,
  variable,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export const program = programHandle("farms");

export const pdas = definePdas(program, {
  rewardTreasuryVault: {
    seeds: [
      constant("tvault"),
      variable("globalConfig", publicKeyTypeNode()),
      variable("rewardMint", publicKeyTypeNode()),
    ],
  },
  treasuryVaultsAuthority: {
    seeds: [
      constant("authority"),
      variable("globalConfig", publicKeyTypeNode()),
    ],
  },
  farmVaultsAuthority: {
    seeds: [constant("authority"), variable("farmState", publicKeyTypeNode())],
  },
  farmVault: {
    seeds: [
      constant("fvault"),
      variable("farmState", publicKeyTypeNode()),
      variable("tokenMint", publicKeyTypeNode()),
    ],
  },
  rewardVault: {
    seeds: [
      constant("rvault"),
      variable("farmState", publicKeyTypeNode()),
      variable("rewardMint", publicKeyTypeNode()),
    ],
  },
  farmsUserState: {
    seeds: [
      constant("user"),
      variable("farmState", publicKeyTypeNode()),
      variable(
        "owner",
        publicKeyTypeNode(),
        "The user who is farming. This is sometimes the obligation in the case of delegated farms.",
      ),
    ],
  },
});

export default defineProgram({
  package: {
    description: "TypeScript client for the Kamino Farms program",
    keywords: ["kamino", "farms", "staking", "defi", "ian-macalinao"],
    version: "0.1.0",
    releaseNotes: [
      "Split out of `@solana-programs/kamino-lending`. Also ships the Farms `updateGlobalConfig` and `updateGlobalConfigAdmin` instructions, which the combined client overwrote with Kamino Lending's.",
    ],
  },
  instructionAccountDefaultValues: [
    ...["initializeFarm", "stake"].map((instruction) => ({
      instruction,
      account: "farmVault",
      defaultValue: pdas.farmVault.value({
        farmState: accountValueNode("farmState"),
        tokenMint: accountValueNode("tokenMint"),
      }),
    })),
    // note: delegated farms will have a different seed, the "owner" is the delegatee.
    ...["harvestReward", "stake", "unstake", "withdrawUnstakedDeposits"].map(
      (instruction) => ({
        instruction,
        account: "userState",
        defaultValue: pdas.farmsUserState.value({
          farmState: accountValueNode("farmState"),
          owner: accountValueNode("owner"),
        }),
      }),
    ),
    {
      instruction: "initializeUser",
      account: "userState",
      defaultValue: pdas.farmsUserState.value({
        farmState: accountValueNode("farmState"),
        owner: accountValueNode("delegatee"),
      }),
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
      defaultValue: pdas.rewardVault.value({
        farmState: accountValueNode("farmState"),
        rewardMint: accountValueNode("rewardMint"),
      }),
    },
    {
      account: "rewardsVault",
      defaultValue: pdas.rewardVault.value({
        farmState: accountValueNode("farmState"),
        rewardMint: accountValueNode("rewardMint"),
      }),
    },
    {
      account: "rewardsTreasuryVault",
      defaultValue: pdas.rewardTreasuryVault.value({
        globalConfig: accountValueNode("globalConfig"),
        rewardMint: accountValueNode("rewardMint"),
      }),
    },
    {
      account: "rewardTreasuryVault",
      defaultValue: pdas.rewardTreasuryVault.value({
        globalConfig: accountValueNode("globalConfig"),
        rewardMint: accountValueNode("rewardMint"),
      }),
    },
    {
      account: "treasuryVaultAuthority",
      defaultValue: pdas.treasuryVaultsAuthority.value({
        globalConfig: accountValueNode("globalConfig"),
      }),
    },
    {
      account: "treasuryVaultsAuthority",
      defaultValue: pdas.treasuryVaultsAuthority.value({
        globalConfig: accountValueNode("globalConfig"),
      }),
    },
    {
      account: "farmVaultsAuthority",
      defaultValue: pdas.farmVaultsAuthority.value({
        farmState: accountValueNode("farmState"),
      }),
    },
  ],
  visitors: [
    pdas.visitor,
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
        pda: pdas.farmsUserState.link,
      },
    }),
  ],
});
