import {
  accountValueNode,
  addPdasVisitor,
  constantPdaSeedNodeFromString,
  numberTypeNode,
  pdaLinkNode,
  pdaSeedValueNode,
  pdaValueNode,
  programLinkNode,
  publicKeyTypeNode,
  SYSVAR_INSTRUCTIONS_VALUE_NODE,
  stringTypeNode,
  TOKEN_PROGRAM_VALUE_NODE,
  updateAccountsVisitor,
  variablePdaSeedNode,
} from "@macalinao/coda";
import { defineProgram } from "@macalinao/megagraph";

export default defineProgram({
  package: {
    name: "@solana-programs/kamino-klend",
    description:
      "TypeScript client for the Kamino Lending (klend) program on its own, without Kamino Farms",
    keywords: ["kamino", "klend", "lending", "defi", "ian-macalinao"],
    initialVersion: "0.9.1",
  },
  instructionAccountDefaultValues: [
    {
      account: /collateralTokenProgram|liquidityTokenProgram/,
      defaultValue: TOKEN_PROGRAM_VALUE_NODE,
    },
    {
      account: "feeReceiver",
      defaultValue: pdaValueNode(pdaLinkNode("reserveFeeVault"), [
        pdaSeedValueNode("lendingMarket", accountValueNode("lendingMarket")),
        pdaSeedValueNode("mint", accountValueNode("reserveLiquidityMint")),
      ]),
    },
    {
      account: "reserveLiquiditySupply",
      defaultValue: pdaValueNode(pdaLinkNode("reserveLiquiditySupply"), [
        pdaSeedValueNode("lendingMarket", accountValueNode("lendingMarket")),
        pdaSeedValueNode("mint", accountValueNode("reserveLiquidityMint")),
      ]),
    },
    {
      account: "reserveLiquidityFeeReceiver",
      defaultValue: pdaValueNode(pdaLinkNode("reserveFeeVault"), [
        pdaSeedValueNode("lendingMarket", accountValueNode("lendingMarket")),
        pdaSeedValueNode("mint", accountValueNode("reserveLiquidityMint")),
      ]),
    },
    {
      account: "reserveCollateralMint",
      defaultValue: pdaValueNode(pdaLinkNode("reserveCollateralMint"), [
        pdaSeedValueNode("lendingMarket", accountValueNode("lendingMarket")),
        pdaSeedValueNode("mint", accountValueNode("reserveLiquidityMint")),
      ]),
    },
    {
      account: "reserveCollateralSupply",
      defaultValue: pdaValueNode(pdaLinkNode("reserveCollateralSupply"), [
        pdaSeedValueNode("lendingMarket", accountValueNode("lendingMarket")),
        pdaSeedValueNode("mint", accountValueNode("reserveLiquidityMint")),
      ]),
    },
    {
      instruction: "initGlobalConfig",
      account: "globalConfig",
      defaultValue: pdaValueNode(pdaLinkNode("lendingGlobalConfigState")),
    },
    {
      account: "lendingMarketAuthority",
      defaultValue: pdaValueNode(pdaLinkNode("lendingMarketAuth"), [
        pdaSeedValueNode("lendingMarket", accountValueNode("lendingMarket")),
      ]),
    },
    {
      account: /sysvarInfo|[\w+][iI]nstructionSysvarAccount/,
      defaultValue: SYSVAR_INSTRUCTIONS_VALUE_NODE,
    },
    {
      account: "farmsProgram",
      defaultValue: programLinkNode("farms"),
    },
  ],
  visitors: [
    addPdasVisitor({
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
    updateAccountsVisitor({
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
