import {
  accountValueNode,
  constant,
  definePdas,
  numberTypeNode,
  programHandle,
  publicKeyTypeNode,
  stringTypeNode,
  SYSVAR_INSTRUCTIONS_VALUE_NODE,
  TOKEN_PROGRAM_VALUE_NODE,
  updateAccountsVisitor,
  variable,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";
import * as farms from "../farms/program.config.ts";

export const program = programHandle("kaminoLending");

export const pdas = definePdas(program, {
  lendingGlobalConfigState: {
    seeds: [constant("global_config")],
  },
  obligation: {
    seeds: [
      variable("tag", numberTypeNode("u8", "le")),
      variable("id", numberTypeNode("u8", "le")),
      variable("user", publicKeyTypeNode()),
      variable("market", publicKeyTypeNode()),
      variable("seed1Account", publicKeyTypeNode()),
      variable("seed2Account", publicKeyTypeNode()),
    ],
  },
  lendingMarketAuth: {
    seeds: [constant("lma"), variable("lendingMarket", publicKeyTypeNode())],
  },
  reserveLiquiditySupply: {
    seeds: [
      constant("reserve_liq_supply"),
      variable("lendingMarket", publicKeyTypeNode()),
      variable("mint", publicKeyTypeNode()),
    ],
  },
  reserveFeeVault: {
    seeds: [
      constant("fee_receiver"),
      variable("lendingMarket", publicKeyTypeNode()),
      variable("mint", publicKeyTypeNode()),
    ],
  },
  reserveCollateralMint: {
    seeds: [
      constant("reserve_coll_mint"),
      variable("lendingMarket", publicKeyTypeNode()),
      variable("mint", publicKeyTypeNode()),
    ],
  },
  reserveCollateralSupply: {
    seeds: [
      constant("reserve_coll_supply"),
      variable("lendingMarket", publicKeyTypeNode()),
      variable("mint", publicKeyTypeNode()),
    ],
  },
  userMetadata: {
    seeds: [constant("user_meta"), variable("user", publicKeyTypeNode())],
  },
  referrerTokenState: {
    seeds: [
      constant("referrer_acc"),
      variable("referrer", publicKeyTypeNode()),
      variable("reserve", publicKeyTypeNode()),
    ],
  },
  referrerState: {
    seeds: [constant("ref_state"), variable("referrer", publicKeyTypeNode())],
  },
  shortUrl: {
    seeds: [
      constant("short_url"),
      variable("shortUrl", stringTypeNode("utf8")),
    ],
  },
});

export default defineProgram({
  package: {
    description: "TypeScript client for the Kamino Lending program",
    keywords: ["kamino", "lending", "defi", "ian-macalinao"],
    version: "0.10.0",
    releaseNotes: [
      "**Breaking:** the Kamino Farms program is no longer part of this package. It is published as `@solana-programs/kamino-farms`, which this package depends on for `FARMS_PROGRAM_ADDRESS`; `@solana-programs/kamino` bundles both programs.",
    ],
  },
  instructionAccountDefaultValues: [
    {
      account: /collateralTokenProgram|liquidityTokenProgram/,
      defaultValue: TOKEN_PROGRAM_VALUE_NODE,
    },
    {
      account: "feeReceiver",
      defaultValue: pdas.reserveFeeVault.value({
        lendingMarket: accountValueNode("lendingMarket"),
        mint: accountValueNode("reserveLiquidityMint"),
      }),
    },
    {
      account: "reserveLiquiditySupply",
      defaultValue: pdas.reserveLiquiditySupply.value({
        lendingMarket: accountValueNode("lendingMarket"),
        mint: accountValueNode("reserveLiquidityMint"),
      }),
    },
    {
      account: "reserveLiquidityFeeReceiver",
      defaultValue: pdas.reserveFeeVault.value({
        lendingMarket: accountValueNode("lendingMarket"),
        mint: accountValueNode("reserveLiquidityMint"),
      }),
    },
    {
      account: "reserveCollateralMint",
      defaultValue: pdas.reserveCollateralMint.value({
        lendingMarket: accountValueNode("lendingMarket"),
        mint: accountValueNode("reserveLiquidityMint"),
      }),
    },
    {
      account: "reserveCollateralSupply",
      defaultValue: pdas.reserveCollateralSupply.value({
        lendingMarket: accountValueNode("lendingMarket"),
        mint: accountValueNode("reserveLiquidityMint"),
      }),
    },
    {
      instruction: "initGlobalConfig",
      account: "globalConfig",
      defaultValue: pdas.lendingGlobalConfigState.value(),
    },
    {
      account: "lendingMarketAuthority",
      defaultValue: pdas.lendingMarketAuth.value({
        lendingMarket: accountValueNode("lendingMarket"),
      }),
    },
    {
      account: /sysvarInfo|[\w+][iI]nstructionSysvarAccount/,
      defaultValue: SYSVAR_INSTRUCTIONS_VALUE_NODE,
    },
    {
      account: "farmsProgram",
      defaultValue: farms.program.link,
    },
  ],
  visitors: [
    pdas.visitor,
    updateAccountsVisitor({
      lendingGlobalConfig: {
        pda: pdas.lendingGlobalConfigState.link,
      },
      obligation: {
        pda: pdas.obligation.link,
      },
      userMetadata: {
        pda: pdas.userMetadata.link,
      },
      referrerTokenState: {
        pda: pdas.referrerTokenState.link,
      },
      referrerState: {
        pda: pdas.referrerState.link,
      },
      shortUrl: {
        pda: pdas.shortUrl.link,
      },
    }),
  ],
});
