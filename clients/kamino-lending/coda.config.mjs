import {
  accountValueNode,
  addPdasVisitor,
  associatedTokenAccountValueNode,
  constantPdaSeedNodeFromString,
  defineConfig,
  numberTypeNode,
  pdaLinkNode,
  pdaSeedValueNode,
  pdaValueNode,
  programLinkNode,
  publicKeyTypeNode,
  renameVisitor,
  SYSVAR_INSTRUCTIONS_VALUE_NODE,
  stringTypeNode,
  updateAccountsVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";

/** @type {import("@macalinao/coda").CodaConfig} */
export default defineConfig({
  // Use glob pattern to match both IDL files
  outputDir: "./src/generated",
  docs: {
    npmPackageName: "@macalinao/clients-kamino-lending",
  },
  instructionAccountDefaultValues: [
    // farms
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
        pdaSeedValueNode("delegatee", accountValueNode("owner")),
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

    // other
    {
      instruction: "initGlobalConfig",
      account: "globalConfig",
      defaultValue: pdaValueNode(pdaLinkNode("globalConfig")),
    },
    {
      account: "lendingMarketAuthority",
      defaultValue: pdaValueNode(pdaLinkNode("lendingMarketAuth"), [
        pdaSeedValueNode("lendingMarket", accountValueNode("lendingMarket")),
      ]),
    },
    {
      account: "sysvarInfo",
      defaultValue: SYSVAR_INSTRUCTIONS_VALUE_NODE,
    },
    {
      account: "farmsProgram",
      defaultValue: programLinkNode("farms"),
    },
  ],
  // We can add custom visitors here later if needed
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
      kaminoLending: [
        {
          name: "lendingGlobalConfigState",
          seeds: [constantPdaSeedNodeFromString("utf8", "global_config")],
        },
        {
          name: "obligation",
          seeds: [
            variablePdaSeedNode("tag", numberTypeNode("u8", "le")),
            variablePdaSeedNode("id", numberTypeNode("u8", "le")),
            variablePdaSeedNode("user", publicKeyTypeNode()),
            variablePdaSeedNode("market", publicKeyTypeNode()),
            variablePdaSeedNode("seed1Account", publicKeyTypeNode()),
            variablePdaSeedNode("seed2Account", publicKeyTypeNode()),
          ],
        },
        {
          name: "lendingMarketAuth",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "lma"),
            variablePdaSeedNode("lendingMarket", publicKeyTypeNode()),
          ],
        },
        {
          name: "reserveLiquiditySupply",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "reserve_liq_supply"),
            variablePdaSeedNode("lendingMarket", publicKeyTypeNode()),
            variablePdaSeedNode("mint", publicKeyTypeNode()),
          ],
        },
        {
          name: "reserveFeeVault",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "fee_receiver"),
            variablePdaSeedNode("lendingMarket", publicKeyTypeNode()),
            variablePdaSeedNode("mint", publicKeyTypeNode()),
          ],
        },
        {
          name: "reserveCollateralMint",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "reserve_coll_mint"),
            variablePdaSeedNode("lendingMarket", publicKeyTypeNode()),
            variablePdaSeedNode("mint", publicKeyTypeNode()),
          ],
        },
        {
          name: "reserveCollateralSupply",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "reserve_coll_supply"),
            variablePdaSeedNode("lendingMarket", publicKeyTypeNode()),
            variablePdaSeedNode("mint", publicKeyTypeNode()),
          ],
        },
        {
          name: "userMetadata",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "user_meta"),
            variablePdaSeedNode("user", publicKeyTypeNode()),
          ],
        },
        {
          name: "referrerTokenState",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "referrer_acc"),
            variablePdaSeedNode("referrer", publicKeyTypeNode()),
            variablePdaSeedNode("reserve", publicKeyTypeNode()),
          ],
        },
        {
          name: "referrerState",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "ref_state"),
            variablePdaSeedNode("referrer", publicKeyTypeNode()),
          ],
        },
        {
          name: "shortUrl",
          seeds: [
            constantPdaSeedNodeFromString("utf8", "short_url"),
            variablePdaSeedNode("shortUrl", stringTypeNode("utf8")),
          ],
        },
      ],
    }),
    renameVisitor({
      farms: {
        accounts: {
          userState: "farmsUserState",
          globalConfig: "farmsGlobalConfig",
        },
        instructions: {
          idlMissingTypes: "farmsIdlMissingTypes",
        },
        definedTypes: {
          tokenInfo: "farmsTokenInfo",
          userState: "farmsUserState",
        },
      },
    }),
    updateAccountsVisitor({
      // farms
      farmsUserState: {
        pda: pdaLinkNode("farmsUserState"),
      },
      // lending
      lendingGlobalConfig: {
        pda: pdaLinkNode("lendingGlobalConfigState"),
      },
      obligation: {
        pda: pdaLinkNode("obligation"),
      },
      userMetadata: {
        pda: pdaLinkNode("userMetadata"),
      },
      referrerTokenState: {
        pda: pdaLinkNode("referrerTokenState"),
      },
      referrerState: {
        pda: pdaLinkNode("referrerState"),
      },
      shortUrl: {
        pda: pdaLinkNode("shortUrl"),
      },
    }),
  ],
});
